
export type ClothingType = 'top' | 'bottom';

export interface ClothingItem {
  id: string;
  type: ClothingType;
  imageUrl: string;
  color: string;
  style: string;
  fabric: string;
  added: Date;
  name?: string;
}

export interface OutfitSuggestion {
  id: string;
  topId: string;
  bottomId: string;
  score: number;
  matchReason: string;
}
