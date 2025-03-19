"use client";

import { useLanguage } from "@/contexts/language-context";
import translations, { TranslationKey } from "@/translations";

export function useTranslations() {
  const { language } = useLanguage();

  const t = (key: TranslationKey) => {
    return translations[language][key] || key;
  };

  return { t };
}
