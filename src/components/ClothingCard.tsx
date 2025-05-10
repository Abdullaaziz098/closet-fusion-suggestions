
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClothingItem } from "@/types/clothing";
import { Trash, Heart, Info } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClothingCardProps {
  item: ClothingItem;
  onDelete: (id: string) => void;
  index?: number;
}

const ClothingCard = ({ item, onDelete, index = 0 }: ClothingCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [liked, setLiked] = useState(false);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(item.added);
  
  // Animation staggered delay
  const staggerDelay = index * 0.05;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: staggerDelay }}
      className="group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Card className="overflow-hidden bg-background hover:shadow-md transition-all duration-300 card-3d">
        <div className="aspect-square relative overflow-hidden">
          <motion.img
            src={item.imageUrl}
            alt={item.name || `${item.type} item`}
            className={cn(
              "object-cover w-full h-full"
            )}
            animate={{
              scale: isHovering ? 1.05 : 1
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          
          <motion.div 
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex justify-between items-end"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isHovering ? 1 : 0,
              y: isHovering ? 0 : 10
            }}
            transition={{ duration: 0.2 }}
          >
            <div>
              <Badge variant="secondary" className="mb-1 text-xs font-normal">
                {item.style}
              </Badge>
            </div>
            <div className="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-full backdrop-blur-sm transition-all",
                        liked ? "bg-primary/80 text-white" : "bg-background/50"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setLiked(!liked);
                      }}
                    >
                      <Heart 
                        className={cn(
                          "h-4 w-4 transition-transform", 
                          liked && "fill-current scale-110"
                        )} 
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{liked ? 'Remove from favorites' : 'Add to favorites'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full backdrop-blur-sm bg-destructive/80 hover:bg-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Delete this item</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>
          
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
            <div className="flex items-center gap-1.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <div className="text-xs">
                      <p className="mb-1">Name: {item.name || "Unnamed"}</p>
                      <p className="mb-1">Type: {item.type}</p>
                      <p className="mb-1">Style: {item.style}</p>
                      <p>Added: {formattedDate}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span
                className="w-4 h-4 rounded-full ring-1 ring-border"
                style={{ backgroundColor: item.color }}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground truncate">{item.fabric}</p>
        </div>
      </Card>
    </motion.div>
  );
};

export default ClothingCard;
