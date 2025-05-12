
import { useState, useEffect } from "react";
import { Loader2, RefreshCw, Camera } from "lucide-react";
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
      
      if (result && result.image_url) {
        console.log("Generated image URL received");
        setImageUrl(result.image_url);
        
        toast({
          title: "Preview generated",
          description: "Fashion preview has been successfully created",
        });
      } else {
        console.error("Invalid API response:", result);
        setError("The AI could not generate a preview at this time. Please try a different outfit or try again later.");
        
        toast({
          title: "Generation issue",
          description: "Could not generate the preview. Try a different outfit combination.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Fashion image generation error:", err);
      setError("The AI fashion preview feature is currently unavailable. Please try different outfits or try again later.");
      
      toast({
        title: "Generation failed",
        description: "AI fashion preview is temporarily unavailable. Please try again later.",
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
    // Only reset if one of the items changes
    if (top || bottom) {
      setImageUrl(null);
      setError(null);
    }
  }, [top, bottom]);

  return (
    <div className="relative w-full h-full rounded-xl bg-ios-card border border-ios-border/10 overflow-hidden shadow-ios">
      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-ios-accent mb-4" />
          <span className="text-ios-text">Generating fashion preview...</span>
          <p className="text-xs text-ios-textSecondary mt-2">This may take a few seconds</p>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <p className="text-destructive mb-4 text-center">{error}</p>
          <div className="flex gap-2">
            <Button onClick={generateImage} variant="secondary">
              Try Again
            </Button>
            {onRefresh && (
              <Button onClick={onRefresh} variant="outline">
                Change Outfit
              </Button>
            )}
          </div>
        </div>
      ) : !imageUrl && (top || bottom) ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Button 
            onClick={generateImage} 
            size="lg" 
            className="mb-4"
            disabled={!top || !bottom}
          >
            <Camera className="mr-2 h-5 w-5" />
            Generate Fashion Preview
          </Button>
          {(!top || !bottom) && (
            <p className="text-sm text-ios-textSecondary text-center px-6">
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
            variant="secondary"
            className="absolute bottom-4 right-4 rounded-full shadow-ios"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </motion.div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-ios-textSecondary text-center px-6">
            Select an outfit to generate a fashion preview
          </p>
        </div>
      )}
    </div>
  );
};

export default FashionImagePreview;
