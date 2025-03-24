"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import { MapPin, Building, Home, TrendingUp, Star } from "lucide-react";
import { useRouter } from "next/navigation";

type Location = {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  propertyCount: number;
  averagePrice: number;
  trending: boolean;
};

type PropertyRecommendation = {
  id: string;
  title: string;
  titleAr: string;
  type: string;
  typeAr: string;
  location: string;
  locationAr: string;
  price: number;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  featured: boolean;
};

export default function LocationBasedRecommendations() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [recommendations, setRecommendations] = useState<
    PropertyRecommendation[]
  >([]);
  const { language } = useLanguage();
  const router = useRouter();

  // Sample data for locations
  const sampleLocations: Location[] = [
    {
      id: "tagamoa",
      name: "New Cairo",
      nameAr: "التجمع الخامس",
      description:
        "Modern residential area with upscale compounds and commercial centers",
      descriptionAr: "منطقة سكنية حديثة تضم مجمعات راقية ومراكز تجارية",
      image:
        "https://images.unsplash.com/photo-1549893072-4bc678117f45?w=800&q=80",
      propertyCount: 245,
      averagePrice: 3500000,
      trending: true,
    },
    {
      id: "zayed",
      name: "Sheikh Zayed",
      nameAr: "الشيخ زايد",
      description:
        "Suburban city with family-friendly communities and green spaces",
      descriptionAr: "مدينة ضاحية تضم مجتمعات مناسبة للعائلات ومساحات خضراء",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      propertyCount: 187,
      averagePrice: 3200000,
      trending: true,
    },
    {
      id: "maadi",
      name: "Maadi",
      nameAr: "المعادي",
      description:
        "Established neighborhood with tree-lined streets and expat community",
      descriptionAr: "حي راقٍ ذو شوارع مظللة بالأشجار ومجتمع من الوافدين",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      propertyCount: 156,
      averagePrice: 2800000,
      trending: false,
    },
    {
      id: "october",
      name: "6th of October",
      nameAr: "السادس من أكتوبر",
      description:
        "Expanding city with affordable housing and industrial zones",
      descriptionAr: "مدينة متوسعة ذات مساكن بأسعار معقولة ومناطق صناعية",
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      propertyCount: 203,
      averagePrice: 1900000,
      trending: false,
    },
    {
      id: "newcapital",
      name: "New Administrative Capital",
      nameAr: "العاصمة الإدارية الجديدة",
      description:
        "Egypt's new capital with modern infrastructure and government buildings",
      descriptionAr: "عاصمة مصر الجديدة ببنية تحتية حديثة ومباني حكومية",
      image:
        "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
      propertyCount: 178,
      averagePrice: 4200000,
      trending: true,
    },
  ];

  // Sample data for property recommendations
  const sampleRecommendations: PropertyRecommendation[] = [
    {
      id: "prop1",
      title: "Luxury Apartment in Eastown",
      titleAr: "شقة فاخرة في إيستاون",
      type: "Apartment",
      typeAr: "شقة",
      location: "New Cairo",
      locationAr: "التجمع الخامس",
      price: 3800000,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      featured: true,
    },
    {
      id: "prop2",
      title: "Modern Villa in Allegria",
      titleAr: "فيلا حديثة في أليجريا",
      type: "Villa",
      typeAr: "فيلا",
      location: "Sheikh Zayed",
      locationAr: "الشيخ زايد",
      price: 8500000,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      bedrooms: 4,
      bathrooms: 3,
      area: 320,
      featured: true,
    },
    {
      id: "prop3",
      title: "Cozy Apartment in Degla",
      titleAr: "شقة مريحة في دجلة",
      type: "Apartment",
      typeAr: "شقة",
      location: "Maadi",
      locationAr: "المعادي",
      price: 2500000,
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      bedrooms: 2,
      bathrooms: 1,
      area: 140,
      featured: false,
    },
    {
      id: "prop4",
      title: "Spacious Townhouse in Zayed 2000",
      titleAr: "تاون هاوس واسع في زايد 2000",
      type: "Townhouse",
      typeAr: "تاون هاوس",
      location: "Sheikh Zayed",
      locationAr: "الشيخ زايد",
      price: 4200000,
      image:
        "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
      bedrooms: 3,
      bathrooms: 3,
      area: 220,
      featured: false,
    },
  ];

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setLocations(sampleLocations);

    // Set default location
    if (!selectedLocation && sampleLocations.length > 0) {
      setSelectedLocation(sampleLocations[0].id);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setIsLoading(true);

      // Filter recommendations based on selected location
      const locationName =
        sampleLocations.find((loc) => loc.id === selectedLocation)?.name || "";
      const filteredRecommendations = sampleRecommendations.filter(
        (prop) => prop.location === locationName,
      );

      // If no recommendations for this location, show all featured properties
      const recommendationsToShow =
        filteredRecommendations.length > 0
          ? filteredRecommendations
          : sampleRecommendations.filter((prop) => prop.featured);

      setTimeout(() => {
        setRecommendations(recommendationsToShow);
        setIsLoading(false);
      }, 500);
    }
  }, [selectedLocation]);

  const formatPrice = (price: number) => {
    if (language === "ar") {
      // Format for Arabic locale
      return price.toLocaleString("ar-EG") + " جنيه";
    } else {
      // Format for English locale
      if (price >= 1000000) {
        return (price / 1000000).toFixed(1) + "M EGP";
      } else {
        return (price / 1000).toFixed(0) + "K EGP";
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-blue-600 text-white">
        <h2 className="text-xl font-bold">
          {language === "ar"
            ? "استكشف المناطق الشهيرة"
            : "Explore Popular Areas"}
        </h2>
        <p className="text-sm text-blue-100">
          {language === "ar"
            ? "اكتشف أفضل العقارات في أكثر المناطق طلباً في مصر"
            : "Discover the best properties in Egypt's most sought-after locations"}
        </p>
      </div>

      <Tabs defaultValue="map" className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="map">
              <MapPin className="h-4 w-4 mr-2" />
              {language === "ar" ? "المناطق" : "Areas"}
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="h-4 w-4 mr-2" />
              {language === "ar" ? "الأكثر رواجاً" : "Trending"}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="map" className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {locations.map((location) => (
              <Card
                key={location.id}
                className={`cursor-pointer hover:shadow-lg transition-shadow ${selectedLocation === location.id ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setSelectedLocation(location.id)}
              >
                <div className="relative h-32 w-full">
                  <img
                    src={location.image}
                    alt={language === "ar" ? location.nameAr : location.name}
                    className="h-full w-full object-cover"
                  />
                  {location.trending && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {language === "ar" ? "رائج" : "Trending"}
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-bold text-sm">
                    {language === "ar" ? location.nameAr : location.name}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Building className="h-3 w-3 mr-1" />
                    <span>
                      {location.propertyCount}{" "}
                      {language === "ar" ? "عقار" : "properties"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">
                {language === "ar"
                  ? "عقارات موصى بها"
                  : "Recommended Properties"}
              </h3>
              <Button variant="link" onClick={() => router.push("/properties")}>
                {language === "ar" ? "عرض الكل" : "View all"}
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="relative h-48 w-full">
                      <img
                        src={property.image}
                        alt={
                          language === "ar" ? property.titleAr : property.title
                        }
                        className="h-full w-full object-cover"
                      />
                      {property.featured && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          {language === "ar" ? "مميز" : "Featured"}
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <h3 className="font-bold text-white">
                          {language === "ar"
                            ? property.titleAr
                            : property.title}
                        </h3>
                        <div className="flex items-center text-white/90 text-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>
                            {language === "ar"
                              ? property.locationAr
                              : property.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          {language === "ar" ? property.typeAr : property.type}
                        </span>
                        <span className="font-bold text-blue-600">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-3">
                            {property.bedrooms}{" "}
                            {language === "ar" ? "غرف" : "BD"}
                          </span>
                          <span className="mr-3">
                            {property.bathrooms}{" "}
                            {language === "ar" ? "حمام" : "BA"}
                          </span>
                          <span>
                            {property.area} {language === "ar" ? "م²" : "m²"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() =>
                          router.push(`/properties/${property.id}`)
                        }
                      >
                        {language === "ar" ? "عرض التفاصيل" : "View Details"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="p-4">
          <div className="space-y-4">
            <h3 className="font-bold">
              {language === "ar" ? "المناطق الأكثر رواجاً" : "Trending Areas"}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {locations
                .filter((location) => location.trending)
                .map((location) => (
                  <Card key={location.id} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3 h-48 md:h-auto">
                        <img
                          src={location.image}
                          alt={
                            language === "ar" ? location.nameAr : location.name
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-4">
                        <h3 className="font-bold text-lg">
                          {language === "ar" ? location.nameAr : location.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 mb-3">
                          {language === "ar"
                            ? location.descriptionAr
                            : location.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1 text-blue-600" />
                            <span>
                              {location.propertyCount}{" "}
                              {language === "ar" ? "عقار" : "properties"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Home className="h-4 w-4 mr-1 text-blue-600" />
                            <span>
                              {language === "ar" ? "متوسط السعر" : "Avg. price"}
                              : {formatPrice(location.averagePrice)}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="mt-4"
                          onClick={() => {
                            setSelectedLocation(location.id);
                            document
                              .querySelector(
                                '[data-state="inactive"][value="map"]',
                              )
                              ?.click();
                          }}
                        >
                          {language === "ar"
                            ? "عرض العقارات"
                            : "View Properties"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
