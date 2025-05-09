
// Background removal service using Remove.bg API

/**
 * Removes the background from an image using the Remove.bg API
 * @param imageUrl The URL or base64 string of the image
 * @returns A Promise resolving to the processed image as a base64 string
 */
export async function removeBackground(imageUrl: string): Promise<string> {
  try {
    console.log("Removing background from image...");
    const API_KEY = "DdmFP8Fdi2mpYyKf9MTznhHX";
    const API_URL = "https://api.remove.bg/v1.0/removebg";

    // Check if the image is already a base64 string
    const imageData = imageUrl.startsWith('data:image') 
      ? imageUrl.split(',')[1] 
      : await fetchAndConvertToBase64(imageUrl);

    const formData = new FormData();
    formData.append('image_file_b64', imageData);
    formData.append('size', 'auto');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY,
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Remove.bg API error: ${response.status} - ${errorText}`);
      // Return the original image if the API fails
      return imageUrl;
    }

    // Parse as blob first, then convert to base64
    const blob = await response.blob();
    return convertBlobToBase64(blob);
  } catch (error) {
    console.error("Error removing background:", error);
    // Return the original image if there's an error
    return imageUrl;
  }
}

/**
 * Fetches an image from a URL and converts it to a base64 string
 */
async function fetchAndConvertToBase64(url: string): Promise<string> {
  try {
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
  }
  catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
}

/**
 * Converts a Blob to a base64 data URL string
 */
function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
