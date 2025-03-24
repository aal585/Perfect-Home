"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import {
  ArrowLeft,
  ArrowRight,
  Maximize,
  Minimize,
  Camera,
  Sofa,
} from "lucide-react";
import { FurnitureRecommendations } from "./furniture-recommendations";

export default function VirtualPropertyTour({
  propertyId,
  images = [],
  title = "",
}: {
  propertyId: string;
  images?: string[];
  title?: string;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFurniture, setShowFurniture] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Default images if none provided
  const defaultImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80",
  ];

  const tourImages = images.length > 0 ? images : defaultImages;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % tourImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + tourImages.length) % tourImages.length,
    );
  };

  return (
    <div
      className="w-full bg-white rounded-lg shadow-md overflow-hidden"
      ref={containerRef}
    >
      <div className="relative">
        {/* Tour viewer */}
        <div className="relative w-full h-[50vh] bg-gray-100">
          <img
            src={tourImages[currentImageIndex]}
            alt={`${title || "Property"} view ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Navigation controls */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={prevImage}
              className="rounded-full bg-white/70 hover:bg-white/90"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={nextImage}
              className="rounded-full bg-white/70 hover:bg-white/90"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Controls overlay */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleFullscreen}
              className="rounded-full bg-white/70 hover:bg-white/90"
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setShowFurniture(!showFurniture)}
              className={`rounded-full ${showFurniture ? "bg-blue-500 text-white" : "bg-white/70 hover:bg-white/90"}`}
            >
              <Sofa className="h-5 w-5" />
            </Button>
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {tourImages.length}
          </div>
        </div>
      </div>

      {/* Furniture recommendations section */}
      {showFurniture && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-4">
            {language === "ar"
              ? "أثاث مقترح لهذه المساحة"
              : "Suggested furniture for this space"}
          </h3>
          <FurnitureRecommendations
            propertyId={propertyId}
            roomType={
              currentImageIndex === 0
                ? "living"
                : currentImageIndex === 1
                  ? "bedroom"
                  : "dining"
            }
          />
        </div>
      )}
    </div>
  );
}
