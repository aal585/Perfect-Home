"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../supabase/client";
import DashboardNavbar from "@/components/dashboard-navbar";
import PropertyCard from "@/components/property-card";
import { useLanguage } from "@/contexts/language-context";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  area: string;
  image: string;
}

export default function SavedPropertiesPage() {
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSavedProperties = async () => {
      setIsLoading(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // Redirect to login if not authenticated
          window.location.href = "/sign-in";
          return;
        }

        // Get saved property IDs
        const { data: savedData, error: savedError } = await supabase
          .from("saved_properties")
          .select("property_id")
          .eq("user_id", user.id);

        if (savedError) throw savedError;

        if (!savedData || savedData.length === 0) {
          setSavedProperties([]);
          setIsLoading(false);
          return;
        }

        const propertyIds = savedData.map((item) => item.property_id);

        // Get property details
        const { data: propertiesData, error: propertiesError } = await supabase
          .from("properties")
          .select("*")
          .in("id", propertyIds);

        if (propertiesError) throw propertiesError;

        setSavedProperties(propertiesData || []);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
        toast({
          title: language === "ar" ? "حدث خطأ" : "Error",
          description:
            language === "ar"
              ? "حدث خطأ أثناء جلب العقارات المحفوظة"
              : "An error occurred while fetching saved properties",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedProperties();
  }, [language]);

  const handleRemoveAll = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from("saved_properties")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setSavedProperties([]);
      toast({
        title:
          language === "ar"
            ? "تمت إزالة جميع العقارات"
            : "All properties removed",
        description:
          language === "ar"
            ? "تمت إزالة جميع العقارات من المفضلة"
            : "All properties have been removed from favorites",
      });
    } catch (error) {
      console.error("Error removing all saved properties:", error);
      toast({
        title: language === "ar" ? "حدث خطأ" : "Error",
        description:
          language === "ar"
            ? "حدث خطأ أثناء محاولة إزالة العقارات"
            : "An error occurred while trying to remove properties",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Heart className="mr-2 h-6 w-6 text-red-500" />
            {language === "ar" ? "العقارات المحفوظة" : "Saved Properties"}
          </h1>

          {savedProperties.length > 0 && (
            <Button
              variant="outline"
              className="text-red-500 border-red-500 flex items-center"
              onClick={handleRemoveAll}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {language === "ar" ? "إزالة الكل" : "Remove All"}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : savedProperties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">
              {language === "ar"
                ? "لا توجد عقارات محفوظة"
                : "No Saved Properties"}
            </h3>
            <p className="text-gray-500 mb-6">
              {language === "ar"
                ? "لم تقم بحفظ أي عقارات بعد. استكشف العقارات وانقر على أيقونة القلب لحفظها هنا."
                : "You haven't saved any properties yet. Explore properties and click the heart icon to save them here."}
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => (window.location.href = "/properties")}
            >
              {language === "ar" ? "استكشف العقارات" : "Explore Properties"}
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                image={property.image}
                title={property.title}
                price={property.price}
                location={property.location}
                beds={property.beds}
                baths={property.baths}
                area={property.area}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
