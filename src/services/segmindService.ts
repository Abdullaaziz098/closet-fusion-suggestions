
import axios from 'axios';

const API_KEY = "SG_3f0418c1e13d2774";
const URL = "https://api.segmind.com/v1/fast-flux-schnell";

export interface SegmindFashionRequest {
  prompt: string;
  steps?: number;
  seed?: number;
  aspect_ratio?: string;
  base64?: boolean;
}

export const generateFashionImage = async (topImageUrl: string, bottomImageUrl: string) => {
  const prompt = `A fashion model wearing the uploaded clothing items, professional studio lighting, full body shot`;

  const data: SegmindFashionRequest = {
    prompt,
    steps: 4,
    aspect_ratio: "2:3", // Portrait aspect ratio better for fashion
    base64: false
  };

  try {
    const response = await axios.post(URL, data, {
      headers: { 'x-api-key': API_KEY }
    });
    return response.data;
  } catch (error: any) {
    console.error('Segmind API Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate fashion image');
  }
};
