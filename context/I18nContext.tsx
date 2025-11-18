import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Language = 'en' | 'ar';
// Using any for translations to avoid circular dependency issues with deep key access
type Translations = Record<string, any>;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem('language') as Language) || 'en'
  );
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [loading, setLoading] = useState(true);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    localStorage.setItem('language', language);

    const fetchTranslations = async () => {
        setLoading(true);
        try {
            const response = await fetch(`./locales/${language}.json`);
            if (!response.ok) {
                throw new Error(`Could not load ${language}.json`);
            }
            const data = await response.json();
            setTranslations(data);
        } catch (error) {
            console.error("Failed to fetch translations:", error);
            // Fallback to English if current language fails
            const response = await fetch(`./locales/en.json`);
            const data = await response.json();
            setTranslations(data);
        } finally {
            setLoading(false);
        }
    };

    fetchTranslations();
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = useCallback((key: string, options?: Record<string, string | number>): string => {
    if (!translations) return key;

    const keys = key.split('.');
    let result: any = translations;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        return key; // Return the key itself if not found
      }
    }

    if (typeof result === 'string' && options) {
      return Object.entries(options).reduce((str, [key, value]) => {
        return str.replace(`{{${key}}}`, String(value));
      }, result);
    }

    return result || key;
  }, [translations]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Translations...</div>
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
};
