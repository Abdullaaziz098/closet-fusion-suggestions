
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import OutfitCard from "@/components/OutfitCard";
import { Button } from "@/components/ui/button";
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { generateOutfitSuggestions } from "@/utils/outfitGenerator";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Loader2, Wand2, Filter, SlidersHorizontal } from "lucide-react";
import { fetchClothingItems } from "@/services/clothingService";
import { testGeminiConnection } from "@/utils/geminiService";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Suggestions = () => {
  const { toast } = useToast();
  const [tops, setTops] = useState<ClothingItem[]>([]);
  const [bottoms, setBottoms] = useState<ClothingItem[]>([]);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<boolean | null>(null);
  const [minMatchScore, setMinMatchScore] = useState(0); // Default no filter

  // Check Gemini API connection
  useEffect(() => {
    const checkGeminiConnection = async () => {
      const isConnected = await testGeminiConnection();
      setGeminiStatus(isConnected);
      
      if (!isConnected) {
        toast({
          title: "Gemini API Status",
          description: "Using fallback outfit matching. AI-powered analysis may be limited.",
          variant: "warning",
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
        
        if (fetchedTops.length > 0 && fetchedBottoms.length > 0) {
          await generateSuggestions(fetchedTops, fetchedBottoms);
        }
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
          } catch (error) {
            console.error("Failed to parse saved tops", error);
          }
        }

        if (savedBottoms) {
          try {
            parsedBottoms = JSON.parse(savedBottoms);
            setBottoms(parsedBottoms);
          } catch (error) {
            console.error("Failed to parse saved bottoms", error);
          }
        }

        if (parsedTops.length > 0 && parsedBottoms.length > 0) {
          generateSuggestions(parsedTops, parsedBottoms);
        }
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const generateSuggestions = async (topsItems = tops, bottomsItems = bottoms) => {
    if (topsItems.length === 0 || bottomsItems.length === 0) {
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
      const outfitSuggestions = await generateOutfitSuggestions(topsItems, bottomsItems);
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

  const regenerateSuggestions = () => {
    generateSuggestions();
  };

  const findClothingItem = (id: string): ClothingItem | undefined => {
    return [...tops, ...bottoms].find((item) => item.id === id);
  };

  // Filter suggestions based on the minimum match score
  const filteredSuggestions = suggestions.filter(
    suggestion => suggestion.score * 100 >= minMatchScore
  );

  if (loading) {
    return (
      <Layout>
        <div className="container px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading suggestions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (tops.length === 0 || bottoms.length === 0) {
    return (
      <Layout>
        <div className="container px-4 py-8 max-w-3xl mx-auto">
          <div className="text-center py-12 bg-muted/20 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">
              Not enough items in your closet
            </h2>
            <p className="text-muted-foreground mb-6">
              You need at least one top and one bottom to generate outfit suggestions.
            </p>
            <Button asChild>
              <Link to="/closet">Add Items to Your Closet</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-8">
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
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
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
            
            <Button onClick={regenerateSuggestions} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate New
                </>
              )}
            </Button>
          </div>
        </div>

        {generating ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium">Analyzing your outfit combinations...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Using AI to find the best matches for your style
                </p>
              </div>
            </div>
          </div>
        ) : filteredSuggestions.length > 0 ? (
          <>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredSuggestions.map((suggestion) => {
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
          </>
        ) : suggestions.length > 0 ? (
          <div className="text-center py-12 border rounded-lg">
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
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">
              No suggestions available. Try refreshing suggestions.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Suggestions;
