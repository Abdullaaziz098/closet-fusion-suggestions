
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { useState } from "react";
import { ClothingType } from "@/types/clothing";

interface ImageUploaderProps {
  type: ClothingType;
  onImageUploaded: (imageData: string, clothingType: ClothingType) => void;
  maxImages: number;
  currentCount: number;
}

const ImageUploader = ({ type, onImageUploaded, maxImages, currentCount }: ImageUploaderProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

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
        onImageUploaded(e.target.result as string, type);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <Card
      className={`p-6 border-dashed flex flex-col items-center justify-center h-60 transition-all duration-200 ${
        isDragging ? "border-primary bg-accent/20" : "border-border"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="h-10 w-10 text-muted-foreground mb-4" />
      <p className="font-medium mb-2">Upload {type === "top" ? "Tops" : "Bottoms"}</p>
      <p className="text-muted-foreground text-sm mb-4 text-center">
        Drag & drop or click to upload
        <br />
        ({currentCount}/{maxImages})
      </p>
      <Button asChild variant="outline">
        <label className="cursor-pointer">
          Browse Files
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={currentCount >= maxImages}
          />
        </label>
      </Button>
    </Card>
  );
};

export default ImageUploader;
