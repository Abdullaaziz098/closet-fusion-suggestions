import { useState, useEffect, useCallback } from "react";
import Layout from "@/components/Layout";
import OutfitCard from "@/components/OutfitCard";
import TopOutfitsPodium from "@/components/TopOutfitsPodium";
import { Button } from "@/components/ui/button";
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { generateOutfitSuggestions } from "@/utils/outfitGenerator";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Loader2, Wand2, Filter, SlidersHorizontal, Image, WandSparkles, Calendar } from "lucide-react";
import { fetchClothingItems } from "@/services/clothingService";
import { testGeminiConnection } from "@/utils/geminiService";
import { Badge } from "@/components/ui/badge";
import { removeBackground } from "@/utils/backgroundRemoval";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import WeeklyOutfitSuggestion from "@/components/WeeklyOutfitSuggestion";

const Suggestions = () => {
  const { toast } = useToast();
  const [tops, setTops] = useState<ClothingItem[]>([]);
  const [bottoms, setBottoms] = useState<ClothingItem[]>([]);
  const [processedTops, setProcessedTops] = useState<ClothingItem[]>([]);
  const [processedBottoms, setProcessedBottoms] = useState<ClothingItem[]>([]);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<boolean | null>(null);
  const [minMatchScore, setMinMatchScore] = useState(0); // Default no filter
  const [backgroundsRemoved, setBackgroundsRemoved] = useState(false);
  const [weeklyOutfitVisible, setWeeklyOutfitVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Removing backgrounds from your clothing...");
  const [showPodium, setShowPodium] = useState(true);

  // Loading messages for background removal
  const backgroundRemovalMessages = [
    "Removing backgrounds from your clothing...",
    "Applying advanced image processing...",
    "Extracting clothing items from backgrounds...",
    "Preparing your virtual wardrobe...",
    "Creating transparent backgrounds for better matching...",
  ];
  
  // Loading messages for outfit generation
  const outfitGenerationMessages = [
    "Analyzing your outfit combinations...",
    "Matching colors and styles...",
    "Applying fashion expertise to your wardrobe...",
    "Finding the perfect outfit pairings...",
    "Creating personalized style recommendations...",
  ];

  // Message rotation effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (processing) {
      let index = 0;
      interval = window.setInterval(() => {
        setLoadingMessage(backgroundRemovalMessages[index % backgroundRemovalMessages.length]);
        index++;
      }, 3000);
    } else if (generating) {
      let index = 0;
      interval = window.setInterval(() => {
        setLoadingMessage(outfitGenerationMessages[index % outfitGenerationMessages.length]);
        index++;
      }, 3000);
    }
    
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [processing, generating]);

  // Check Gemini API connection
  useEffect(() => {
    const checkGeminiConnection = async () => {
      const isConnected = await testGeminiConnection();
      setGeminiStatus(isConnected);
      
      if (!isConnected) {
        toast({
          title: "Gemini API Status",
          description: "Using fallback outfit matching. AI-powered analysis may be limited.",
          variant: "default",
        });
      }
    };
    
    checkGeminiConnection();
  }, [toast]);

  // Load saved items from Supabase on component mount
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const fetchedTops = await fetchClothingItems('top');
        const fetchedBottoms = await fetchClothingItems('bottom');
        
        setTops(fetchedTops);
        setBottoms(fetchedBottoms);
        
        // No longer automatically generating suggestions
        setProcessedTops(fetchedTops.map(top => ({ ...top })));
        setProcessedBottoms(fetchedBottoms.map(bottom => ({ ...bottom })));
      } catch (error) {
        console.error("Failed to load clothing items:", error);
        
        // Fall back to localStorage
        const savedTops = localStorage.getItem("closet-fusion-tops");
        const savedBottoms = localStorage.getItem("closet-fusion-bottoms");

        let parsedTops: ClothingItem[] = [];
        let parsedBottoms: ClothingItem[] = [];

        if (savedTops) {
          try {
            parsedTops = JSON.parse(savedTops);
            setTops(parsedTops);
            setProcessedTops(parsedTops.map(top => ({ ...top })));
          } catch (error) {
            console.error("Failed to parse saved tops", error);
          }
        }

        if (savedBottoms) {
          try {
            parsedBottoms = JSON.parse(savedBottoms);
            setBottoms(parsedBottoms);
            setProcessedBottoms(parsedBottoms.map(bottom => ({ ...bottom })));
          } catch (error) {
            console.error("Failed to parse saved bottoms", error);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const processBackgrounds = async () => {
    if (tops.length === 0 || bottoms.length === 0) {
      toast({
        title: "Not enough items",
        description: "You need at least one top and one bottom to process images",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      toast({
        title: "Processing images",
        description: "Removing backgrounds from your clothing items...",
      });

      // Process tops
      const newProcessedTops = await Promise.all(
        tops.map(async (top) => {
          const processedImageUrl = await removeBackground(top.imageUrl);
          return { ...top, imageUrl: processedImageUrl };
        })
      );

      // Process bottoms
      const newProcessedBottoms = await Promise.all(
        bottoms.map(async (bottom) => {
          const processedImageUrl = await removeBackground(bottom.imageUrl);
          return { ...bottom, imageUrl: processedImageUrl };
        })
      );

      setProcessedTops(newProcessedTops);
      setProcessedBottoms(newProcessedBottoms);
      setBackgroundsRemoved(true);

      toast({
        title: "Images processed",
        description: "Backgrounds removed successfully. Ready for outfit analysis.",
      });
    } catch (error) {
      console.error("Failed to process backgrounds:", error);
      toast({
        title: "Error processing images",
        description: "There was a problem removing backgrounds. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const generateSuggestions = async () => {
    if (processedTops.length === 0 || processedBottoms.length === 0) {
      toast({
        title: "Not enough items",
        description: "You need at least one top and one bottom to generate suggestions",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      console.log("Generating outfit suggestions with Gemini status:", geminiStatus);
      const outfitSuggestions = await generateOutfitSuggestions(processedTops, processedBottoms);
      setSuggestions(outfitSuggestions);

      toast({
        title: "Suggestions updated",
        description: `Generated ${outfitSuggestions.length} outfit suggestions${geminiStatus ? " using AI analysis" : ""}`,
      });
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
      toast({
        title: "Error generating suggestions",
        description: "There was a problem analyzing your outfits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const findClothingItem = (id: string): ClothingItem | undefined => {
    // First look in processed items
    const processedItem = [...processedTops, ...processedBottoms].find(
      (item) => item.id === id
    );
    
    if (processedItem) return processedItem;
    
    // Fall back to original items if not found
    return [...tops, ...bottoms].find((item) => item.id === id);
  };

  const generateWeeklyOutfits = useCallback(() => {
    if (suggestions.length === 0) {
      toast({
        title: "No suggestions available",
        description: "Please generate outfit suggestions first",
        variant: "destructive",
      });
      return;
    }
    
    setWeeklyOutfitVisible(true);
  }, [suggestions.length, toast]);

  // Filter suggestions based on the minimum match score
  const filteredSuggestions = suggestions.filter(
    suggestion => suggestion.score * 100 >= minMatchScore
  );
  
  // Get suggestions excluding top 3 for regular display
  const regularSuggestions = showPodium && filteredSuggestions.length > 3
    ? [...filteredSuggestions]
        .sort((a, b) => b.score - a.score)
        .slice(3)
    : filteredSuggestions;

  if (loading) {
    return (
      <Layout>
        <div className="container px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-2"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading suggestions...</p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (tops.length === 0 || bottoms.length === 0) {
    return (
      <Layout>
        <div className="container px-4 py-8 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12 bg-muted/20 rounded-lg border"
          >
            <h2 className="text-2xl font-semibold mb-4">
              Not enough items in your closet
            </h2>
            <p className="text-muted-foreground mb-6">
              You need at least one top and one bottom to generate outfit suggestions.
            </p>
            <Button asChild>
              <Link to="/closet">Add Items to Your Closet</Link>
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="container px-4 py-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Outfit Suggestions</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">
                AI-powered outfit combinations based on your closet
              </p>
              {geminiStatus !== null && (
                <Badge variant={geminiStatus ? "default" : "outline"} className="text-xs font-normal">
                  {geminiStatus ? "AI Enhanced" : "Basic Matching"}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap justify-end">
            <Button 
              onClick={processBackgrounds} 
              disabled={processing || backgroundsRemoved}
              variant={backgroundsRemoved ? "outline" : "secondary"}
              className="hover-lift"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : backgroundsRemoved ? (
                <>
                  <Image className="mr-2 h-4 w-4" />
                  Backgrounds Removed
                </>
              ) : (
                <>
                  <Image className="mr-2 h-4 w-4" />
                  Remove Backgrounds
                </>
              )}
            </Button>
            
            <Button 
              onClick={generateSuggestions} 
              disabled={generating || (!backgroundsRemoved && tops.length > 0 && bottoms.length > 0)}
              className="hover-lift"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <WandSparkles className="mr-2 h-4 w-4" />
                  Generate Suggestions
                </>
              )}
            </Button>
            
            {suggestions.length > 0 && (
              <Button 
                onClick={generateWeeklyOutfits}
                variant="outline"
                className="hover-lift"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Weekly Planner
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hover-lift">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Match Quality</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem 
                  checked={minMatchScore === 0}
                  onCheckedChange={() => setMinMatchScore(0)}
                >
                  Show All
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={minMatchScore === 50}
                  onCheckedChange={() => setMinMatchScore(50)}
                >
                  50%+ Match
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={minMatchScore === 70}
                  onCheckedChange={() => setMinMatchScore(70)}
                >
                  70%+ Match
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem 
                  checked={minMatchScore === 85}
                  onCheckedChange={() => setMinMatchScore(85)}
                >
                  85%+ Match (Perfect)
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <AnimatePresence>
          {!backgroundsRemoved && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-8 p-6 border rounded-lg bg-gradient-to-r from-muted/10 to-background"
            >
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-semibold mb-2"
              >
                Ready to create outfit suggestions?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4 text-muted-foreground"
              >
                First, remove the backgrounds from your clothing items to create cleaner outfit visualizations.
                Then generate AI-powered outfit suggestions based on style and color matching.
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button onClick={processBackgrounds} disabled={processing} className="hover-lift">
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Images...
                    </>
                  ) : (
                    <>
                      <Image className="mr-2 h-4 w-4" />
                      Step 1: Remove Backgrounds
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {backgroundsRemoved && suggestions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mb-8 p-6 border rounded-lg bg-gradient-to-r from-muted/10 to-background"
            >
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-semibold mb-2"
              >
                Backgrounds removed successfully!
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4 text-muted-foreground"
              >
                Your clothing items now have transparent backgrounds. Ready to generate AI outfit suggestions?
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button onClick={generateSuggestions} disabled={generating} className="hover-lift">
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Outfits...
                    </>
                  ) : (
                    <>
                      <WandSparkles className="mr-2 h-4 w-4" />
                      Step 2: Generate Suggestions
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(processing || generating) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center py-12"
            >
              <div className="flex flex-col items-center gap-4 max-w-md p-8 rounded-xl bg-gradient-to-b from-background to-muted/20 shadow-sm">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                  <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
                </motion.div>
                
                <div className="text-center">
                  <motion.p 
                    key={loadingMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="font-medium text-lg"
                  >
                    {loadingMessage}
                  </motion.p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This may take a few moments
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {weeklyOutfitVisible && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <WeeklyOutfitSuggestion 
                suggestions={suggestions} 
                findClothingItem={findClothingItem}
                onClose={() => setWeeklyOutfitVisible(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!processing && !generating && !weeklyOutfitVisible && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {minMatchScore > 0 && (
                <div className="mb-4 flex items-center">
                  <Badge variant="outline" className="mr-2">
                    Filtered: {minMatchScore}%+ match
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setMinMatchScore(0)}
                    className="h-7 text-xs"
                  >
                    Clear filter
                  </Button>
                </div>
              )}
              
              {/* Top Outfits Podium for top 3 suggestions */}
              {showPodium && filteredSuggestions.length >= 3 && (
                <TopOutfitsPodium 
                  suggestions={filteredSuggestions}
                  findClothingItem={findClothingItem}
                />
              )}
              
              {/* Regular grid display for the rest or all if no podium */}
              {regularSuggestions.length > 0 && (
                <div>
                  {showPodium && filteredSuggestions.length > 3 && (
                    <h3 className="text-xl font-medium mb-4">Other Suggestions</h3>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {regularSuggestions.map((suggestion, index) => {
                      const top = findClothingItem(suggestion.topId);
                      const bottom = findClothingItem(suggestion.bottomId);

                      if (!top || !bottom) return null;

                      return (
                        <OutfitCard
                          key={suggestion.id}
                          suggestion={suggestion}
                          top={top}
                          bottom={bottom}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!processing && !generating && suggestions.length > 0 && filteredSuggestions.length === 0 && !weeklyOutfitVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12 border rounded-lg"
            >
              <p className="text-lg font-medium mb-2">No matching outfits</p>
              <p className="text-muted-foreground mb-4">
                No outfits meet your current filter criteria of {minMatchScore}%+ match quality.
              </p>
              <Button 
                variant="outline"
                onClick={() => setMinMatchScore(0)}
              >
                Clear filter
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default Suggestions;
