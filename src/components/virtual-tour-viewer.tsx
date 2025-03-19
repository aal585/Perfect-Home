"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface VirtualTourViewerProps {
  isOpen: boolean;
  onClose: () => void;
  tourUrl?: string;
  propertyTitle: string;
}

export default function VirtualTourViewer({
  isOpen,
  onClose,
  tourUrl,
  propertyTitle,
}: VirtualTourViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Mock tour URL if not provided
  const actualTourUrl =
    tourUrl ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90";

  useEffect(() => {
    // Simulate loading
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    const viewerElement = document.getElementById("virtual-tour-container");
    if (!viewerElement) return;

    if (!document.fullscreenElement) {
      try {
        await viewerElement.requestFullscreen();
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    } else {
      document.exitFullscreen();
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div
        id="virtual-tour-container"
        className="relative w-full max-w-6xl h-[80vh] bg-black rounded-lg overflow-hidden"
      >
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-black/50 text-white border-gray-700 hover:bg-black/70"
            onClick={handleRotate}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-black/50 text-white border-gray-700 hover:bg-black/70"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-black/50 text-white border-gray-700 hover:bg-black/70"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-black/50 text-white border-gray-700 hover:bg-black/70"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-black/50 text-white border-gray-700 hover:bg-black/70"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Title */}
        <div className="absolute top-4 left-4 z-10">
          <h3 className="text-white font-medium bg-black/50 px-3 py-1 rounded">
            {propertyTitle} - Virtual Tour
          </h3>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white">Loading virtual tour...</p>
            </div>
          </div>
        )}

        {/* Tour content - in a real implementation, this would be a 3D viewer */}
        <div
          className="w-full h-full flex items-center justify-center transition-all duration-300"
          style={{
            transform: `rotate(${rotation}deg) scale(${zoom})`,
            opacity: isLoading ? 0 : 1,
          }}
        >
          {/* This is a placeholder. In a real implementation, you would integrate a 3D viewer library */}
          <div className="relative w-full h-full">
            <img
              src={actualTourUrl}
              alt={propertyTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/70 text-white p-4 rounded text-center max-w-md">
                <p className="mb-2">
                  This is a placeholder for the 3D virtual tour. In a production
                  environment, this would be integrated with a 3D viewer library
                  like Matterport, 3DVista, or a custom WebGL solution.
                </p>
                <p>
                  Use the controls above to simulate rotation and zoom
                  functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
