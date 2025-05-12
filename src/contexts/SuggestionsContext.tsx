
import { createContext, useContext, useState, ReactNode } from "react";
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";

interface SuggestionsContextType {
  suggestions: OutfitSuggestion[];
  setSuggestions: (suggestions: OutfitSuggestion[]) => void;
  clothingItems: ClothingItem[];
  setClothingItems: (items: ClothingItem[]) => void;
  findClothingItem: (id: string) => ClothingItem | undefined;
}

const SuggestionsContext = createContext<SuggestionsContextType | undefined>(undefined);

export const SuggestionsProvider = ({ children }: { children: ReactNode }) => {
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);

  const findClothingItem = (id: string): ClothingItem | undefined => {
    return clothingItems.find(item => item.id === id);
  };

  return (
    <SuggestionsContext.Provider value={{ 
      suggestions, 
      setSuggestions, 
      clothingItems, 
      setClothingItems,
      findClothingItem
    }}>
      {children}
    </SuggestionsContext.Provider>
  );
};

export const useSuggestions = (): SuggestionsContextType => {
  const context = useContext(SuggestionsContext);
  if (!context) {
    throw new Error("useSuggestions must be used within a SuggestionsProvider");
  }
  return context;
};
