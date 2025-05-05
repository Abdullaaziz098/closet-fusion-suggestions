
// Gemini API integration for clothing analysis
import { OutfitSuggestion, ClothingItem } from "@/types/clothing";

// API key for Gemini 
const GEMINI_API_KEY = "AIzaSyDJ8UwKPZIQTtlch770SUxTm3AsIB8WSow";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent";

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
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data: GeminiResponse = await response.json();
    const responseText = data.candidates[0]?.content.parts[0].text;
    
    if (!responseText) {
      console.error("Invalid response from Gemini API: Empty response");
      throw new Error("Invalid response from Gemini API");
    }

    console.log("Gemini response:", responseText);

    // Extract JSON from the response text
    // The response might have markdown formatting, so we need to extract just the JSON part
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Could not extract JSON from Gemini response");
      return { matchScore: 0.5, matchReason: "Could not analyze outfit compatibility" };
    }

    try {
      const result = JSON.parse(jsonMatch[0]);
      return { 
        matchScore: parseFloat(result.score) || 0.5, 
        matchReason: result.reason || "No analysis provided" 
      };
    } catch (jsonError) {
      console.error("Error parsing Gemini JSON response:", jsonError);
      return { matchScore: 0.5, matchReason: "Error parsing outfit analysis" };
    }
  } catch (error) {
    console.error("Error analyzing outfit with Gemini:", error);
    return { matchScore: 0.5, matchReason: "Error analyzing outfit compatibility" };
  }
}

// Test function to validate Gemini API is working
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
    if (!response.ok) {
      throw new Error(`API test failed with status ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Gemini API connection test failed:", error);
    return false;
  }
}
