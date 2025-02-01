import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language files
import en from './locales/en.json';
import sk from './locales/sk.json';

const resources = {
  en: { translation: en },
  sk: { translation: sk }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("language") || "en", // Default to English, or stored language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;