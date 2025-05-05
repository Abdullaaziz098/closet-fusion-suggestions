
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { motion } from "framer-motion";
import { Star, StarHalf } from "lucide-react";

interface OutfitCardProps {
  suggestion: OutfitSuggestion;
  top: ClothingItem;
  bottom: ClothingItem;
}

const OutfitCard = ({ suggestion, top, bottom }: OutfitCardProps) => {
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
      className="hover-scale"
    >
      <Card className="overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="aspect-square">
            <img
              src={top.imageUrl}
              alt={top.name || "Top"}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="aspect-square">
            <img
              src={bottom.imageUrl}
              alt={bottom.name || "Bottom"}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              {scorePercentage >= 70 ? (
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
              ) : (
                <StarHalf className="h-4 w-4 text-yellow-500 mr-1" />
              )}
              <h3 className="font-semibold text-lg">{matchQuality}</h3>
            </div>
            <Badge variant={badgeVariant as any} className="font-normal">
              {scorePercentage}% Match
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {suggestion.matchReason}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default OutfitCard;
