"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/language-context";
import { useRouter } from "next/navigation";

export default function SearchWithVoice({
  placeholder,
  onSearch,
  className = "",
}: {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const { language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      // @ts-ignore
      const recognitionInstance = new webkitSpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = language === "ar" ? "ar-EG" : "en-US";

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        // Auto search after voice input
        if (transcript.trim()) {
          onSearch(transcript);
        }
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [language, onSearch, recognition]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setQuery("");
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            placeholder ||
            (language === "ar"
              ? "ابحث عن عقارات، أثاث، خدمات..."
              : "Search properties, furniture, services...")
          }
          className="pr-20 pl-4 py-6 text-base rounded-full border-2 border-gray-200 focus:border-blue-500"
          dir={language === "ar" ? "rtl" : "ltr"}
        />
        <div className="absolute right-2 flex space-x-1">
          {recognition && (
            <Button
              type="button"
              onClick={toggleListening}
              variant="ghost"
              size="icon"
              className={`rounded-full ${isListening ? "text-red-500" : "text-gray-500"}`}
              aria-label={isListening ? "Stop listening" : "Start voice search"}
            >
              {isListening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
          )}
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-500"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </form>
  );
}
