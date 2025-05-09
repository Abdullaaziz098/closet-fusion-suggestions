
import { useState, useEffect } from "react";
import { OutfitSuggestion, ClothingItem } from "@/types/clothing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

interface WeeklyOutfitProps {
  suggestions: OutfitSuggestion[];
  findClothingItem: (id: string) => ClothingItem | undefined;
  onClose: () => void;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const WeeklyOutfitSuggestion = ({ suggestions, findClothingItem, onClose }: WeeklyOutfitProps) => {
  const [weeklyOutfits, setWeeklyOutfits] = useState<OutfitSuggestion[]>([]);
  
  useEffect(() => {
    // Generate a different outfit for each day of the week
    // We'll try to select higher-scoring outfits but ensure variety
    const generateWeeklyPlan = () => {
      // Sort suggestions by score (highest first)
      const sortedSuggestions = [...suggestions].sort((a, b) => b.score - a.score);
      
      // Take top outfits but ensure variety by not using the same top/bottom twice if possible
      const selectedOutfits: OutfitSuggestion[] = [];
      const usedTops = new Set<string>();
      const usedBottoms = new Set<string>();
      
      // First pass: try to get 7 unique outfits
      for (const suggestion of sortedSuggestions) {
        if (selectedOutfits.length >= 7) break;
        
        // Prefer outfits where neither piece has been used
        if (!usedTops.has(suggestion.topId) && !usedBottoms.has(suggestion.bottomId)) {
          selectedOutfits.push(suggestion);
          usedTops.add(suggestion.topId);
          usedBottoms.add(suggestion.bottomId);
        }
      }
      
      // Second pass: if we don't have 7 outfits, allow reusing some items
      if (selectedOutfits.length < 7) {
        for (const suggestion of sortedSuggestions) {
          if (selectedOutfits.length >= 7) break;
          
          // Skip outfits we've already selected
          if (selectedOutfits.some(outfit => outfit.id === suggestion.id)) {
            continue;
          }
          
          // Allow reusing one piece if necessary
          selectedOutfits.push(suggestion);
          usedTops.add(suggestion.topId);
          usedBottoms.add(suggestion.bottomId);
        }
      }
      
      // If we still don't have 7 outfits, we'll need to repeat some
      while (selectedOutfits.length < 7 && suggestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * suggestions.length);
        selectedOutfits.push(suggestions[randomIndex]);
      }
      
      setWeeklyOutfits(selectedOutfits.slice(0, 7));
    };
    
    generateWeeklyPlan();
  }, [suggestions]);
  
  return (
    <div className="mb-8 rounded-lg border bg-card p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Weekly Outfit Planner</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Here's your AI-generated outfit plan for the week, with a different look for each day.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {weeklyOutfits.map((outfit, index) => {
          const day = DAYS_OF_WEEK[index];
          const top = findClothingItem(outfit.topId);
          const bottom = findClothingItem(outfit.bottomId);
          
          if (!top || !bottom) return null;
          
          return (
            <Card key={day} className="p-4 flex flex-col">
              <div className="font-medium text-lg mb-2">{day}</div>
              
              <div className="flex flex-col items-center gap-2 flex-grow">
                <div className="relative w-full pt-[100%] bg-muted/20 rounded-md overflow-hidden mb-1">
                  <img 
                    src={top.imageUrl} 
                    alt={top.name || `${top.color} ${top.style} top`}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
                <div className="relative w-full pt-[100%] bg-muted/20 rounded-md overflow-hidden">
                  <img 
                    src={bottom.imageUrl} 
                    alt={bottom.name || `${bottom.color} ${bottom.style} bottom`}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Match Score</span>
                  <span className="text-sm font-medium">{Math.round(outfit.score * 100)}%</span>
                </div>
                <Progress value={outfit.score * 100} className="h-2" />
              </div>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button variant="outline" onClick={onClose}>
          Return to Suggestions
        </Button>
      </div>
    </div>
  );
};

export default WeeklyOutfitSuggestion;
