
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import OutfitCard from "./OutfitCard";
import { motion } from "framer-motion";
import { Trophy, Award, Medal } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TopOutfitsPodiumProps {
  suggestions: OutfitSuggestion[];
  findClothingItem: (id: string) => ClothingItem | undefined;
}

const TopOutfitsPodium = ({ suggestions, findClothingItem }: TopOutfitsPodiumProps) => {
  // Get top 3 suggestions
  const topSuggestions = [...suggestions]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
    
  const isMobile = useIsMobile();
  
  // Generate podium heights based on score percentages
  const getHeight = (index: number): string => {
    if (index === 0) return isMobile ? "h-40" : "h-52"; // 1st place (highest)
    if (index === 1) return isMobile ? "h-32" : "h-44"; // 2nd place
    return isMobile ? "h-24" : "h-36"; // 3rd place
  };
  
  const getDelay = (index: number): number => {
    return 0.3 + (index * 0.15); // Staggered animation delay
  };
  
  const getTrophyIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-8 w-8 text-yellow-500" />
    if (index === 1) return <Award className="h-7 w-7 text-slate-400" />
    return <Medal className="h-6 w-6 text-amber-700" />
  };
  
  if (topSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-semibold mb-10 text-center"
      >
        Top Outfit Suggestions
      </motion.h2>
      
      <div className="relative">
        {/* Podium Platform */}
        <div className="hidden md:flex justify-center items-end mb-4 h-16 relative">
          {topSuggestions.map((suggestion, index) => {
            // Reorder for podium display (1st in middle, 2nd on left, 3rd on right)
            const podiumIndex = index === 0 ? 1 : index === 1 ? 0 : 2;
            const podiumPosition = podiumIndex === 1 ? "center" : podiumIndex === 0 ? "left" : "right";
            
            return (
              <motion.div
                key={suggestion.id}
                className={`${getHeight(index)} mx-2 rounded-t-lg w-full relative`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: getHeight(index), opacity: 1 }}
                transition={{ 
                  delay: getDelay(index), 
                  duration: 0.5,
                  ease: "easeOut" 
                }}
                style={{
                  order: podiumIndex,
                  maxWidth: "30%",
                  background: index === 0 
                    ? "linear-gradient(to bottom, rgba(251,191,36,0.2), rgba(251,191,36,0.05))"
                    : index === 1 
                    ? "linear-gradient(to bottom, rgba(203,213,225,0.2), rgba(203,213,225,0.05))" 
                    : "linear-gradient(to bottom, rgba(217,119,6,0.2), rgba(217,119,6,0.05))"
                }}
              >
                <div className="absolute -top-10 left-0 right-0 flex justify-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: getDelay(index) + 0.2, duration: 0.3, type: "spring" }}
                    className="bg-background rounded-full p-2 shadow-md"
                  >
                    {getTrophyIcon(index)}
                  </motion.div>
                </div>
                <div className="absolute top-0 left-0 right-0 text-center -mt-10 pt-14">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: getDelay(index) + 0.3 }}
                    className={
                      index === 0
                        ? "text-yellow-600 font-semibold"
                        : index === 1
                        ? "text-slate-600 font-medium"
                        : "text-amber-800"
                    }
                  >
                    {index + 1}{index === 0 ? "st" : index === 1 ? "nd" : "rd"} Place
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {topSuggestions.map((suggestion, index) => {
            const top = findClothingItem(suggestion.topId);
            const bottom = findClothingItem(suggestion.bottomId);
            
            if (!top || !bottom) return null;
            
            // For mobile view, maintain actual rank order
            // For desktop, reorder for podium display (1st in middle, 2nd on left, 3rd on right)
            const displayIndex = isMobile ? index : 
                                index === 0 ? 1 : 
                                index === 1 ? 0 : 2;
            
            return (
              <div key={suggestion.id} style={{ order: isMobile ? index : displayIndex }} className={isMobile ? '' : 'relative'}>
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: getDelay(index),
                    duration: 0.5,
                  }}
                >
                  <OutfitCard 
                    suggestion={suggestion}
                    top={top}
                    bottom={bottom}
                    rank={index + 1}
                    isPodium={true}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopOutfitsPodium;
