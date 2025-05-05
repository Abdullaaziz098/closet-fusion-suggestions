
// This is a simplified version of color analysis
// In a real app, we'd use more sophisticated algorithms or ML models

// Define color keywords for common colors
const colorMap: Record<string, string> = {
  // Reds
  '#ff0000': 'red',
  '#800000': 'maroon',
  '#8b0000': 'dark red',
  '#a52a2a': 'brown',
  '#d2691e': 'chocolate',
  
  // Oranges
  '#ffa500': 'orange',
  '#ff8c00': 'dark orange',
  '#ff7f50': 'coral',
  
  // Yellows
  '#ffff00': 'yellow',
  '#ffd700': 'gold',
  '#f0e68c': 'khaki',
  
  // Greens
  '#008000': 'green',
  '#006400': 'dark green',
  '#32cd32': 'lime green',
  '#00ff00': 'lime',
  '#3cb371': 'medium sea green',
  '#2e8b57': 'sea green',
  '#556b2f': 'dark olive green',
  '#808000': 'olive',
  
  // Blues
  '#0000ff': 'blue',
  '#00008b': 'dark blue',
  '#00bfff': 'deep sky blue',
  '#87ceeb': 'sky blue',
  '#4169e1': 'royal blue',
  '#1e90ff': 'dodger blue',
  '#000080': 'navy',
  '#4682b4': 'steel blue',
  
  // Purples
  '#800080': 'purple',
  '#4b0082': 'indigo',
  '#8a2be2': 'blue violet',
  '#9932cc': 'dark orchid',
  '#9400d3': 'dark violet',
  '#8b008b': 'dark magenta',
  '#ba55d3': 'medium orchid',
  
  // Pinks
  '#ff00ff': 'fuchsia',
  '#ff69b4': 'hot pink',
  '#ffc0cb': 'pink',
  '#ffb6c1': 'light pink',
  '#c71585': 'medium violet red',
  
  // Browns
  '#8b4513': 'saddle brown',
  '#a0522d': 'sienna',
  '#cd853f': 'peru',
  '#deb887': 'burlywood',
  '#f4a460': 'sandy brown',
  '#d2b48c': 'tan',
  
  // Whites
  '#ffffff': 'white',
  '#f5f5f5': 'white smoke',
  '#fffafa': 'snow',
  '#f0fff0': 'honeydew',
  '#f8f8ff': 'ghost white',
  '#f0ffff': 'azure',
  '#f5fffa': 'mint cream',
  
  // Grays/Blacks
  '#808080': 'gray',
  '#a9a9a9': 'dark gray',
  '#d3d3d3': 'light gray',
  '#696969': 'dim gray',
  '#000000': 'black',
  '#2f4f4f': 'dark slate gray',
};

// Helper function to calculate color distance (Euclidean)
function colorDistance(color1: number[], color2: number[]): number {
  const rDiff = color1[0] - color2[0];
  const gDiff = color1[1] - color2[1];
  const bDiff = color1[2] - color2[2];
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

// Convert hex to RGB
function hexToRgb(hex: string): number[] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

// Get the most similar color name
export function getColorName(hexColor: string): string {
  const targetRgb = hexToRgb(hexColor);
  let closestColor = '';
  let minDistance = Number.MAX_VALUE;

  for (const [hex, name] of Object.entries(colorMap)) {
    const currentRgb = hexToRgb(hex);
    const distance = colorDistance(targetRgb, currentRgb);
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = name;
    }
  }

  return closestColor;
}

// Get dominant color from image (simplified version)
export async function getDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        resolve("#000000");
        return;
      }
      
      const width = img.width;
      const height = img.height;
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Sample pixels from the image (simplified)
      const data = ctx.getImageData(0, 0, width, height).data;
      let r = 0, g = 0, b = 0;
      
      // Sample pixels at regular intervals
      const sampleSize = Math.floor(data.length / 4 / 20); // Sample ~20 pixels
      const step = Math.floor(data.length / 4 / sampleSize);
      
      for (let i = 0; i < data.length; i += step * 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      
      // Average the sampled colors
      r = Math.floor(r / sampleSize);
      g = Math.floor(g / sampleSize);
      b = Math.floor(b / sampleSize);
      
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      resolve(hex);
    };
    
    img.onerror = () => {
      resolve("#000000");
    };
    
    img.src = imageUrl;
  });
}

// Check if two colors match well together
export function areColorsCompatible(color1: string, color2: string): { compatible: boolean; reason: string } {
  const name1 = getColorName(color1);
  const name2 = getColorName(color2);
  
  // Neutral colors go with everything
  const neutralColors = ['white', 'black', 'gray', 'dark gray', 'light gray', 'navy', 'khaki', 'tan', 'beige'];
  if (neutralColors.includes(name1) || neutralColors.includes(name2)) {
    return { 
      compatible: true, 
      reason: `${name1} and ${name2} match well because one is a neutral color`
    };
  }
  
  // Monochromatic - same color family
  if (name1 === name2 || 
      (name1.includes(name2) || name2.includes(name1))) {
    return { 
      compatible: true, 
      reason: `${name1} and ${name2} create a cohesive monochromatic look`
    };
  }
  
  // Complementary colors
  const complementaryPairs = [
    ['red', 'green'],
    ['blue', 'orange'],
    ['yellow', 'purple'],
    ['blue', 'brown'],
  ];
  
  for (const [c1, c2] of complementaryPairs) {
    if ((name1.includes(c1) && name2.includes(c2)) || 
        (name1.includes(c2) && name2.includes(c1))) {
      return { 
        compatible: true, 
        reason: `${name1} and ${name2} are complementary colors that create a dynamic contrast`
      };
    }
  }
  
  // Default - we'll consider most combinations as acceptable
  return { 
    compatible: true, 
    reason: `${name1} and ${name2} create an interesting combination`
  };
}
