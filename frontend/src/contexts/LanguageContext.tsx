import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import i18next from 'i18next';
import React, { createContext, useEffect } from 'react';
interface Language {
  language: string;
  setLanguage: (value: string) => void;
}
export const LanguageContext = createContext<Language>({
  language: 'en',
  setLanguage: () => {},
});

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useLocalStorageState('en', 'language');
  useEffect(
    function () {
      i18next.changeLanguage(language);
    },
    [language]
  );
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
