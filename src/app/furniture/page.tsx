"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ShoppingCart, Star, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "../../../supabase/client";
import { useLanguage } from "@/contexts/language-context";
import FurnitureCard from "@/components/furniture-card";
import FurniturePlacementModal from "@/components/furniture-placement-modal";

export default function FurniturePage() {
  const [furnitureItems, setFurnitureItems] = useState([
    // Initial mock data that will be replaced with real data from the database
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      title: "Modern Sofa",
      price: "EGP 15,000",
      rating: 4.8,
      reviews: 124,
      category: "Living Room",
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
      title: "Dining Table Set",
      price: "EGP 22,500",
      rating: 4.6,
      reviews: 98,
      category: "Dining Room",
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      title: "King Size Bed",
      price: "EGP 18,900",
      rating: 4.9,
      reviews: 156,
      category: "Bedroom",
    },
    {
      id: "4",
      image:
        "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&q=80",
      title: "Office Desk",
      price: "EGP 7,500",
      rating: 4.7,
      reviews: 87,
      category: "Office",
    },
    {
      id: "5",
      image:
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
      title: "Bookshelf",
      price: "EGP 5,200",
      rating: 4.5,
      reviews: 62,
      category: "Living Room",
    },
    {
      id: "6",
      image:
        "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=80",
      title: "Accent Chair",
      price: "EGP 4,800",
      rating: 4.6,
      reviews: 73,
      category: "Living Room",
    },
    {
      id: "7",
      image:
        "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80",
      title: "Coffee Table",
      price: "EGP 6,300",
      rating: 4.7,
      reviews: 91,
      category: "Living Room",
    },
    {
      id: "8",
      image:
        "https://images.unsplash.com/photo-1551298370-9d3d53740c72?w=800&q=80",
      title: "Wardrobe",
      price: "EGP 12,700",
      rating: 4.8,
      reviews: 104,
      category: "Bedroom",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVirtualPlacementOpen, setIsVirtualPlacementOpen] = useState(false);
  const [selectedFurniture, setSelectedFurniture] = useState<any>(null);
  const { language } = useLanguage();
  const supabase = createClient();

  // Fetch furniture data from the database
  useEffect(() => {
    const fetchFurniture = async () => {
      setIsLoading(true);
      try {
        let query = supabase.from("furniture").select("*");

        // Apply category filter if selected
        if (selectedCategory) {
          query = query.eq("category", selectedCategory);
        }

        // Apply search query if provided
        if (searchQuery) {
          query = query.or(
            `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`,
          );
        }

        const { data, error } = await query.limit(20);

        if (error) throw error;

        if (data) {
          setFurnitureItems(data);
        }
      } catch (err) {
        console.error("Error fetching furniture:", err);
        setError(
          language === "ar"
            ? "حدث خطأ أثناء جلب الأثاث"
            : "Error fetching furniture",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFurniture();
  }, [selectedCategory, searchQuery, language]);

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

  const handleSearch = () => {
    // The search is already handled by the useEffect
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleFurnitureSelect = (furniture: any) => {
    setSelectedFurniture(furniture);
    setIsVirtualPlacementOpen(true);
  };

  // Categories
  const categories = [
    "Living Room",
    "Bedroom",
    "Dining Room",
    "Office",
    "Kitchen",
    "Bathroom",
    "Outdoor",
    "Decor",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Furnish Your Dream Home</h1>
            <p className="text-blue-100 text-lg mb-8">
              Discover our collection of high-quality furniture and use our AI
              tool to visualize how it would look in your space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Try Virtual Placement
              </Button>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-blue-700"
              >
                Browse Catalog
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-1/3 h-full hidden lg:block">
          <div className="relative h-full w-full">
            <Image
              src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80"
              alt="Furniture"
              fill
              style={{ objectFit: "cover" }}
              className="opacity-20"
            />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === "ar"
                    ? "ابحث عن الأثاث..."
                    : "Search for furniture..."
                }
                className="pl-10 py-6 w-full"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-8"
              onClick={handleSearch}
            >
              {language === "ar" ? "بحث" : "Search"}
            </Button>
            <Button variant="outline" className="py-6 px-8 flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Feature Banner */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold mb-3">
                AI Furniture Placement
              </h2>
              <p className="text-gray-600 mb-4">
                Upload a photo of your room and our AI will help you visualize
                how different furniture pieces would look in your space.
              </p>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsVirtualPlacementOpen(true)}
              >
                {language === "ar" ? "جربه الآن" : "Try It Now"}
                <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="md:w-1/3">
              <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
                  alt="AI Furniture Placement"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Furniture Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Furniture</h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded-md px-3 py-1.5 bg-white">
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : furnitureItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {language === "ar"
                ? "لم يتم العثور على أثاث"
                : "No furniture found"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {furnitureItems.map((item) => (
              <FurnitureCard
                key={item.id}
                id={item.id}
                image={item.image}
                title={item.title}
                price={item.price}
                category={item.category}
                rating={item.rating}
                reviews={item.reviews}
                onClick={() => {
                  recordFurnitureView(item.id);
                }}
              />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Button variant="outline" className="mr-2">
            Previous
          </Button>
          <Button variant="outline" className="bg-blue-50">
            1
          </Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline" className="ml-2">
            Next
          </Button>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Our Furniture Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Delivery & Assembly",
                description:
                  "We deliver and assemble your furniture with care and precision.",
                image:
                  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
              },
              {
                title: "Interior Design",
                description:
                  "Get professional advice from our experienced interior designers.",
                image:
                  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
              },
              {
                title: "Custom Furniture",
                description:
                  "We can create custom furniture pieces tailored to your needs.",
                image:
                  "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=80",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Button variant="outline">Learn More</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* Virtual Placement Modal */}
      <FurniturePlacementModal
        isOpen={isVirtualPlacementOpen}
        onClose={() => {
          setIsVirtualPlacementOpen(false);
          setSelectedFurniture(null);
        }}
        furnitureItem={selectedFurniture}
      />
    </div>
  );
}
