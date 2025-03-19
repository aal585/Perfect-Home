"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import FurnitureCard from "./furniture-card";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

interface Furniture {
  id: string;
  title: string;
  price: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
}

interface FurnitureRecommendationsProps {
  propertyId?: string;
}

export default function FurnitureRecommendations({
  propertyId,
}: FurnitureRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Furniture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const supabase = createClient();

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // If no user is logged in, fetch featured furniture instead
          const { data, error } = await supabase
            .from("furniture")
            .select("*")
            .limit(6);

          if (error) throw error;
          setRecommendations(data || []);
          return;
        }

        // Call the recommendation edge function
        const { data, error: functionError } = await supabase.functions.invoke(
          "recommend-furniture",
          {
            body: { user_id: user.id, property_id: propertyId, limit: 6 },
          },
        );

        if (functionError) throw functionError;
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error("Error fetching furniture recommendations:", err);
        setError(
          language === "ar"
            ? "حدث خطأ أثناء جلب توصيات الأثاث"
            : "Error fetching furniture recommendations",
        );

        // Fallback to featured furniture
        try {
          const { data } = await supabase
            .from("furniture")
            .select("*")
            .limit(6);
          setRecommendations(data || []);
        } catch (fallbackErr) {
          console.error("Fallback error:", fallbackErr);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [language, propertyId]);

  // Record furniture view in browsing history
  const recordFurnitureView = async (furnitureId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return; // Only record for authenticated users

      // Call the API endpoint to record the view
      await fetch("/api/record-furniture-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ furnitureId }),
      });
    } catch (err) {
      console.error("Error recording furniture view:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-12">
        <div className="flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-gray-500">
          {language === "ar"
            ? "لا توجد توصيات متاحة حاليًا"
            : "No recommendations available at the moment"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-blue-600" />
          {language === "ar" ? "أثاث موصى به لك" : "Recommended Furniture"}
        </h2>
        <Button variant="outline" className="text-blue-600 border-blue-600">
          {language === "ar" ? "عرض المزيد" : "View More"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((furniture) => (
          <FurnitureCard
            key={furniture.id}
            id={furniture.id}
            image={furniture.image}
            title={furniture.title}
            price={furniture.price}
            category={furniture.category}
            rating={furniture.rating || 4.5}
            reviews={furniture.reviews || 100}
            onClick={() => recordFurnitureView(furniture.id)}
          />
        ))}
      </div>
    </div>
  );
}
