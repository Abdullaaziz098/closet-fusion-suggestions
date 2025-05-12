
import axios from 'axios';

const API_KEY = "SG_3f0418c1e13d2774";
const URL = "https://api.segmind.com/v1/fast-flux-schnell";

export interface SegmindFashionRequest {
  prompt: string;
  steps?: number;
  seed?: number;
  aspect_ratio?: string;
  base64?: boolean;
  image_urls?: string[];
}

export const generateFashionImage = async (topImageUrl: string, bottomImageUrl: string) => {
  try {
    console.log("Generating fashion image with:", { topImageUrl, bottomImageUrl });
    
    // Create a prompt that references the uploaded clothing
    const prompt = `A professional fashion model wearing the uploaded clothing items, studio lighting, full body shot, high quality, photorealistic`;
    
    // Prepare request data
    const data: SegmindFashionRequest = {
      prompt,
      steps: 25,
      aspect_ratio: "2:3", // Portrait aspect ratio better for fashion
      base64: false,
      image_urls: [topImageUrl, bottomImageUrl]
    };

    console.log("Sending request to Segmind API:", data);

    // Make API request - but instead of handling binary as before, request a direct image URL
    const response = await axios.post(URL, data, {
      headers: { 
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log("Segmind API response received");
    
    // Check if the API returned an image URL directly
    if (response.data && response.data.image) {
      return { image_url: response.data.image };
    } else {
      // If we still get binary data, create a blob URL
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const imageUrl = URL.createObjectURL(blob);
      return { image_url: imageUrl };
    }
  } catch (error: any) {
    console.error('Segmind API Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate fashion image');
  }
};
