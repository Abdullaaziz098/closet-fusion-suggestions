
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { areColorsCompatible } from "./colorAnalysis";
import { areFabricsCompatible, areStylesCompatible } from "./styleAnalysis";
import { v4 as uuidv4 } from 'uuid';

// Generate outfit suggestions based on tops and bottoms
export function generateOutfitSuggestions(
  tops: ClothingItem[],
  bottoms: ClothingItem[]
): OutfitSuggestion[] {
  const suggestions: OutfitSuggestion[] = [];

  if (!tops.length || !bottoms.length) {
    return suggestions;
  }

  // Generate all possible combinations
  for (const top of tops) {
    for (const bottom of bottoms) {
      // Calculate compatibility scores
      const colorCompat = areColorsCompatible(top.color, bottom.color);
      const styleCompat = areStylesCompatible(top.style, bottom.style);
      const fabricCompat = areFabricsCompatible(top.fabric, bottom.fabric);

      // Calculate overall score (0.0 to 1.0)
      const colorScore = colorCompat.compatible ? 0.4 : 0.2;
      const styleScore = styleCompat.compatible ? 0.4 : 0.2;
      const fabricScore = fabricCompat.compatible ? 0.2 : 0.1;
      const totalScore = colorScore + styleScore + fabricScore;

      // Generate a reason for the match
      let matchReason = '';
      
      // If the total score is high, include all positive aspects
      if (totalScore > 0.7) {
        if (colorCompat.compatible && styleCompat.compatible) {
          matchReason = `${colorCompat.reason}. ${styleCompat.reason}.`;
        } else if (colorCompat.compatible) {
          matchReason = colorCompat.reason;
        } else if (styleCompat.compatible) {
          matchReason = styleCompat.reason;
        }
      } 
      // Medium score, focus on the strongest aspect
      else if (totalScore > 0.5) {
        if (colorCompat.compatible) {
          matchReason = colorCompat.reason;
        } else if (styleCompat.compatible) {
          matchReason = styleCompat.reason;
        } else {
          matchReason = fabricCompat.reason;
        }
      }
      // Low score, mention contrast
      else {
        matchReason = "Creates an interesting contrasting look.";
      }

      // Create the suggestion
      suggestions.push({
        id: uuidv4(),
        topId: top.id,
        bottomId: bottom.id,
        score: totalScore,
        matchReason,
      });
    }
  }

  // Sort suggestions by score (highest first)
  suggestions.sort((a, b) => b.score - a.score);

  return suggestions;
}
