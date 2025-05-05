
// Simplified style analysis utility
// In a real app, this would use more sophisticated algorithms or ML models

// Define common clothing styles
export const clothingStyles = [
  'casual',
  'formal',
  'business',
  'athletic',
  'bohemian',
  'vintage',
  'streetwear',
  'minimalist',
  'preppy',
  'grunge',
  'classic',
];

// Define common fabric types
export const fabricTypes = [
  'cotton',
  'denim',
  'linen',
  'silk',
  'wool',
  'polyester',
  'leather',
  'knit',
  'tweed',
  'suede',
  'velvet',
  'nylon',
  'spandex',
  'satin',
];

// Randomly assign styles (in a real app, this would use image recognition)
export function determineClothingStyle(): string {
  const randomIndex = Math.floor(Math.random() * clothingStyles.length);
  return clothingStyles[randomIndex];
}

// Randomly assign fabric type (in a real app, this would use image recognition)
export function determineFabricType(): string {
  const randomIndex = Math.floor(Math.random() * fabricTypes.length);
  return fabricTypes[randomIndex];
}

// Check if styles are compatible
export function areStylesCompatible(style1: string, style2: string): { compatible: boolean; reason: string } {
  // Same style is always compatible
  if (style1 === style2) {
    return { 
      compatible: true, 
      reason: `Both pieces have a ${style1} style, creating a cohesive look`
    };
  }
  
  // Define style combinations that work well together
  const compatibleStylePairs = [
    ['casual', 'streetwear'],
    ['casual', 'athletic'],
    ['casual', 'minimalist'],
    ['casual', 'vintage'],
    ['casual', 'bohemian'],
    ['casual', 'grunge'],
    ['minimalist', 'formal'],
    ['minimalist', 'business'],
    ['formal', 'business'],
    ['formal', 'classic'],
    ['streetwear', 'grunge'],
    ['streetwear', 'vintage'],
    ['classic', 'preppy'],
    ['classic', 'business'],
    ['bohemian', 'vintage'],
  ];
  
  for (const [s1, s2] of compatibleStylePairs) {
    if ((style1 === s1 && style2 === s2) || (style1 === s2 && style2 === s1)) {
      return { 
        compatible: true, 
        reason: `${style1} and ${style2} styles complement each other well`
      };
    }
  }
  
  // Default - styles might not be ideal but could still work
  return { 
    compatible: false, 
    reason: `${style1} and ${style2} styles might create a contrasting look`
  };
}

// Check if fabrics are compatible
export function areFabricsCompatible(fabric1: string, fabric2: string): { compatible: boolean; reason: string } {
  // Same fabric is always compatible
  if (fabric1 === fabric2) {
    return { 
      compatible: true,
      reason: `Both pieces use ${fabric1}, creating a consistent texture`
    };
  }
  
  // Define fabric combinations that work well
  const compatibleFabrics = [
    ['cotton', 'denim'],
    ['cotton', 'linen'],
    ['cotton', 'knit'],
    ['denim', 'leather'],
    ['denim', 'knit'],
    ['silk', 'satin'],
    ['silk', 'velvet'],
    ['wool', 'cotton'],
    ['wool', 'tweed'],
    ['leather', 'cotton'],
    ['polyester', 'cotton'],
    ['nylon', 'spandex'],
  ];
  
  for (const [f1, f2] of compatibleFabrics) {
    if ((fabric1 === f1 && fabric2 === f2) || (fabric1 === f2 && fabric2 === f1)) {
      return { 
        compatible: true,
        reason: `${fabric1} and ${fabric2} fabrics pair well together`
      };
    }
  }
  
  // Default - fabrics might not be ideal but could still work
  return { 
    compatible: false,
    reason: `The textures of ${fabric1} and ${fabric2} create an interesting contrast`
  };
}
