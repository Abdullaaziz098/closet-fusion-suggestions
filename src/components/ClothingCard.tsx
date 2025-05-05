
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClothingItem } from "@/types/clothing";
import { Trash } from "lucide-react";
import { motion } from "framer-motion";

interface ClothingCardProps {
  item: ClothingItem;
  onDelete: (id: string) => void;
}

const ClothingCard = ({ item, onDelete }: ClothingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="hover-scale"
    >
      <Card className="overflow-hidden">
        <div className="aspect-square relative">
          <img
            src={item.imageUrl}
            alt={item.name || `${item.type} item`}
            className="object-cover w-full h-full"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-80 hover:opacity-100"
            onClick={() => onDelete(item.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-3">
          <p className="font-medium truncate">{item.name || `${item.type} item`}</p>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate">{item.style} • {item.fabric}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ClothingCard;
