
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { ClothingType } from "@/types/clothing";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";

interface ImageUploaderProps {
  type: ClothingType;
  onImageUploaded: (imageData: string, clothingType: ClothingType) => void;
  maxImages: number;
  currentCount: number;
}

const ImageUploader = ({ type, onImageUploaded, maxImages, currentCount }: ImageUploaderProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (currentCount >= maxImages) {
      toast({
        title: "Upload limit reached",
        description: `You can only upload up to ${maxImages} ${type}s. Please delete some items to upload more.`,
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageData = e.target.result as string;
        setPreviewImages(prev => [...prev, imageData]);
        onImageUploaded(imageData, type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      const availableSlots = maxImages - currentCount;
      
      // Process only as many files as we have slots for
      const filesToProcess = filesArray.slice(0, availableSlots);
      
      if (filesToProcess.length < filesArray.length) {
        toast({
          title: "Some files were skipped",
          description: `Only ${availableSlots} slots available. ${filesArray.length - availableSlots} files were skipped.`,
        });
      }
      
      filesToProcess.forEach(processFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const availableSlots = maxImages - currentCount;
      
      // Process only as many files as we have slots for
      const filesToProcess = filesArray.slice(0, availableSlots);
      
      if (filesToProcess.length < filesArray.length) {
        toast({
          title: "Some files were skipped",
          description: `Only ${availableSlots} slots available. ${filesArray.length - availableSlots} files were skipped.`,
        });
      }
      
      filesToProcess.forEach(processFile);
      
      // Clear input to allow selecting the same files again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePreview = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card
      className={`p-6 border transition-all duration-200 ${
        isDragging ? "border-primary bg-accent/20" : "border-border"
      }`}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">Upload {type === "top" ? "Tops" : "Bottoms"}</h3>
            <p className="text-muted-foreground text-sm">
              {currentCount}/{maxImages} items
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            multiple
            disabled={currentCount >= maxImages}
          />
        </div>

        <Separator />

        <div
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-all ${
            isDragging ? "border-primary bg-accent/10" : "border-muted"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-primary-foreground/10 p-3 rounded-full">
              <Upload className="h-8 w-8 text-primary/80" />
            </div>
            <h4 className="font-medium">Drag & drop or click to upload</h4>
            <p className="text-sm text-muted-foreground">
              Supports JPG, PNG and GIF up to 5MB
            </p>
          </div>
        </div>

        {previewImages.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Recent uploads</h4>
            <div className="grid grid-cols-3 gap-2">
              <AnimatePresence>
                {previewImages.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative aspect-square rounded-md overflow-hidden border"
                  >
                    <img src={img} alt={`Preview ${i}`} className="object-cover w-full h-full" />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removePreview(i)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageUploader;
