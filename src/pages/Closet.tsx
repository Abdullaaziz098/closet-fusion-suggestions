
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
import ImageUploader from "@/components/ImageUploader";
import ClothingCard from "@/components/ClothingCard";
import { ClothingItem, ClothingType } from "@/types/clothing";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getDominantColor } from "@/utils/colorAnalysis";
import { determineClothingStyle, determineFabricType } from "@/utils/styleAnalysis";
import { AnimatePresence } from "framer-motion";
import { saveClothingItem, fetchClothingItems, deleteClothingItem } from "@/services/clothingService";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { testGeminiConnection } from "@/utils/geminiService";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const MAX_ITEMS = 30; // Increased max items

const Closet = () => {
  const { toast } = useToast();
  const [tops, setTops] = useState<ClothingItem[]>([]);
  const [bottoms, setBottoms] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"tops" | "bottoms">("tops");
  const [geminiStatus, setGeminiStatus] = useState<"checking" | "ok" | "error">("checking");

  // Check Gemini API status on component mount
  useEffect(() => {
    const checkGeminiStatus = async () => {
      try {
        const isConnected = await testGeminiConnection();
        setGeminiStatus(isConnected ? "ok" : "error");
        
        if (!isConnected) {
          toast({
            title: "Gemini API Issue",
            description: "There may be issues with the Gemini API connection. Outfit suggestions might use fallback methods.",
            variant: "destructive",
          });
        }
      } catch (error) {
        setGeminiStatus("error");
      }
    };
    
    checkGeminiStatus();
  }, [toast]);

  // Load clothing items from Supabase
  useEffect(() => {
    const loadClothingItems = async () => {
      setLoading(true);
      try {
        const fetchedTops = await fetchClothingItems('top');
        const fetchedBottoms = await fetchClothingItems('bottom');
        
        setTops(fetchedTops);
        setBottoms(fetchedBottoms);
      } catch (error) {
        console.error("Error loading clothing items:", error);
        toast({
          title: "Error",
          description: "Failed to load your clothing items",
          variant: "destructive",
        });
        
        // Fall back to localStorage if Supabase fetch fails
        const savedTops = localStorage.getItem("closet-fusion-tops");
        const savedBottoms = localStorage.getItem("closet-fusion-bottoms");

        if (savedTops) {
          try {
            setTops(JSON.parse(savedTops));
          } catch (error) {
            console.error("Failed to parse saved tops", error);
          }
        }

        if (savedBottoms) {
          try {
            setBottoms(JSON.parse(savedBottoms));
          } catch (error) {
            console.error("Failed to parse saved bottoms", error);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadClothingItems();
  }, [toast]);

  // Save items to localStorage as backup
  useEffect(() => {
    if (tops.length > 0) {
      localStorage.setItem("closet-fusion-tops", JSON.stringify(tops));
    }
  }, [tops]);

  useEffect(() => {
    if (bottoms.length > 0) {
      localStorage.setItem("closet-fusion-bottoms", JSON.stringify(bottoms));
    }
  }, [bottoms]);

  const handleImageUploaded = async (imageData: string, type: ClothingType) => {
    try {
      // Get dominant color
      const color = await getDominantColor(imageData);
      
      // For simplicity, we're using random assignments for style and fabric
      // In a real app, these would be determined through image analysis
      const style = determineClothingStyle();
      const fabric = determineFabricType();

      const newItemData = {
        type,
        imageUrl: imageData,
        color,
        style,
        fabric,
        added: new Date(),
      };

      // Save to Supabase and get back the item with ID
      const savedItem = await saveClothingItem(newItemData);

      // Update local state
      if (type === "top") {
        setTops((prev) => [savedItem, ...prev]);
      } else {
        setBottoms((prev) => [savedItem, ...prev]);
      }

      toast({
        title: "Item added",
        description: `${type === "top" ? "Top" : "Bottom"} has been added to your closet`,
      });
    } catch (error) {
      console.error("Error processing image", error);
      toast({
        title: "Error",
        description: "Failed to process the image",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      // Determine if it's a top or bottom
      const itemType = tops.some((item) => item.id === id) ? "top" : "bottom";

      // Delete from Supabase
      await deleteClothingItem(id);
      
      // Update local state
      if (itemType === "top") {
        setTops((prev) => prev.filter((item) => item.id !== id));
      } else {
        setBottoms((prev) => prev.filter((item) => item.id !== id));
      }

      toast({
        title: "Item removed",
        description: `${itemType === "top" ? "Top" : "Bottom"} has been removed from your closet`,
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete the item",
        variant: "destructive",
      });
    }
  };

  // Filter items based on search query
  const filteredTops = tops.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.style?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.fabric?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredBottoms = bottoms.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.style?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.fabric?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Layout>
        <div className="container flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Loading your closet...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Closet</h1>
            <p className="text-muted-foreground">
              Manage your clothing items and create stylish outfits
            </p>
          </div>
          
          {geminiStatus !== "checking" && (
            <div className="flex items-center">
              <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md">
                <div className={`h-2 w-2 rounded-full ${geminiStatus === "ok" ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-sm">
                  {geminiStatus === "ok" ? "Gemini API Connected" : "Gemini API Issues"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ImageUploader
            type="top"
            onImageUploaded={handleImageUploaded}
            maxImages={MAX_ITEMS}
            currentCount={tops.length}
          />
          <ImageUploader
            type="bottom"
            onImageUploaded={handleImageUploaded}
            maxImages={MAX_ITEMS}
            currentCount={bottoms.length}
          />
        </div>
        
        <Separator className="my-8" />

        <Tabs 
          defaultValue="tops" 
          className="mb-8" 
          onValueChange={(value) => setActiveTab(value as "tops" | "bottoms")}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="tops">Tops ({tops.length}/{MAX_ITEMS})</TabsTrigger>
              <TabsTrigger value="bottoms">Bottoms ({bottoms.length}/{MAX_ITEMS})</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <TabsContent value="tops">
            {filteredTops.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <AnimatePresence>
                  {filteredTops.map((item) => (
                    <ClothingCard
                      key={item.id}
                      item={item}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/10">
                {searchQuery ? (
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      No tops match your search "{searchQuery}"
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No tops added yet. Upload some images to get started!
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bottoms">
            {filteredBottoms.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <AnimatePresence>
                  {filteredBottoms.map((item) => (
                    <ClothingCard
                      key={item.id}
                      item={item}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/10">
                {searchQuery ? (
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      No bottoms match your search "{searchQuery}"
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No bottoms added yet. Upload some images to get started!
                  </p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Closet;
