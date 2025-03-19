"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { createClient } from "../../supabase/client";
import { useToast } from "./ui/use-toast";
import { useLanguage } from "@/contexts/language-context";

interface SavePropertyButtonProps {
  propertyId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function SavePropertyButton({
  propertyId,
  variant = "outline",
  size = "icon",
  className = "",
}: SavePropertyButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    const checkAuthAndSavedStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);

        if (user) {
          const { data } = await supabase
            .from("saved_properties")
            .select("*")
            .eq("user_id", user.id)
            .eq("property_id", propertyId)
            .single();

          setIsSaved(!!data);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    checkAuthAndSavedStatus();
  }, [propertyId]);

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      toast({
        title: language === "ar" ? "يرجى تسجيل الدخول" : "Please sign in",
        description:
          language === "ar"
            ? "يجب عليك تسجيل الدخول لحفظ العقارات"
            : "You need to be signed in to save properties",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      if (isSaved) {
        // Remove from saved properties
        await supabase
          .from("saved_properties")
          .delete()
          .eq("user_id", user.id)
          .eq("property_id", propertyId);

        setIsSaved(false);
        toast({
          title: language === "ar" ? "تمت إزالة العقار" : "Property removed",
          description:
            language === "ar"
              ? "تمت إزالة العقار من المفضلة"
              : "Property removed from favorites",
        });
      } else {
        // Add to saved properties
        await supabase.from("saved_properties").insert({
          user_id: user.id,
          property_id: propertyId,
          saved_at: new Date().toISOString(),
        });

        setIsSaved(true);
        toast({
          title: language === "ar" ? "تم حفظ العقار" : "Property saved",
          description:
            language === "ar"
              ? "تم إضافة العقار إلى المفضلة"
              : "Property added to favorites",
        });
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
      toast({
        title: language === "ar" ? "حدث خطأ" : "Error",
        description:
          language === "ar"
            ? "حدث خطأ أثناء محاولة حفظ العقار"
            : "An error occurred while trying to save the property",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleSave}
      disabled={isLoading}
      className={`${className} ${isSaved ? "text-red-500" : ""}`}
      aria-label={
        isSaved
          ? language === "ar"
            ? "إزالة من المفضلة"
            : "Remove from favorites"
          : language === "ar"
            ? "إضافة إلى المفضلة"
            : "Add to favorites"
      }
    >
      <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
    </Button>
  );
}
