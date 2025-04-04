import React, { createContext, useEffect, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { Colors } from "./Colors";

enum Theme {
  light = "light",
  dark = "dark",
}
const themeStorageKey = "theme";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: Theme.light,
  toggleTheme: () => {},
});

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(Theme.light);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem(themeStorageKey);
      if (storedTheme === Theme.light || storedTheme === Theme.dark) {
        setTheme(storedTheme as Theme);
      } else {
        const systemTheme = Appearance.getColorScheme();
        setTheme(systemTheme === "dark" ? Theme.dark : Theme.light);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === Theme.light ? Theme.dark : Theme.light;
    setTheme(newTheme);
    await AsyncStorage.setItem(themeStorageKey, newTheme);
  };

  const paperTheme = theme === Theme.dark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export const lightTheme = {
  ...MD3LightTheme,
  colors: Colors.light,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: Colors.dark,
};

export default ThemeProvider;
