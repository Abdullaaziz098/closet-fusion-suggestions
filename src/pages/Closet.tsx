
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
import ImageUploader from "@/components/ImageUploader";
import ClothingCard from "@/components/ClothingCard";
import { ClothingItem, ClothingType } from "@/types/clothing";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getDominantColor } from "@/utils/colorAnalysis";
import { determineClothingStyle, determineFabricType } from "@/utils/styleAnalysis";
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence } from "framer-motion";

const MAX_ITEMS = 20;

const Closet = () => {
  const { toast } = useToast();
  const [tops, setTops] = useState<ClothingItem[]>([]);
  const [bottoms, setBottoms] = useState<ClothingItem[]>([]);
  const [activeTab, setActiveTab] = useState<"tops" | "bottoms">("tops");

  // Load saved items from localStorage on component mount
  useEffect(() => {
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
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("closet-fusion-tops", JSON.stringify(tops));
  }, [tops]);

  useEffect(() => {
    localStorage.setItem("closet-fusion-bottoms", JSON.stringify(bottoms));
  }, [bottoms]);

  const handleImageUploaded = async (imageData: string, type: ClothingType) => {
    try {
      // Get dominant color
      const color = await getDominantColor(imageData);
      
      // For simplicity, we're using random assignments for style and fabric
      // In a real app, these would be determined through image analysis
      const style = determineClothingStyle();
      const fabric = determineFabricType();

      const newItem: ClothingItem = {
        id: uuidv4(),
        type,
        imageUrl: imageData,
        color,
        style,
        fabric,
        added: new Date(),
      };

      if (type === "top") {
        setTops((prev) => [...prev, newItem]);
      } else {
        setBottoms((prev) => [...prev, newItem]);
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

  const handleDeleteItem = (id: string) => {
    const itemType = tops.some((item) => item.id === id) ? "top" : "bottom";

    if (itemType === "top") {
      setTops((prev) => prev.filter((item) => item.id !== id));
    } else {
      setBottoms((prev) => prev.filter((item) => item.id !== id));
    }

    toast({
      title: "Item removed",
      description: `${itemType === "top" ? "Top" : "Bottom"} has been removed from your closet`,
    });
  };

  return (
    <Layout>
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">My Closet</h1>

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

        <Tabs defaultValue="tops" className="mb-8" onValueChange={(value) => setActiveTab(value as "tops" | "bottoms")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="tops">Tops ({tops.length}/{MAX_ITEMS})</TabsTrigger>
            <TabsTrigger value="bottoms">Bottoms ({bottoms.length}/{MAX_ITEMS})</TabsTrigger>
          </TabsList>

          <TabsContent value="tops">
            {tops.length > 0 ? (
              <div className="closet-grid">
                <AnimatePresence>
                  {tops.map((item) => (
                    <ClothingCard
                      key={item.id}
                      item={item}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No tops added yet. Upload some images to get started!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bottoms">
            {bottoms.length > 0 ? (
              <div className="closet-grid">
                <AnimatePresence>
                  {bottoms.map((item) => (
                    <ClothingCard
                      key={item.id}
                      item={item}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No bottoms added yet. Upload some images to get started!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Closet;
