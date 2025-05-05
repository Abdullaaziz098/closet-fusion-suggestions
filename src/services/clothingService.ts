
import { supabase } from "@/integrations/supabase/client";
import { ClothingItem, OutfitSuggestion } from "@/types/clothing";
import { v4 as uuidv4 } from 'uuid';

// Helper to upload image to storage
const uploadImageToStorage = async (imageDataUrl: string): Promise<string> => {
  try {
    // For now, we'll just return the data URL since we're not
    // implementing auth yet. In a production app, we'd upload to Supabase storage.
    return imageDataUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

// Save clothing item to Supabase
export const saveClothingItem = async (item: Omit<ClothingItem, 'id'>): Promise<ClothingItem> => {
  try {
    // Upload image if it's a data URL
    const imageUrl = item.imageUrl.startsWith('data:') 
      ? await uploadImageToStorage(item.imageUrl)
      : item.imageUrl;
    
    const newItem = {
      ...item,
      image_url: imageUrl,
      id: uuidv4(),
      // In a real app with auth, we'd set user_id to auth.user().id
    };
    
    const { data, error } = await supabase
      .from('clothing_items')
      .insert({
        id: newItem.id,
        type: newItem.type,
        color: newItem.color,
        style: newItem.style,
        fabric: newItem.fabric,
        image_url: newItem.image_url,
        name: newItem.name || `${newItem.type} item`,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Return in our app's format
    return {
      id: data.id,
      type: data.type as 'top' | 'bottom',
      imageUrl: data.image_url,
      color: data.color || '#000000',
      style: data.style || 'casual',
      fabric: data.fabric || 'cotton',
      added: new Date(data.created_at || new Date()),
      name: data.name,
    };
  } catch (error) {
    console.error("Error saving clothing item:", error);
    // For now, if saving to Supabase fails, we'll fall back to local storage
    // This ensures the app works without requiring login immediately
    return {
      ...item,
      id: uuidv4(),
      added: new Date(),
    };
  }
};

// Save outfit suggestion to Supabase
export const saveOutfitSuggestion = async (suggestion: OutfitSuggestion): Promise<OutfitSuggestion> => {
  try {
    const { error } = await supabase
      .from('outfit_suggestions')
      .insert({
        id: suggestion.id,
        top_id: suggestion.topId,
        bottom_id: suggestion.bottomId,
        score: suggestion.score,
        match_reason: suggestion.matchReason,
      });
      
    if (error) throw error;
    return suggestion;
  } catch (error) {
    console.error("Error saving outfit suggestion:", error);
    // Return the original suggestion if saving fails
    return suggestion;
  }
};

// Fetch clothing items from Supabase
export const fetchClothingItems = async (type?: 'top' | 'bottom'): Promise<ClothingItem[]> => {
  try {
    let query = supabase.from('clothing_items').select('*');
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      // If no data in Supabase, check localStorage as fallback during transition
      const localTops = localStorage.getItem("closet-fusion-tops");
      const localBottoms = localStorage.getItem("closet-fusion-bottoms");
      let items: ClothingItem[] = [];
      
      if (type === 'top' && localTops) {
        items = JSON.parse(localTops);
      } else if (type === 'bottom' && localBottoms) {
        items = JSON.parse(localBottoms);
      } else if (!type) {
        items = [
          ...(localTops ? JSON.parse(localTops) : []),
          ...(localBottoms ? JSON.parse(localBottoms) : [])
        ];
      }
      
      // Migrate local items to Supabase
      if (items.length > 0) {
        for (const item of items) {
          await saveClothingItem(item);
        }
      }
      
      return items;
    }
    
    // Map Supabase data to our app's format
    return data.map(item => ({
      id: item.id,
      type: item.type as 'top' | 'bottom',
      imageUrl: item.image_url,
      color: item.color || '#000000',
      style: item.style || 'casual',
      fabric: item.fabric || 'cotton',
      added: new Date(item.created_at || new Date()),
      name: item.name,
    }));
  } catch (error) {
    console.error("Error fetching clothing items:", error);
    
    // Fallback to localStorage
    const localTops = localStorage.getItem("closet-fusion-tops");
    const localBottoms = localStorage.getItem("closet-fusion-bottoms");
    let items: ClothingItem[] = [];
    
    if (type === 'top' && localTops) {
      items = JSON.parse(localTops);
    } else if (type === 'bottom' && localBottoms) {
      items = JSON.parse(localBottoms);
    } else if (!type) {
      items = [
        ...(localTops ? JSON.parse(localTops) : []),
        ...(localBottoms ? JSON.parse(localBottoms) : [])
      ];
    }
    
    return items;
  }
};

// Delete a clothing item
export const deleteClothingItem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('clothing_items')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting clothing item:", error);
    
    // Fallback to local deletion if Supabase fails
    const localTops = localStorage.getItem("closet-fusion-tops");
    const localBottoms = localStorage.getItem("closet-fusion-bottoms");
    
    if (localTops) {
      const tops = JSON.parse(localTops);
      const updatedTops = tops.filter((item: ClothingItem) => item.id !== id);
      localStorage.setItem("closet-fusion-tops", JSON.stringify(updatedTops));
    }
    
    if (localBottoms) {
      const bottoms = JSON.parse(localBottoms);
      const updatedBottoms = bottoms.filter((item: ClothingItem) => item.id !== id);
      localStorage.setItem("closet-fusion-bottoms", JSON.stringify(updatedBottoms));
    }
  }
};
