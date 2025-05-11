
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Loader2, RotateCw, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { useToast } from "@/hooks/use-toast";
import { fetchClothingItems } from "@/services/clothingService";
import { generateOutfitSuggestions } from "@/utils/outfitGenerator";
import { motion } from "framer-motion";
import FashionImagePreview from "@/components/FashionImagePreview";

const OutfitPreview3D = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [tops, setTops] = useState<ClothingItem[]>([]);
  const [bottoms, setBottoms] = useState<ClothingItem[]>([]);
  const [currentOutfit, setCurrentOutfit] = useState<{ top?: ClothingItem; bottom?: ClothingItem }>({});
  const [generating, setGenerating] = useState(false);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const fetchedTops = await fetchClothingItems('top');
        const fetchedBottoms = await fetchClothingItems('bottom');
        
        setTops(fetchedTops);
        setBottoms(fetchedBottoms);
      } catch (error) {
        console.error("Failed to load clothing items:", error);
        
        // Fall back to localStorage
        const savedTops = localStorage.getItem("closet-fusion-tops");
        const savedBottoms = localStorage.getItem("closet-fusion-bottoms");

        if (savedTops) {
          try {
            const parsedTops = JSON.parse(savedTops);
            setTops(parsedTops);
          } catch (error) {
            console.error("Failed to parse saved tops", error);
          }
        }

        if (savedBottoms) {
          try {
            const parsedBottoms = JSON.parse(savedBottoms);
            setBottoms(parsedBottoms);
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

  const generateSuggestions = async () => {
    if (tops.length === 0 || bottoms.length === 0) {
      toast({
        title: "Not enough items",
        description: "You need at least one top and one bottom to generate suggestions",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const outfitSuggestions = await generateOutfitSuggestions(tops, bottoms);
      setSuggestions(outfitSuggestions);
      
      if (outfitSuggestions.length > 0) {
        // Set the first suggestion
        const firstSuggestion = outfitSuggestions[0];
        const top = tops.find(item => item.id === firstSuggestion.topId);
        const bottom = bottoms.find(item => item.id === firstSuggestion.bottomId);
        
        setCurrentOutfit({ top, bottom });
        setCurrentSuggestionIndex(0);
      }

      toast({
        title: "Suggestions generated",
        description: `Generated ${outfitSuggestions.length} outfit suggestions`,
      });
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
      toast({
        title: "Error generating suggestions",
        description: "There was a problem generating outfit suggestions.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const nextOutfit = () => {
    if (suggestions.length === 0) return;
    
    const nextIndex = (currentSuggestionIndex + 1) % suggestions.length;
    const nextSuggestion = suggestions[nextIndex];
    
    const top = tops.find(item => item.id === nextSuggestion.topId);
    const bottom = bottoms.find(item => item.id === nextSuggestion.bottomId);
    
    setCurrentOutfit({ top, bottom });
    setCurrentSuggestionIndex(nextIndex);
  };

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
            <p className="text-muted-foreground">Loading items from your closet...</p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Fashion Preview</h1>
          <p className="text-muted-foreground">
            See your outfit suggestions on a virtual fashion model
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 h-[60vh] rounded-xl bg-gradient-to-tr from-muted/50 to-background/50 border overflow-hidden shadow-md">
            <FashionImagePreview 
              top={currentOutfit.top} 
              bottom={currentOutfit.bottom}
              onRefresh={nextOutfit}
            />
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-card p-6 rounded-xl border shadow-sm mb-6"
            >
              <h2 className="text-xl font-semibold mb-4">Outfit Details</h2>
              {currentOutfit.top || currentOutfit.bottom ? (
                <div className="space-y-4">
                  {currentOutfit.top && (
                    <div>
                      <p className="text-sm font-medium">Top</p>
                      <p className="text-muted-foreground">
                        {currentOutfit.top.name || "Unnamed top"} ({currentOutfit.top.color})
                      </p>
                    </div>
                  )}
                  {currentOutfit.bottom && (
                    <div>
                      <p className="text-sm font-medium">Bottom</p>
                      <p className="text-muted-foreground">
                        {currentOutfit.bottom.name || "Unnamed bottom"} ({currentOutfit.bottom.color})
                      </p>
                    </div>
                  )}
                  {suggestions.length > 0 && (
                    <div className="pt-2">
                      <p className="text-sm font-medium">Match Score</p>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${suggestions[currentSuggestionIndex].score * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round(suggestions[currentSuggestionIndex].score * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                  {suggestions.length > 0 && (
                    <div className="pt-1">
                      <p className="text-sm text-muted-foreground italic">
                        "{suggestions[currentSuggestionIndex].matchReason}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No outfit selected. Generate suggestions to see outfits on the fashion model.
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col gap-3"
            >
              <Button 
                onClick={generateSuggestions} 
                disabled={generating || tops.length === 0 || bottoms.length === 0}
                className="w-full"
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Outfit Suggestions
                  </>
                )}
              </Button>
              
              <Button 
                onClick={nextOutfit} 
                variant="secondary" 
                disabled={suggestions.length === 0}
                className="w-full"
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Next Outfit
              </Button>
            </motion.div>

            <div className="mt-6 bg-muted/50 rounded-lg border p-4">
              <h3 className="font-medium mb-2 text-sm">About This Feature</h3>
              <p className="text-sm text-muted-foreground">
                This feature uses AI to visualize your outfit combinations on a virtual fashion model.
                Select or generate outfit combinations to see how they might look when worn together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OutfitPreview3D;
