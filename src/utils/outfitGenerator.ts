
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { areColorsCompatible } from "./colorAnalysis";
import { areFabricsCompatible, areStylesCompatible } from "./styleAnalysis";
import { analyzeOutfitWithGemini } from "./geminiService";
import { v4 as uuidv4 } from 'uuid';

// Generate outfit suggestions based on tops and bottoms
export async function generateOutfitSuggestions(
  tops: ClothingItem[],
  bottoms: ClothingItem[]
): Promise<OutfitSuggestion[]> {
  const suggestions: OutfitSuggestion[] = [];

  if (!tops.length || !bottoms.length) {
    return suggestions;
  }

  // Generate all possible combinations
  for (const top of tops) {
    for (const bottom of bottoms) {
      try {
        // Calculate compatibility scores
        const colorCompat = areColorsCompatible(top.color, bottom.color);
        const styleCompat = areStylesCompatible(top.style, bottom.style);
        const fabricCompat = areFabricsCompatible(top.fabric, bottom.fabric);

        // Calculate initial score based on attributes
        const colorScore = colorCompat.compatible ? 0.4 : 0.2;
        const styleScore = styleCompat.compatible ? 0.4 : 0.2;
        const fabricScore = fabricCompat.compatible ? 0.2 : 0.1;
        const attributeScore = colorScore + styleScore + fabricScore;

        // Use Gemini API for advanced visual analysis if possible
        let finalScore = attributeScore;
        let matchReason = '';

        try {
          const geminiAnalysis = await analyzeOutfitWithGemini(top, bottom);
          // Blend our basic analysis with Gemini's AI analysis (60% AI, 40% rule-based)
          finalScore = (geminiAnalysis.matchScore * 0.6) + (attributeScore * 0.4);
          matchReason = geminiAnalysis.matchReason;
        } catch (error) {
          console.error("Gemini analysis failed, using fallback method:", error);
          
          // Fallback to our original logic if Gemini API fails
          if (attributeScore > 0.7) {
            if (colorCompat.compatible && styleCompat.compatible) {
              matchReason = `${colorCompat.reason}. ${styleCompat.reason}.`;
            } else if (colorCompat.compatible) {
              matchReason = colorCompat.reason;
            } else if (styleCompat.compatible) {
              matchReason = styleCompat.reason;
            }
          } else if (attributeScore > 0.5) {
            if (colorCompat.compatible) {
              matchReason = colorCompat.reason;
            } else if (styleCompat.compatible) {
              matchReason = styleCompat.reason;
            } else {
              matchReason = fabricCompat.reason;
            }
          } else {
            matchReason = "Creates an interesting contrasting look.";
          }
        }

        // Create the suggestion
        suggestions.push({
          id: uuidv4(),
          topId: top.id,
          bottomId: bottom.id,
          score: finalScore,
          matchReason,
        });
      } catch (error) {
        console.error("Error generating outfit suggestion:", error);
      }
    }
  }

  // Sort suggestions by score (highest first)
  suggestions.sort((a, b) => b.score - a.score);

  return suggestions;
}
