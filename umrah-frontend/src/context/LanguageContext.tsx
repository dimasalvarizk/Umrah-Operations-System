import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language, type Direction } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'umrah_operations_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ar' || saved === 'en') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'ar'; // Default Arabic
  });

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore
    }

    // Set document HTML attributes
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', language);
    document.body.setAttribute('dir', direction);
    document.title = language === 'ar' ? 'نظام عمليات الحج والعمرة' : 'Hajj & Umrah Operations System';

    // Apply font styling class to body
    if (language === 'ar') {
      document.body.classList.add('font-cairo');
      document.body.classList.remove('font-sans');
    } else {
      document.body.classList.add('font-sans');
      document.body.classList.remove('font-cairo');
    }
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language] as Record<string, string>;
    if (langDict && key in langDict) {
      return langDict[key];
    }
    // Fallback to Arabic dict if not found in current language
    const arDict = translations.ar as Record<string, string>;
    if (arDict && key in arDict) {
      return arDict[key];
    }
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRTL,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      <div dir={direction} className={language === 'ar' ? 'font-cairo' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
