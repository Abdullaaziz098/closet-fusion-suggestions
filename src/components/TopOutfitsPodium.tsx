
import React from "react";
import { OutfitSuggestion, ClothingItem } from "@/types/clothing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Trophy, Award, Medal } from "lucide-react";

interface TopOutfitsPodiumProps {
  suggestions: OutfitSuggestion[];
  findClothingItem: (id: string) => ClothingItem | undefined;
}

// Define medal colors and positions
const positions = [
  { index: 1, color: "bg-amber-500", label: "Gold", delay: 0.2, icon: Trophy },   // Gold (center)
  { index: 0, color: "bg-gray-300", label: "Silver", delay: 0.3, icon: Medal },   // Silver (left)
  { index: 2, color: "bg-amber-700", label: "Bronze", delay: 0.4, icon: Award },  // Bronze (right)
];

const TopOutfitsPodium = ({ suggestions, findClothingItem }: TopOutfitsPodiumProps) => {
  // Sort podium positions
  const sortedPositions = [...positions].sort((a, b) => {
    // We're sorting for display: Silver (left), Gold (center), Bronze (right)
    return a.index - b.index;
  });

  return (
    <div className="w-full">
      {/* Top winners area */}
      <div className="flex flex-col md:flex-row justify-center items-end gap-4 mb-6">
        {sortedPositions.map((position, idx) => {
          const suggestion = suggestions[position.index];
          if (!suggestion) return null;
          
          const top = findClothingItem(suggestion.topId);
          const bottom = findClothingItem(suggestion.bottomId);
          if (!top || !bottom) return null;

          const Icon = position.icon;
          const scorePercentage = Math.round(suggestion.score * 100);
          const podiumHeight = position.index === 1 
            ? "h-[300px] md:h-[400px]" 
            : position.index === 0 
              ? "h-[240px] md:h-[320px]" 
              : "h-[200px] md:h-[280px]";

          return (
            <motion.div
              key={position.index}
              className={cn(
                "flex flex-col items-center relative",
                position.index === 1 ? "order-first md:order-none" : ""
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: position.delay }}
            >
              {/* Medal ribbon */}
              <div className={cn(
                "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
                "w-16 h-16 rounded-full flex items-center justify-center",
                position.color,
                "shadow-lg border-4 border-white dark:border-gray-800"
              )}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Outfit card */}
              <Card 
                className={cn(
                  "w-full max-w-[260px] overflow-hidden bg-card hover:shadow-xl transition-shadow",
                  "border-t-4",
                  position.color,
                  "animate-scale-in"
                )}
              >
                <div className="relative">
                  <div className="flex flex-col">
                    <div className={cn("relative overflow-hidden", podiumHeight)}>
                      <div className="absolute inset-0 flex flex-col">
                        <div className="flex-1 relative">
                          <img
                            src={top.imageUrl}
                            alt={top.name || "Top Item"}
                            className="object-contain w-full h-full p-2"
                          />
                        </div>
                        <div className="flex-1 relative">
                          <img
                            src={bottom.imageUrl}
                            alt={bottom.name || "Bottom Item"}
                            className="object-contain w-full h-full p-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 text-center">
                  <Badge 
                    variant="outline" 
                    className={cn("font-medium mb-2 text-sm border-2", 
                      position.index === 1 ? "border-amber-500" :
                      position.index === 0 ? "border-gray-300" :
                      "border-amber-700"
                    )}
                  >
                    {position.label} • {scorePercentage}% Match
                  </Badge>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {suggestion.matchReason}
                  </p>
                </div>
              </Card>

              {/* Podium base */}
              <div className={cn(
                "w-full max-w-[260px] h-8 mt-2 rounded-t-lg",
                position.index === 1 
                  ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400"
                  : position.index === 0 
                    ? "bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300"
                    : "bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800",
              )}></div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TopOutfitsPodium;
