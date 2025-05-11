
import { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ClothingItem } from "@/types/clothing";
import { generateFashionImage } from "@/services/segmindService";
import { useToast } from "@/hooks/use-toast";

interface FashionImagePreviewProps {
  top?: ClothingItem;
  bottom?: ClothingItem;
  onRefresh?: () => void;
}

const FashionImagePreview = ({ top, bottom, onRefresh }: FashionImagePreviewProps) => {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!top || !bottom) {
      toast({
        title: "Missing items",
        description: "Please select both a top and bottom item",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Generating image with:", { 
        top: top.imageUrl, 
        bottom: bottom.imageUrl 
      });
      
      const result = await generateFashionImage(top.imageUrl, bottom.imageUrl);
      
      if (result && (result.image_url || result.output)) {
        const resultUrl = result.image_url || result.output;
        console.log("Generated image URL:", resultUrl);
        setImageUrl(resultUrl);
        
        toast({
          title: "Preview generated",
          description: "Fashion preview has been successfully created",
        });
      } else {
        console.error("Invalid API response:", result);
        setError("The API returned an unexpected response. Please try again.");
      }
    } catch (err) {
      console.error("Fashion image generation error:", err);
      setError("Failed to generate fashion image. Please try again.");
      
      toast({
        title: "Generation failed",
        description: "Could not generate fashion preview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) onRefresh();
    generateImage();
  };

  // Reset the preview when selected items change
  useEffect(() => {
    setImageUrl(null);
    setError(null);
  }, [top, bottom]);

  return (
    <div className="relative w-full h-full rounded-xl bg-gradient-to-tr from-muted/50 to-background/50 border overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <span className="text-muted-foreground">Generating fashion preview...</span>
          <p className="text-xs text-muted-foreground mt-2">This may take a few seconds</p>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <p className="text-destructive mb-4 text-center">{error}</p>
          <Button onClick={generateImage}>Try Again</Button>
        </div>
      ) : !imageUrl && (top || bottom) ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Button 
            onClick={generateImage} 
            size="lg" 
            className="mb-4"
            disabled={!top || !bottom}
          >
            Generate Fashion Preview
          </Button>
          {(!top || !bottom) && (
            <p className="text-sm text-muted-foreground text-center px-6">
              Select both a top and bottom to generate a preview
            </p>
          )}
        </div>
      ) : imageUrl ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full relative"
        >
          <img 
            src={imageUrl} 
            alt="Fashion Preview" 
            className="w-full h-full object-contain"
          />
          <Button 
            onClick={handleRefresh}
            size="sm" 
            className="absolute bottom-4 right-4"
            variant="secondary"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </motion.div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground text-center px-6">
            Select an outfit to generate a fashion preview
          </p>
        </div>
      )}
    </div>
  );
};

export default FashionImagePreview;
