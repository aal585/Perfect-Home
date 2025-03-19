"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MapPin, Mic, MicOff, X } from "lucide-react";
import VoiceSearchTooltip from "./voice-search-tooltip";
import { useLanguage } from "@/contexts/language-context";
import { useRouter } from "next/navigation";
import { useSpeechRecognition } from "@/components/speech-recognition-provider";
import { debounce } from "@/lib/performance-optimization";
import ButtonWithFeedback from "./button-with-feedback";

interface PropertySearchProps {
  onSearch?: (query: string, filters: any) => void;
  className?: string;
}

export default function PropertySearch({
  onSearch,
  className,
}: PropertySearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    propertyType: "",
  });
  const { language } = useLanguage();
  const router = useRouter();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  const { startListening, stopListening } = useSpeechRecognition();

  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      resetTranscript();
      // Set Arabic language for speech recognition if the app is in Arabic mode
      startListening({
        language: language === "ar" ? "ar-EG" : "en-US",
      });
    }
  };

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

  // Memoize the search handler with useCallback to prevent unnecessary re-renders
  const handleSearch = useCallback(() => {
    // Build query string
    const queryParams = new URLSearchParams();

    if (searchQuery) {
      queryParams.append("q", searchQuery);
    }

    if (filters.minPrice) {
      queryParams.append("minPrice", filters.minPrice);
    }

    if (filters.maxPrice) {
      queryParams.append("maxPrice", filters.maxPrice);
    }

    if (filters.bedrooms) {
      queryParams.append("bedrooms", filters.bedrooms);
    }

    if (filters.propertyType) {
      queryParams.append("propertyType", filters.propertyType);
    }

    // If onSearch prop is provided, call it
    if (onSearch) {
      onSearch(searchQuery, filters);
    } else {
      // Otherwise navigate to properties page with query params
      router.push(`/properties?${queryParams.toString()}`);
    }
  }, [searchQuery, filters, onSearch, router]);

  // Create a debounced version of the search function for input changes
  const debouncedSearch = debounce(handleSearch, 300);

  const handleLocationClick = (location: string) => {
    setSearchQuery(location);
    // Trigger search after setting the location
    setTimeout(() => handleSearch(), 0);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilters({
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      propertyType: "",
    });
  };

  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.length > 2) {
                debouncedSearch();
              }
            }}
            placeholder={
              language === "ar"
                ? "ابحث حسب الموقع، نوع العقار، أو الكلمات الرئيسية..."
                : "Search by location, property type, or keywords..."
            }
            className="pl-10 pr-12 py-6 w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            {browserSupportsSpeechRecognition && isMicrophoneAvailable && (
              <VoiceSearchTooltip isListening={isListening}>
                <button
                  type="button"
                  className="focus:outline-none"
                  onClick={toggleListening}
                  aria-label={
                    isListening ? "Stop listening" : "Start voice search"
                  }
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5 text-red-500 animate-pulse" />
                  ) : (
                    <Mic className="h-5 w-5 text-gray-400 hover:text-blue-500" />
                  )}
                </button>
              </VoiceSearchTooltip>
            )}
          </div>
        </div>
        <ButtonWithFeedback
          className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-blue-500"
          onClick={handleSearch}
          loadingText={language === "ar" ? "جاري البحث..." : "Searching..."}
          successText={language === "ar" ? "تم البحث!" : "Searched!"}
        >
          {language === "ar" ? "بحث" : "Search"}
        </ButtonWithFeedback>
        <Button
          variant="outline"
          className="py-6 px-8 flex items-center transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-blue-300"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          aria-controls="filter-panel"
        >
          <Filter className="mr-2 h-5 w-5" />
          {language === "ar" ? "الفلاتر" : "Filters"}
        </Button>
      </div>

      {showFilters && (
        <div
          id="filter-panel"
          className="mt-4 p-4 border rounded-lg bg-white shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label
                htmlFor="min-price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {language === "ar" ? "السعر الأدنى" : "Min Price"}
              </label>
              <Input
                id="min-price"
                type="number"
                placeholder="EGP"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="max-price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {language === "ar" ? "السعر الأقصى" : "Max Price"}
              </label>
              <Input
                id="max-price"
                type="number"
                placeholder="EGP"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="bedrooms"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {language === "ar" ? "غرف النوم" : "Bedrooms"}
              </label>
              <select
                id="bedrooms"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.bedrooms}
                onChange={(e) =>
                  setFilters({ ...filters, bedrooms: e.target.value })
                }
              >
                <option value="">{language === "ar" ? "أي عدد" : "Any"}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="property-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {language === "ar" ? "نوع العقار" : "Property Type"}
              </label>
              <select
                id="property-type"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.propertyType}
                onChange={(e) =>
                  setFilters({ ...filters, propertyType: e.target.value })
                }
              >
                <option value="">{language === "ar" ? "الكل" : "All"}</option>
                {propertyTypes.map((type, index) => (
                  <option key={index} value={type.en}>
                    {language === "ar" ? type.ar : type.en}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() =>
                setFilters({
                  minPrice: "",
                  maxPrice: "",
                  bedrooms: "",
                  propertyType: "",
                })
              }
            >
              {language === "ar" ? "إعادة ضبط" : "Reset"}
            </Button>
            <ButtonWithFeedback
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSearch}
              loadingText={
                language === "ar" ? "جاري التطبيق..." : "Applying..."
              }
              successText={language === "ar" ? "تم التطبيق!" : "Applied!"}
            >
              {language === "ar" ? "تطبيق الفلاتر" : "Apply Filters"}
            </ButtonWithFeedback>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {locations.map((location, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="flex items-center hover:bg-blue-50 hover:text-blue-600 transition-colors"
            onClick={() =>
              handleLocationClick(language === "ar" ? location.ar : location.en)
            }
          >
            <MapPin className="mr-1 h-3 w-3" />
            {language === "ar" ? location.ar : location.en}
          </Button>
        ))}
      </div>
    </div>
  );
}
