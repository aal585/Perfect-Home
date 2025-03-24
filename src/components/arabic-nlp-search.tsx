"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import { Home, Sofa, Wrench, Search } from "lucide-react";
import SearchWithVoice from "./search-with-voice";

export default function ArabicNLPSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("properties");
  const [isSearching, setIsSearching] = useState(false);
  const { language } = useLanguage();
  const router = useRouter();

  // Sample Arabic property terms for NLP processing
  const propertyTerms = {
    locations: [
      "التجمع",
      "الشيخ زايد",
      "المعادي",
      "مدينة نصر",
      "المهندسين",
      "الدقي",
      "الرحاب",
      "6 أكتوبر",
      "العاصمة الإدارية",
    ],
    types: [
      "شقة",
      "فيلا",
      "دوبلكس",
      "روف",
      "بنتهاوس",
      "استوديو",
      "شاليه",
      "توين هاوس",
      "تاون هاوس",
    ],
    features: [
      "مفروشة",
      "حديقة",
      "مسبح",
      "تشطيب فاخر",
      "أمن",
      "جراج",
      "مصعد",
      "قريبة من المواصلات",
    ],
  };

  // Process natural language query
  const processQuery = (query: string) => {
    // Convert query to lowercase for easier matching
    const lowerQuery = query.toLowerCase();

    // Initialize extracted parameters
    let extractedLocation = "";
    let extractedType = "";
    let extractedFeatures: string[] = [];

    // Check for locations
    propertyTerms.locations.forEach((location) => {
      if (lowerQuery.includes(location.toLowerCase())) {
        extractedLocation = location;
      }
    });

    // Check for property types
    propertyTerms.types.forEach((type) => {
      if (lowerQuery.includes(type.toLowerCase())) {
        extractedType = type;
      }
    });

    // Check for features
    propertyTerms.features.forEach((feature) => {
      if (lowerQuery.includes(feature.toLowerCase())) {
        extractedFeatures.push(feature);
      }
    });

    // Determine search type based on query content
    let detectedSearchType = searchType;

    if (
      lowerQuery.includes("أثاث") ||
      lowerQuery.includes("كنبة") ||
      lowerQuery.includes("سرير")
    ) {
      detectedSearchType = "furniture";
    } else if (
      lowerQuery.includes("صيانة") ||
      lowerQuery.includes("إصلاح") ||
      lowerQuery.includes("تصليح")
    ) {
      detectedSearchType = "maintenance";
    } else if (extractedLocation || extractedType) {
      detectedSearchType = "properties";
    }

    return {
      searchType: detectedSearchType,
      params: {
        location: extractedLocation,
        type: extractedType,
        features: extractedFeatures,
      },
    };
  };

  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchQuery(query);

    // Process the query to extract parameters
    const { searchType: detectedType, params } = processQuery(query);

    // Update the search type if detected from query
    if (detectedType !== searchType) {
      setSearchType(detectedType);
    }

    // Build the search URL with parameters
    let searchUrl = `/${detectedType}`;
    const queryParams = [];

    if (params.location) {
      queryParams.push(`location=${encodeURIComponent(params.location)}`);
    }

    if (params.type) {
      queryParams.push(`type=${encodeURIComponent(params.type)}`);
    }

    if (params.features.length > 0) {
      queryParams.push(
        `features=${encodeURIComponent(params.features.join(","))}`,
      );
    }

    if (query) {
      queryParams.push(`q=${encodeURIComponent(query)}`);
    }

    if (queryParams.length > 0) {
      searchUrl += `?${queryParams.join("&")}`;
    }

    // Navigate to the search results page
    router.push(searchUrl);

    // Simulate search completion
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <Tabs
        defaultValue="properties"
        value={searchType}
        onValueChange={setSearchType}
        className="w-full"
      >
        <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <h2 className="text-xl font-bold mb-2 text-center">
            {language === "ar"
              ? "ابحث عن منزلك المثالي"
              : "Find Your Perfect Home"}
          </h2>
          <p className="text-sm text-center mb-4 text-blue-100">
            {language === "ar"
              ? "يمكنك البحث باللغة العربية العامية - مثال: عايز شقة في التجمع بحديقة"
              : "You can search in Egyptian Arabic - Example: I want an apartment in Tagamoa with a garden"}
          </p>

          <SearchWithVoice
            placeholder={
              language === "ar"
                ? "ابحث عن عقارات، أثاث، خدمات..."
                : "Search properties, furniture, services..."
            }
            onSearch={handleSearch}
            className="mb-4"
          />

          <TabsList className="grid grid-cols-3 w-full bg-blue-800/30">
            <TabsTrigger
              value="properties"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-700"
            >
              <Home className="h-4 w-4 mr-2" />
              {language === "ar" ? "عقارات" : "Properties"}
            </TabsTrigger>
            <TabsTrigger
              value="furniture"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-700"
            >
              <Sofa className="h-4 w-4 mr-2" />
              {language === "ar" ? "أثاث" : "Furniture"}
            </TabsTrigger>
            <TabsTrigger
              value="maintenance"
              className="data-[state=active]:bg-white data-[state=active]:text-blue-700"
            >
              <Wrench className="h-4 w-4 mr-2" />
              {language === "ar" ? "صيانة" : "Maintenance"}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="properties" className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "ar" ? "المنطقة" : "Location"}
              </label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">
                  {language === "ar" ? "جميع المناطق" : "All locations"}
                </option>
                {propertyTerms.locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "ar" ? "نوع العقار" : "Property Type"}
              </label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">
                  {language === "ar" ? "جميع الأنواع" : "All types"}
                </option>
                {propertyTerms.types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "ar" ? "السعر" : "Price"}
              </label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">
                  {language === "ar" ? "أي سعر" : "Any price"}
                </option>
                <option value="1000000">
                  {language === "ar" ? "حتى 1 مليون جنيه" : "Up to 1M EGP"}
                </option>
                <option value="2000000">
                  {language === "ar" ? "حتى 2 مليون جنيه" : "Up to 2M EGP"}
                </option>
                <option value="5000000">
                  {language === "ar" ? "حتى 5 مليون جنيه" : "Up to 5M EGP"}
                </option>
                <option value="10000000">
                  {language === "ar" ? "حتى 10 مليون جنيه" : "Up to 10M EGP"}
                </option>
                <option value="10000001">
                  {language === "ar"
                    ? "أكثر من 10 مليون جنيه"
                    : "Above 10M EGP"}
                </option>
              </select>
            </div>
          </div>
          <Button
            className="w-full mt-4"
            onClick={() => handleSearch()}
            disabled={isSearching}
          >
            {isSearching ? (
              language === "ar" ? (
                "جاري البحث..."
              ) : (
                "Searching..."
              )
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                {language === "ar" ? "بحث" : "Search"}
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="furniture" className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "ar" ? "نوع الأثاث" : "Furniture Type"}
              </label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">
                  {language === "ar" ? "جميع الأنواع" : "All types"}
                </option>
                <option value="living">
                  {language === "ar" ? "غرفة معيشة" : "Living Room"}
                </option>
                <option value="bedroom">
                  {language === "ar" ? "غرفة نوم" : "Bedroom"}
                </option>
                <option value="dining">
                  {language === "ar" ? "غرفة طعام" : "Dining Room"}
                </option>
                <option value="kitchen">
                  {language === "ar" ? "مطبخ" : "Kitchen"}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "ar" ? "النمط" : "Style"}
              </label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">
                  {language === "ar" ? "جميع الأنماط" : "All styles"}
                </option>
                <option value="modern">
                  {language === "ar" ? "عصري" : "Modern"}
                </option>
                <option value="classic">
                  {language === "ar" ? "كلاسيكي" : "Classic"}
                </option>
                <option value="minimalist">
                  {language === "ar" ? "بسيط" : "Minimalist"}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "ar" ? "السعر" : "Price"}
              </label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">
                  {language === "ar" ? "أي سعر" : "Any price"}
                </option>
                <option value="5000">
                  {language === "ar" ? "حتى 5000 جنيه" : "Up to 5K EGP"}
                </option>
                <option value="10000">
                  {language === "ar" ? "حتى 10000 جنيه" : "Up to 10K EGP"}
                </option>
                <option value="20000">
                  {language === "ar" ? "حتى 20000 جنيه" : "Up to 20K EGP"}
                </option>
                <option value="50000">
                  {language === "ar" ? "حتى 50000 جنيه" : "Up to 50K EGP"}
                </option>
                <option value="50001">
                  {language === "ar" ? "أكثر من 50000 جنيه" : "Above 50K EGP"}
                </option>
              </select>
            </div>
          </div>
          <Button
            className="w-full mt-4"
            onClick={() => handleSearch()}
            disabled={isSearching}
          >
            {isSearching ? (
              language === "ar" ? (
                "جاري البحث..."
              ) : (
                "Searching..."
              )
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                {language === "ar" ? "بحث" : "Search"}
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="maintenance" className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "ar" ? "نوع الخدمة" : "Service Type"}
              </label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">
                  {language === "ar" ? "جميع الخدمات" : "All services"}
                </option>
                <option value="plumbing">
                  {language === "ar" ? "سباكة" : "Plumbing"}
                </option>
                <option value="electrical">
                  {language === "ar" ? "كهرباء" : "Electrical"}
                </option>
                <option value="ac">
                  {language === "ar" ? "تكييف" : "Air Conditioning"}
                </option>
                <option value="carpentry">
                  {language === "ar" ? "نجارة" : "Carpentry"}
                </option>
                <option value="painting">
                  {language === "ar" ? "دهان" : "Painting"}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "ar" ? "الأولوية" : "Priority"}
              </label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">
                  {language === "ar" ? "جميع الأولويات" : "All priorities"}
                </option>
                <option value="urgent">
                  {language === "ar" ? "عاجل" : "Urgent"}
                </option>
                <option value="normal">
                  {language === "ar" ? "عادي" : "Normal"}
                </option>
                <option value="scheduled">
                  {language === "ar" ? "مجدول" : "Scheduled"}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === "ar" ? "المنطقة" : "Location"}
              </label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">
                  {language === "ar" ? "جميع المناطق" : "All locations"}
                </option>
                {propertyTerms.locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button
            className="w-full mt-4"
            onClick={() => handleSearch()}
            disabled={isSearching}
          >
            {isSearching ? (
              language === "ar" ? (
                "جاري البحث..."
              ) : (
                "Searching..."
              )
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                {language === "ar" ? "بحث" : "Search"}
              </>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
