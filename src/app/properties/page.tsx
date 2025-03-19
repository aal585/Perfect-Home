"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PropertyCard from "@/components/property-card";
import PropertySearch from "@/components/property-search";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      title: "Luxury Villa in New Cairo",
      price: "EGP 12,500,000",
      location: "New Cairo",
      beds: 4,
      baths: 3,
      area: "350 sqm",
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      title: "Modern Apartment with Sea View",
      price: "EGP 4,200,000",
      location: "Alexandria",
      beds: 3,
      baths: 2,
      area: "180 sqm",
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
      title: "Spacious Family Home",
      price: "EGP 8,750,000",
      location: "6th of October",
      beds: 5,
      baths: 4,
      area: "420 sqm",
    },
    {
      id: "4",
      image:
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
      title: "Penthouse with Panoramic View",
      price: "EGP 15,900,000",
      location: "Zamalek, Cairo",
      beds: 4,
      baths: 3,
      area: "300 sqm",
    },
    {
      id: "5",
      image:
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
      title: "Beachfront Chalet",
      price: "EGP 6,500,000",
      location: "North Coast",
      beds: 3,
      baths: 2,
      area: "150 sqm",
    },
    {
      id: "6",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      title: "Modern Townhouse",
      price: "EGP 9,200,000",
      location: "Sheikh Zayed",
      beds: 4,
      baths: 3,
      area: "280 sqm",
    },
  ]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/properties");
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        setProperties(data.properties || []);
        setFilteredProperties(data.properties || []);

        // Check if there are search params to apply filters
        if (searchParams.size > 0) {
          handleSearch();
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);

    try {
      // Get search parameters
      const query = searchParams.get("q") || "";
      const minPrice = searchParams.get("minPrice");
      const maxPrice = searchParams.get("maxPrice");
      const bedrooms = searchParams.get("bedrooms");
      const propertyType = searchParams.get("propertyType");

      // Build the query URL with parameters
      const queryParams = new URLSearchParams();
      if (query) queryParams.append("q", query);
      if (minPrice) queryParams.append("minPrice", minPrice);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);
      if (bedrooms) queryParams.append("bedrooms", bedrooms);
      if (propertyType) queryParams.append("propertyType", propertyType);

      // Make the API call
      const response = await fetch(`/api/properties?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data = await response.json();
      setFilteredProperties(data.properties || []);
    } catch (error) {
      console.error("Error searching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (option: string) => {
    setSortOption(option);
    let sorted = [...filteredProperties];

    switch (option) {
      case "price-low-high":
        sorted.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
          return priceA - priceB;
        });
        break;
      case "price-high-low":
        sorted.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
          return priceB - priceA;
        });
        break;
      case "newest":
        // In a real app, this would sort by date
        // For now, we'll just use the default order
        break;
      case "popular":
        // In a real app, this would sort by popularity
        // For now, we'll just randomize
        sorted.sort(() => Math.random() - 0.5);
        break;
    }

    setFilteredProperties(sorted);
  };

  const onSearch = (query: string, filters: any) => {
    // This would update the URL and trigger the useEffect
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">
            {language === "ar"
              ? "ابحث عن العقار المثالي"
              : "Find Your Perfect Property"}
          </h1>

          <PropertySearch onSearch={onSearch} />
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold">
              {filteredProperties.length}{" "}
              {language === "ar"
                ? "عقارات تم العثور عليها"
                : "Properties Found"}
            </h2>
            <p className="text-gray-500">
              {language === "ar"
                ? "عرض جميع العقارات المتاحة"
                : "Showing all available properties"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              {language === "ar" ? "ترتيب حسب:" : "Sort by:"}
            </span>
            <select
              className="border border-gray-300 rounded-md px-3 py-1.5 bg-white"
              value={sortOption}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="newest">
                {language === "ar" ? "الأحدث" : "Newest"}
              </option>
              <option value="price-low-high">
                {language === "ar"
                  ? "السعر: من الأقل إلى الأعلى"
                  : "Price: Low to High"}
              </option>
              <option value="price-high-low">
                {language === "ar"
                  ? "السعر: من الأعلى إلى الأقل"
                  : "Price: High to Low"}
              </option>
              <option value="popular">
                {language === "ar" ? "الأكثر شعبية" : "Most Popular"}
              </option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">
              {language === "ar"
                ? "لم يتم العثور على عقارات"
                : "No properties found"}
            </h3>
            <p className="text-gray-500">
              {language === "ar"
                ? "حاول تغيير معايير البحث الخاصة بك"
                : "Try changing your search criteria"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
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

        {filteredProperties.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Button variant="outline" className="mr-2">
              {language === "ar" ? "السابق" : "Previous"}
            </Button>
            <Button variant="outline" className="bg-blue-50">
              1
            </Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline" className="ml-2">
              {language === "ar" ? "التالي" : "Next"}
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
