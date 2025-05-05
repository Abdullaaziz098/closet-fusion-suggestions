
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import OutfitCard from "@/components/OutfitCard";
import { Button } from "@/components/ui/button";
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { generateOutfitSuggestions } from "@/utils/outfitGenerator";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Suggestions = () => {
  const { toast } = useToast();
  const [tops, setTops] = useState<ClothingItem[]>([]);
  const [bottoms, setBottoms] = useState<ClothingItem[]>([]);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Load saved items from localStorage on component mount
  useEffect(() => {
    setLoading(true);
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
    } else {
      setLoading(false);
    }
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
      const outfitSuggestions = await generateOutfitSuggestions(topsItems, bottomsItems);
      setSuggestions(outfitSuggestions);

      toast({
        title: "Suggestions updated",
        description: `Generated ${outfitSuggestions.length} outfit suggestions using AI analysis`,
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
      setLoading(false);
    }
  };

  const regenerateSuggestions = () => {
    generateSuggestions();
  };

  const findClothingItem = (id: string): ClothingItem | undefined => {
    return [...tops, ...bottoms].find((item) => item.id === id);
  };

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
          <div className="text-center py-12 bg-muted/20 rounded-lg">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold mb-4 sm:mb-0">Outfit Suggestions</h1>
          <Button onClick={regenerateSuggestions} disabled={generating}>
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Refresh Suggestions"
            )}
          </Button>
        </div>

        {generating ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Using AI to analyze your outfit combinations...
              </p>
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="closet-grid">
            {suggestions.slice(0, 12).map((suggestion) => {
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
        ) : (
          <div className="text-center py-12">
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
