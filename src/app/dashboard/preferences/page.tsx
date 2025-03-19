"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../supabase/client";
import DashboardNavbar from "@/components/dashboard-navbar";
import { useLanguage } from "@/contexts/language-context";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

interface UserPreferences {
  min_price?: number;
  max_price?: number;
  min_beds?: number;
  min_baths?: number;
  preferred_locations?: string[];
  preferred_property_types?: string[];
}

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    min_price: undefined,
    max_price: undefined,
    min_beds: undefined,
    min_baths: undefined,
    preferred_locations: [],
    preferred_property_types: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { language } = useLanguage();
  const supabase = createClient();
  const { toast } = useToast();

  // Available options
  const locations = [
    { en: "Cairo", ar: "القاهرة" },
    { en: "Alexandria", ar: "الإسكندرية" },
    { en: "New Cairo", ar: "القاهرة الجديدة" },
    { en: "6th of October", ar: "السادس من أكتوبر" },
    { en: "North Coast", ar: "الساحل الشمالي" },
    { en: "Sheikh Zayed", ar: "الشيخ زايد" },
    { en: "Maadi", ar: "المعادي" },
  ];

  const propertyTypes = [
    { en: "Apartment", ar: "شقة" },
    { en: "Villa", ar: "فيلا" },
    { en: "Townhouse", ar: "تاون هاوس" },
    { en: "Penthouse", ar: "بنتهاوس" },
    { en: "Chalet", ar: "شاليه" },
  ];

  useEffect(() => {
    const fetchPreferences = async () => {
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

        // Get user preferences
        const { data, error } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "no rows returned" error
          throw error;
        }

        if (data) {
          setPreferences({
            min_price: data.min_price,
            max_price: data.max_price,
            min_beds: data.min_beds,
            min_baths: data.min_baths,
            preferred_locations: data.preferred_locations || [],
            preferred_property_types: data.preferred_property_types || [],
          });
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
        toast({
          title: language === "ar" ? "حدث خطأ" : "Error",
          description:
            language === "ar"
              ? "حدث خطأ أثناء جلب التفضيلات"
              : "An error occurred while fetching preferences",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [language]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : Number(value),
    }));
  };

  const handleLocationToggle = (location: string) => {
    setPreferences((prev) => {
      const currentLocations = prev.preferred_locations || [];
      return {
        ...prev,
        preferred_locations: currentLocations.includes(location)
          ? currentLocations.filter((loc) => loc !== location)
          : [...currentLocations, location],
      };
    });
  };

  const handlePropertyTypeToggle = (type: string) => {
    setPreferences((prev) => {
      const currentTypes = prev.preferred_property_types || [];
      return {
        ...prev,
        preferred_property_types: currentTypes.includes(type)
          ? currentTypes.filter((t) => t !== type)
          : [...currentTypes, type],
      };
    });
  };

  const savePreferences = async () => {
    setIsSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Save preferences
      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: user.id,
          min_price: preferences.min_price,
          max_price: preferences.max_price,
          min_beds: preferences.min_beds,
          min_baths: preferences.min_baths,
          preferred_locations: preferences.preferred_locations,
          preferred_property_types: preferences.preferred_property_types,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      );

      if (error) throw error;

      toast({
        title: language === "ar" ? "تم حفظ التفضيلات" : "Preferences Saved",
        description:
          language === "ar"
            ? "تم حفظ تفضيلاتك بنجاح"
            : "Your preferences have been saved successfully",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: language === "ar" ? "حدث خطأ" : "Error",
        description:
          language === "ar"
            ? "حدث خطأ أثناء حفظ التفضيلات"
            : "An error occurred while saving preferences",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Settings className="mr-2 h-6 w-6 text-blue-600" />
            {language === "ar" ? "تفضيلات البحث" : "Search Preferences"}
          </h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {language === "ar"
                    ? "معايير السعر والحجم"
                    : "Price & Size Criteria"}
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min_price">
                        {language === "ar" ? "السعر الأدنى" : "Minimum Price"}
                      </Label>
                      <Input
                        id="min_price"
                        name="min_price"
                        type="number"
                        placeholder="EGP"
                        value={preferences.min_price || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_price">
                        {language === "ar" ? "السعر الأقصى" : "Maximum Price"}
                      </Label>
                      <Input
                        id="max_price"
                        name="max_price"
                        type="number"
                        placeholder="EGP"
                        value={preferences.max_price || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min_beds">
                        {language === "ar"
                          ? "الحد الأدنى لغرف النوم"
                          : "Minimum Bedrooms"}
                      </Label>
                      <Input
                        id="min_beds"
                        name="min_beds"
                        type="number"
                        placeholder="1"
                        value={preferences.min_beds || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min_baths">
                        {language === "ar"
                          ? "الحد الأدنى للحمامات"
                          : "Minimum Bathrooms"}
                      </Label>
                      <Input
                        id="min_baths"
                        name="min_baths"
                        type="number"
                        placeholder="1"
                        value={preferences.min_baths || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {language === "ar"
                    ? "المواقع المفضلة"
                    : "Preferred Locations"}
                </h2>

                <div className="grid grid-cols-2 gap-2">
                  {locations.map((location) => (
                    <div
                      key={location.en}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`location-${location.en}`}
                        checked={
                          preferences.preferred_locations?.includes(
                            location.en,
                          ) || false
                        }
                        onCheckedChange={() =>
                          handleLocationToggle(location.en)
                        }
                      />
                      <Label
                        htmlFor={`location-${location.en}`}
                        className="cursor-pointer"
                      >
                        {language === "ar" ? location.ar : location.en}
                      </Label>
                    </div>
                  ))}
                </div>

                <h2 className="text-xl font-semibold mb-4 mt-8">
                  {language === "ar"
                    ? "أنواع العقارات المفضلة"
                    : "Preferred Property Types"}
                </h2>

                <div className="grid grid-cols-2 gap-2">
                  {propertyTypes.map((type) => (
                    <div key={type.en} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type.en}`}
                        checked={
                          preferences.preferred_property_types?.includes(
                            type.en,
                          ) || false
                        }
                        onCheckedChange={() =>
                          handlePropertyTypeToggle(type.en)
                        }
                      />
                      <Label
                        htmlFor={`type-${type.en}`}
                        className="cursor-pointer"
                      >
                        {language === "ar" ? type.ar : type.en}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={savePreferences}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 flex items-center"
              >
                {isSaving ? (
                  <>
                    <span className="mr-2">
                      {language === "ar" ? "جاري الحفظ..." : "Saving..."}
                    </span>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {language === "ar" ? "حفظ التفضيلات" : "Save Preferences"}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
