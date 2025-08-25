// components/ThemeToggleButton.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

const ThemeToggleButton = () => {
  const { theme, toggleTheme, isDark, appliedTheme } = useTheme();

  const getToggleIcon = () => {
    switch (theme) {
      case "light":
        return "🌙"; // Show moon when in light mode (next: dark)
      case "dark":
        return "📱"; // Show device when in dark mode (next: system)
      case "system":
        return appliedTheme === "light" ? "🌙" : "☀️"; // Show opposite of current system theme
      default:
        return "⚙️";
    }
  };

  const getToggleText = () => {
    switch (theme) {
      case "light":
        return "Light → Dark";
      case "dark":
        return "Dark → System";
      case "system":
        return `System (${appliedTheme}) → Light`;
      default:
        return "Theme";
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isDark ? "#374151" : "#3B82F6",
          shadowColor: isDark ? "#000" : "#000",
        },
      ]}
      onPress={toggleTheme}
      accessibilityLabel={`Change theme. Current: ${getToggleText()}`}
      accessibilityRole="button"
    >
      <Text style={[styles.icon, { color: "#FFFFFF" }]}>{getToggleIcon()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    fontSize: 20,
    fontWeight: "600",
  },
});

export default ThemeToggleButton;
