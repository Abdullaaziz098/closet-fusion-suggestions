
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { areColorsCompatible } from "./colorAnalysis";
import { areFabricsCompatible, areStylesCompatible } from "./styleAnalysis";
import { analyzeOutfitWithGemini } from "./geminiService";
import { v4 as uuidv4 } from 'uuid';
import { saveOutfitSuggestion } from "@/services/clothingService";

// Generate outfit suggestions based on tops and bottoms
export async function generateOutfitSuggestions(
  tops: ClothingItem[],
  bottoms: ClothingItem[]
): Promise<OutfitSuggestion[]> {
  const suggestions: OutfitSuggestion[] = [];

  if (!tops.length || !bottoms.length) {
    return suggestions;
  }

  // Limit the number of combinations to prevent performance issues
  // For large closets, randomly sample items instead of generating all combinations
  const maxCombinations = 30;
  let processedCombinations = 0;
  let geminiFailureCount = 0;
  
  // Flag to track if we're using Gemini or not
  let isUsingGemini = true;

  // Process all possible combinations or until max reached
  const topsToProcess = tops.length > 10 ? shuffle(tops).slice(0, 10) : tops;
  const bottomsToProcess = bottoms.length > 10 ? shuffle(bottoms).slice(0, 10) : bottoms;

  for (const top of topsToProcess) {
    if (processedCombinations >= maxCombinations) break;
    
    for (const bottom of bottomsToProcess) {
      if (processedCombinations >= maxCombinations) break;
      processedCombinations++;
      
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

        // Only try Gemini API if we haven't had too many failures
        if (isUsingGemini && geminiFailureCount < 3) {
          try {
            console.log(`Analyzing outfit with Gemini: ${top.id} + ${bottom.id}`);
            const geminiAnalysis = await analyzeOutfitWithGemini(top, bottom);
            
            // Blend our basic analysis with Gemini's AI analysis (60% AI, 40% rule-based)
            finalScore = (geminiAnalysis.matchScore * 0.6) + (attributeScore * 0.4);
            matchReason = geminiAnalysis.matchReason;
            console.log(`Gemini analysis successful. Score: ${finalScore}, Reason: ${matchReason}`);
          } catch (error) {
            console.error("Gemini analysis failed, using fallback method:", error);
            geminiFailureCount++;
            
            if (geminiFailureCount >= 3) {
              console.warn("Too many Gemini API failures. Switching to fallback method for all remaining suggestions.");
              isUsingGemini = false;
            }
            
            // Fallback to our original logic if Gemini API fails
            finalScore = attributeScore;
            matchReason = generateFallbackReason(colorCompat, styleCompat, fabricCompat, attributeScore);
          }
        } else {
          // Using fallback method
          finalScore = attributeScore;
          matchReason = generateFallbackReason(colorCompat, styleCompat, fabricCompat, attributeScore);
        }

        // Create the suggestion
        const suggestion: OutfitSuggestion = {
          id: uuidv4(),
          topId: top.id,
          bottomId: bottom.id,
          score: Math.min(Math.max(finalScore, 0), 1), // Ensure score is between 0 and 1
          matchReason: matchReason || "These items create an interesting combination.",
        };
        
        suggestions.push(suggestion);
        
        // Save suggestion to Supabase (asynchronously, don't wait)
        saveOutfitSuggestion(suggestion).catch(err => console.error("Error saving suggestion:", err));
      } catch (error) {
        console.error("Error generating outfit suggestion:", error);
      }
    }
  }

  // Sort suggestions by score (highest first)
  suggestions.sort((a, b) => b.score - a.score);

  return suggestions;
}

// Generate a fallback reason when Gemini is unavailable
function generateFallbackReason(colorCompat: any, styleCompat: any, fabricCompat: any, score: number): string {
  // More detailed generated reasons based on the compatibility checks
  if (score > 0.8) {
    return "Perfect match! Colors, style and fabric work beautifully together.";
  } else if (score > 0.7) {
    if (colorCompat.compatible && styleCompat.compatible) {
      return `${colorCompat.reason} ${styleCompat.reason}`;
    } else if (colorCompat.compatible) {
      return colorCompat.reason;
    } else if (styleCompat.compatible) {
      return styleCompat.reason;
    }
    return "Great match with complementary elements.";
  } else if (score > 0.5) {
    if (colorCompat.compatible) {
      return colorCompat.reason;
    } else if (styleCompat.compatible) {
      return styleCompat.reason;
    } else if (fabricCompat.compatible) {
      return fabricCompat.reason;
    }
    return "Good combination with interesting contrast.";
  } else if (score > 0.3) {
    return "Bold combination that makes a statement with contrasting elements.";
  }
  
  return "Creates an interesting contrasting look.";
}

// Shuffle an array using Fisher-Yates algorithm
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
