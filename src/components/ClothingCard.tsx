
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClothingItem } from "@/types/clothing";
import { Trash, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ClothingCardProps {
  item: ClothingItem;
  onDelete: (id: string) => void;
}

const ClothingCard = ({ item, onDelete }: ClothingCardProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(item.added);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Card className="overflow-hidden bg-background hover:shadow-md transition-shadow">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name || `${item.type} item`}
            className={cn(
              "object-cover w-full h-full transition-transform duration-300",
              isHovering && "scale-105"
            )}
          />
          
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
            <div>
              <Badge variant="secondary" className="mb-1 text-xs font-normal">
                {item.style}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full backdrop-blur-sm bg-background/50"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-full backdrop-blur-sm bg-destructive/70"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Badge 
            variant="outline" 
            className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
          >
            {formattedDate}
          </Badge>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium truncate">
              {item.name || `${item.type.charAt(0).toUpperCase()}${item.type.slice(1)} Item`}
            </h3>
            <span
              className="w-4 h-4 rounded-full ring-1 ring-border"
              style={{ backgroundColor: item.color }}
            />
          </div>
          <p className="text-sm text-muted-foreground truncate">{item.fabric}</p>
        </div>
      </Card>
    </motion.div>
  );
};

export default ClothingCard;
