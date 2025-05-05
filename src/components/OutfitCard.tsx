
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { motion } from "framer-motion";

interface OutfitCardProps {
  suggestion: OutfitSuggestion;
  top: ClothingItem;
  bottom: ClothingItem;
}

const OutfitCard = ({ suggestion, top, bottom }: OutfitCardProps) => {
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
              alt="Top"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="aspect-square">
            <img
              src={bottom.imageUrl}
              alt="Bottom"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">Outfit Suggestion</h3>
            <Badge variant="outline" className="font-normal">
              {Math.round(suggestion.score * 100)}% Match
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
