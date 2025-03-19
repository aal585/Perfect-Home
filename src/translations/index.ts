import en from "./en";
import ar from "./ar";

export type TranslationKey = keyof typeof en;

const translations = {
  en,
  ar,
};

export default translations;
