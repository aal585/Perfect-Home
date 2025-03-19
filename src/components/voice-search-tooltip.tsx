"use client";

import { useLanguage } from "@/contexts/language-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface VoiceSearchTooltipProps {
  children: ReactNode;
  isListening: boolean;
}

export default function VoiceSearchTooltip({
  children,
  isListening,
}: VoiceSearchTooltipProps) {
  const { language } = useLanguage();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          {isListening
            ? language === "ar"
              ? "جاري الاستماع..."
              : "Listening..."
            : language === "ar"
              ? "البحث الصوتي"
              : "Voice Search"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
