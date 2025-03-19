"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/language-context";
import {
  Upload,
  X,
  Check,
  Image as ImageIcon,
  RotateCcw,
  Save,
} from "lucide-react";
import Image from "next/image";

interface FurniturePlacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  furnitureItem?: {
    id: string;
    title: string;
    image: string;
  };
}

export default function FurniturePlacementModal({
  isOpen,
  onClose,
  furnitureItem,
}: FurniturePlacementModalProps) {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [furniturePosition, setFurniturePosition] = useState({ x: 50, y: 50 });
  const [furnitureSize, setFurnitureSize] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRoomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const container = e.currentTarget as HTMLDivElement;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // Keep furniture within bounds
      const boundedX = Math.max(0, Math.min(100, x));
      const boundedY = Math.max(0, Math.min(100, y));

      setFurniturePosition({ x: boundedX, y: boundedY });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFurnitureSize(Number(e.target.value));
  };

  const handleReset = () => {
    setFurniturePosition({ x: 50, y: 50 });
    setFurnitureSize(100);
  };

  const handleSave = () => {
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Reset after showing success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {language === "ar"
              ? "وضع الأثاث الافتراضي"
              : "Virtual Furniture Placement"}
          </DialogTitle>
          <DialogDescription>
            {language === "ar"
              ? "قم بتحميل صورة لغرفتك وضع الأثاث فيها لرؤية كيف سيبدو"
              : "Upload a photo of your room and place furniture to see how it would look"}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {language === "ar" ? "تم الحفظ بنجاح!" : "Saved Successfully!"}
            </h3>
            <p className="text-gray-500 text-center">
              {language === "ar"
                ? "تم حفظ تصميمك بنجاح. يمكنك الوصول إليه في لوحة التحكم الخاصة بك."
                : "Your design has been saved successfully. You can access it in your dashboard."}
            </p>
          </div>
        ) : (
          <div className="py-4">
            {!roomImage ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-center mb-2">
                  {language === "ar"
                    ? "انقر لتحميل صورة لغرفتك"
                    : "Click to upload a photo of your room"}
                </p>
                <p className="text-xs text-gray-400 text-center">
                  {language === "ar"
                    ? "PNG، JPG أو WEBP حتى 10MB"
                    : "PNG, JPG or WEBP up to 10MB"}
                </p>
                <Button
                  variant="outline"
                  className="mt-4 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {language === "ar" ? "اختر ملفًا" : "Choose file"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className="relative w-full h-[400px] border rounded-lg overflow-hidden cursor-move"
                  onMouseDown={handleDragStart}
                  onMouseMove={handleDragMove}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                >
                  {/* Room image */}
                  <Image
                    src={roomImage}
                    alt="Room"
                    fill
                    style={{ objectFit: "cover" }}
                  />

                  {/* Furniture overlay */}
                  {furnitureItem && (
                    <div
                      className={`absolute transition-transform ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                      style={{
                        left: `${furniturePosition.x}%`,
                        top: `${furniturePosition.y}%`,
                        transform: `translate(-50%, -50%) scale(${furnitureSize / 100})`,
                        width: "150px",
                        height: "150px",
                      }}
                    >
                      <Image
                        src={furnitureItem.image}
                        alt={furnitureItem.title}
                        width={150}
                        height={150}
                        style={{ objectFit: "contain" }}
                        className="pointer-events-none"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === "ar" ? "الحجم" : "Size"}
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={furnitureSize}
                      onChange={handleSizeChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleReset}
                    title={language === "ar" ? "إعادة ضبط" : "Reset"}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setRoomImage(null)}
                    title={language === "ar" ? "إزالة الصورة" : "Remove image"}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                  <p>
                    {language === "ar"
                      ? "اسحب الأثاث لتحريكه واستخدم شريط التمرير لتغيير الحجم"
                      : "Drag the furniture to move it and use the slider to resize"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {roomImage && !isSuccess && (
            <div className="flex space-x-2 w-full justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isProcessing || !roomImage}
                className="flex items-center"
              >
                {isProcessing ? (
                  <>
                    <span className="mr-2">
                      {language === "ar" ? "جاري الحفظ..." : "Saving..."}
                    </span>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {language === "ar" ? "حفظ التصميم" : "Save Design"}
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
