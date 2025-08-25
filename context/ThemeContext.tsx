// context/ThemeContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, useColorScheme, View } from "react-native";

export type ThemePreference = "light" | "dark" | "system";

interface ThemeContextType {
  isDark: boolean;
  theme: ThemePreference;
  toggleTheme: () => void;
  setTheme: (theme: ThemePreference) => void;
  appliedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@theme_preference";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme() || "light";
  const [theme, setThemeState] = useState<ThemePreference>("system");
  const [isLoading, setIsLoading] = useState(true);

  // Determine applied theme
  const appliedTheme = theme === "system" ? systemColorScheme : theme;
  const isDark = appliedTheme === "dark";

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
          setThemeState(savedTheme as ThemePreference);
        }
      } catch (error) {
        console.log("Error loading theme preference:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  const setTheme = async (newTheme: ThemePreference) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.log("Error saving theme preference:", error);
    }
  };

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(() => {
      // The appliedTheme will automatically update due to the dependency on systemColorScheme
      // No manual state update needed here
    });

    return () => subscription.remove();
  }, []);

  // Improved toggle logic: cycles through system -> light -> dark -> system
  const toggleTheme = () => {
    switch (theme) {
      case "system":
        setTheme("light");
        break;
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("system");
        break;
      default:
        setTheme("system");
    }
  };

  const value: ThemeContextType = {
    isDark,
    theme,
    toggleTheme,
    setTheme,
    appliedTheme,
  };

  // Don't render children until theme is loaded
  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <ThemeContext.Provider value={value}>
      <View style={{ flex: 1 }} className={isDark ? "dark" : ""}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
