import { createContext, useContext, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

interface CreateContext {
  isDark: boolean;
  changeMode: (value?: boolean) => void;
}

const DarkMode = createContext<CreateContext>({
  isDark: false,
  changeMode: () => {},
});

function DarkModeContext({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useLocalStorageState(true, 'isDark'); // Default to dark mode

  useEffect(
    function () {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    [isDark]
  );

  function changeMode(value?: boolean) {
    if (value !== undefined) {
      setIsDark(value);
    } else {
      setIsDark((prev: boolean) => !prev);
    }
  }

  return (
    <DarkMode.Provider
      value={{
        isDark,
        changeMode,
      }}
    >
      {children}
    </DarkMode.Provider>
  );
}

function useDarkMode() {
  const context = useContext(DarkMode);
  if (!context) {
    throw new Error('Context was utilised outside of DarkModeContext');
  }

  return context;
}

export { useDarkMode, DarkModeContext };
