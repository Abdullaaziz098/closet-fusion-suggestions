
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { motion } from "framer-motion";
import { Star, StarHalf, Heart, Share2, ArrowRight, Check } from "lucide-react";
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
  rank?: number;
  isPodium?: boolean;
}

const OutfitCard = ({ suggestion, top, bottom, rank, isPodium }: OutfitCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShared, setIsShared] = useState(false);
  
  // Convert score to a percentage and round to nearest integer
  const scorePercentage = Math.round(suggestion.score * 100);
  
  // Determine match quality badge
  let matchQuality = "Fair Match";
  let badgeVariant: "outline" | "default" | "secondary" | "destructive" = "outline";
  
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
  
  // Special podium styles
  let podiumClass = "";
  let medalClass = "";
  let delayClass = "";
  
  if (isPodium) {
    if (rank === 1) {
      podiumClass = "ring-2 ring-yellow-400/50 bg-gradient-to-b from-yellow-50 to-transparent shine-gold";
      medalClass = "bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900";
      delayClass = "delay-100";
    } else if (rank === 2) {
      podiumClass = "ring-1 ring-slate-300/70 bg-gradient-to-b from-slate-100 to-transparent";
      medalClass = "bg-gradient-to-r from-slate-300 to-slate-400 text-slate-800";
      delayClass = "delay-200";
    } else if (rank === 3) {
      podiumClass = "ring-1 ring-amber-300/50 bg-gradient-to-b from-amber-50 to-transparent";
      medalClass = "bg-gradient-to-r from-amber-600 to-amber-700 text-amber-100";
      delayClass = "delay-300";
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: rank ? rank * 0.1 : 0 }}
      className={cn(
        "group podium-enter",
        isPodium && delayClass
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Card className={cn(
        "overflow-hidden bg-background hover:shadow-md transition-all duration-300",
        isPodium && podiumClass,
        isPodium ? "card-hover" : "card-3d"
      )}>
        {isPodium && rank && (
          <div className="absolute top-0 left-0 right-0 flex justify-center -mt-4 z-10">
            <motion.div
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.3 + (rank * 0.1), type: "spring" }}
            >
              <Badge 
                className={cn(
                  "font-bold text-sm px-4 py-1 shadow-md",
                  medalClass
                )}
              >
                #{rank}
              </Badge>
            </motion.div>
          </div>
        )}
        
        <div className="relative">
          <div className="grid grid-cols-2">
            <div className="aspect-square relative overflow-hidden">
              <motion.img
                src={top.imageUrl}
                alt={top.name || "Top"}
                className="object-cover w-full h-full"
                animate={{
                  scale: isHovering ? 1.08 : 1
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
              {isPodium && rank === 1 && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-tr from-transparent via-yellow-400/10 to-transparent opacity-60"></div>
              )}
            </div>
            <div className="aspect-square relative overflow-hidden">
              <motion.img
                src={bottom.imageUrl}
                alt={bottom.name || "Bottom"}
                className="object-cover w-full h-full"
                animate={{
                  scale: isHovering ? 1.08 : 1
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <ArrowRight className={cn(
                  "h-8 w-8 text-white bg-black/50 rounded-full p-1.5 transition-opacity",
                  isHovering ? "opacity-0" : "opacity-30"
                )} />
              </div>
              {isPodium && rank === 1 && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-bl from-transparent via-yellow-400/10 to-transparent opacity-60"></div>
              )}
            </div>
          </div>
          
          <div className="absolute top-2 left-0 right-0 flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Badge 
                variant={badgeVariant} 
                className="font-medium text-xs px-3 py-1 shadow-md"
              >
                {scorePercentage}% Match
              </Badge>
            </motion.div>
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
                    <Button 
                      variant={isFavorite ? "default" : "ghost"} 
                      size="icon" 
                      className={cn(
                        "h-8 w-8",
                        isFavorite && "bg-primary/90 text-white"
                      )}
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFavorite ? "Remove from favorites" : "Save outfit"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={isShared ? "default" : "ghost"} 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setIsShared(!isShared)}
                    >
                      {isShared ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Share2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isShared ? "Shared!" : "Share outfit"}</p>
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
