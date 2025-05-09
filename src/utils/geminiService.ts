
// Gemini API integration for clothing analysis
import { OutfitSuggestion, ClothingItem } from "@/types/clothing";

// API key for Gemini 
const GEMINI_API_KEY = "AIzaSyDJ8UwKPZIQTtlch770SUxTm3AsIB8WSow";
// Updated from gemini-pro-vision to gemini-1.5-flash
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// Convert an image URL to base64 for the API
async function imageUrlToBase64(url: string): Promise<string> {
  try {
    // For data URLs (from file uploads), we can just return the base64 part
    if (url.startsWith('data:image')) {
      return url.split(',')[1];
    }
    
    // For regular URLs, fetch and convert
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
}

// Analyze clothing items with Gemini Vision
export async function analyzeOutfitWithGemini(
  top: ClothingItem,
  bottom: ClothingItem
): Promise<{ matchScore: number; matchReason: string }> {
  try {
    console.log("Analyzing outfit with Gemini...");
    
    // Check if the API key is valid - fixed comparison to check for empty string
    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === "") {
      console.warn("Missing valid Gemini API key. Using fallback analysis.");
      return generateStyleBasedAnalysis(top, bottom);
    }
    
    const topBase64 = await imageUrlToBase64(top.imageUrl);
    const bottomBase64 = await imageUrlToBase64(bottom.imageUrl);

    const payload = {
      contents: [
        {
          parts: [
            {
              text: "Analyze these two clothing items (a top and a bottom) and evaluate how well they match together. Consider color coordination, style compatibility, and fashion sense. Provide a match score from 0 to 1 (where 1 is perfect match) and a brief explanation of why they do or don't match well. Format your response as JSON with two fields: 'score' (number between 0 and 1) and 'reason' (string explanation, keep it concise under 150 characters)."
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: topBase64
              }
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: bottomBase64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 200
      }
    };

    console.log("Sending request to Gemini API...");
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorText}`);
      console.warn("Falling back to style-based analysis...");
      return generateStyleBasedAnalysis(top, bottom);
    }

    const data: GeminiResponse = await response.json();
    const responseText = data.candidates[0]?.content.parts[0].text;
    
    if (!responseText) {
      console.error("Invalid response from Gemini API: Empty response");
      return generateStyleBasedAnalysis(top, bottom);
    }

    console.log("Gemini response:", responseText);

    // Extract JSON from the response text
    // The response might have markdown formatting, so we need to extract just the JSON part
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not extract JSON from Gemini response");
      return generateStyleBasedAnalysis(top, bottom);
    }

    try {
      const result = JSON.parse(jsonMatch[0]);
      return { 
        matchScore: parseFloat(result.score) || 0.5, 
        matchReason: result.reason || "No analysis provided" 
      };
    } catch (jsonError) {
      console.error("Error parsing Gemini JSON response:", jsonError);
      return generateStyleBasedAnalysis(top, bottom);
    }
  } catch (error) {
    console.error("Error analyzing outfit with Gemini:", error);
    return generateStyleBasedAnalysis(top, bottom);
  }
}

// Generate a style-based analysis as fallback
function generateStyleBasedAnalysis(top: ClothingItem, bottom: ClothingItem): { matchScore: number; matchReason: string } {
  // Style matching logic
  const sameStyle = top.style === bottom.style;
  const complementaryColors = isComplementaryColors(top.color, bottom.color);
  const similarFabrics = isSimilarFabrics(top.fabric, bottom.fabric);
  
  // Calculate score based on these factors
  let score = 0.5; // Base score
  
  if (sameStyle) score += 0.2;
  if (complementaryColors) score += 0.2;
  if (similarFabrics) score += 0.1;

  // Cap at 0.9 to leave room for true AI analysis
  score = Math.min(0.9, score);
  
  // Generate reason
  let reason;
  if (score > 0.7) {
    if (complementaryColors && sameStyle) {
      reason = `Great match! The ${top.color} top pairs well with the ${bottom.color} bottom, and the ${top.style} styles complement each other.`;
    } else if (complementaryColors) {
      reason = `The ${top.color} and ${bottom.color} create a pleasing color combination.`;
    } else if (sameStyle) {
      reason = `The matching ${top.style} style creates a cohesive look.`;
    } else {
      reason = "These items create a stylish, coordinated outfit.";
    }
  } else {
    reason = `These items create an interesting contrast between the ${top.style} top and ${bottom.style} bottom.`;
  }
  
  // Ensure reason isn't too long
  if (reason.length > 120) {
    reason = reason.substring(0, 117) + "...";
  }
  
  return { matchScore: score, matchReason: reason };
}

// Check if colors are complementary
function isComplementaryColors(color1: string, color2: string): boolean {
  // Classic complementary combinations
  const complementaryPairs: Record<string, string[]> = {
    "black": ["white", "gray", "beige", "red", "blue"],
    "white": ["black", "navy", "red", "blue"],
    "blue": ["white", "gray", "khaki", "denim"],
    "navy": ["white", "beige", "gray"],
    "gray": ["black", "white", "navy", "pink", "blue"],
    "beige": ["black", "navy", "brown"],
    "brown": ["beige", "blue", "white", "green"],
    "red": ["black", "white", "denim", "gray"],
    "pink": ["gray", "navy", "white", "denim"],
    "green": ["brown", "white", "denim", "beige"],
    "denim": ["white", "gray", "red", "pink"],
    "khaki": ["navy", "white", "blue"]
  };
  
  const color1Lower = color1.toLowerCase();
  const color2Lower = color2.toLowerCase();
  
  return (complementaryPairs[color1Lower] && complementaryPairs[color1Lower].includes(color2Lower)) || 
         (complementaryPairs[color2Lower] && complementaryPairs[color2Lower].includes(color1Lower));
}

// Check if fabrics work well together
function isSimilarFabrics(fabric1: string, fabric2: string): boolean {
  const fabricGroups = [
    ["cotton", "linen", "denim"],
    ["silk", "satin", "chiffon"],
    ["wool", "cashmere", "tweed"],
    ["polyester", "nylon", "spandex"]
  ];
  
  const fabric1Lower = fabric1.toLowerCase();
  const fabric2Lower = fabric2.toLowerCase();
  
  return fabricGroups.some(group => 
    group.includes(fabric1Lower) && group.includes(fabric2Lower)
  );
}

// Test function to validate Gemini API is working
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    const response = await fetch(testUrl);
    
    if (!response.ok) {
      console.warn(`Gemini API test failed with status ${response.status}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Gemini API connection test failed:", error);
    return false;
  }
}
