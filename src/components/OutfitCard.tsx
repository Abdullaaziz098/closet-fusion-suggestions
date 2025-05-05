
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { motion } from "framer-motion";
import { Star, StarHalf, Heart, Share2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface OutfitCardProps {
  suggestion: OutfitSuggestion;
  top: ClothingItem;
  bottom: ClothingItem;
}

const OutfitCard = ({ suggestion, top, bottom }: OutfitCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Convert score to a percentage and round to nearest integer
  const scorePercentage = Math.round(suggestion.score * 100);
  
  // Determine match quality badge
  let matchQuality = "Fair Match";
  let badgeVariant = "outline";
  
  if (scorePercentage >= 85) {
    matchQuality = "Perfect Match";
    badgeVariant = "default";
  } else if (scorePercentage >= 70) {
    matchQuality = "Great Match";
    badgeVariant = "secondary";
  } else if (scorePercentage >= 50) {
    matchQuality = "Good Match";
    badgeVariant = "outline";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Card className="overflow-hidden bg-background hover:shadow-md transition-shadow">
        <div className="relative">
          <div className="grid grid-cols-2">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={top.imageUrl}
                alt={top.name || "Top"}
                className={cn(
                  "object-cover w-full h-full transition-all duration-300",
                  isHovering && "scale-105"
                )}
              />
            </div>
            <div className="aspect-square relative overflow-hidden">
              <img
                src={bottom.imageUrl}
                alt={bottom.name || "Bottom"}
                className={cn(
                  "object-cover w-full h-full transition-all duration-300",
                  isHovering && "scale-105"
                )}
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <ArrowRight className={cn(
                  "h-8 w-8 text-white bg-black/50 rounded-full p-1.5 transition-opacity",
                  isHovering ? "opacity-0" : "opacity-30"
                )} />
              </div>
            </div>
          </div>
          
          <div className="absolute top-2 left-0 right-0 flex justify-center">
            <Badge 
              variant={badgeVariant as any} 
              className="font-medium text-xs px-3 py-1 shadow-md"
            >
              {scorePercentage}% Match
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              {scorePercentage >= 70 ? (
                <Star className="h-4 w-4 text-yellow-500 mr-1.5" />
              ) : (
                <StarHalf className="h-4 w-4 text-yellow-500 mr-1.5" />
              )}
              <h3 className="font-semibold">{matchQuality}</h3>
            </div>
            <div className="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save outfit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share outfit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {suggestion.matchReason}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default OutfitCard;
