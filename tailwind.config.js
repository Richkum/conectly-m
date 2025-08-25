/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
    "./providers/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        // WhatsApp-inspired green palette (optimized for mobile)
        primary: {
          50: "#e8f5e9",
          100: "#c8e6c9",
          200: "#a5d6a7",
          300: "#81c784",
          400: "#66bb6a",
          500: "#4caf50", // Base green
          600: "#43a047",
          700: "#388e3c",
          800: "#2e7d32",
          900: "#1b5e20",
          DEFAULT: "#25D366", // WhatsApp signature green
          dark: "#00A884", // Dark theme green
        },

        // Background colors (optimized for mobile screens)
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#111B21",
          secondary: {
            DEFAULT: "#F0F2F5",
            dark: "#1F2C33", // Slightly lighter for better contrast
          },
          chat: {
            DEFAULT: "#EFE7DE",
            dark: "#0B141A",
          },
          modal: {
            DEFAULT: "#FFFFFF",
            dark: "#1F2C33",
          },
        },

        // Text colors (mobile-optimized contrast)
        text: {
          DEFAULT: "#111B21",
          dark: "#E9EDEF",
          secondary: {
            DEFAULT: "#667781",
            dark: "#8696A0",
          },
          tertiary: {
            DEFAULT: "#9AA0A6",
            dark: "#667781",
          },
        },

        // Message bubbles (enhanced for better readability)
        bubble: {
          outgoing: {
            DEFAULT: "#DCF8C6", // Lighter green for better contrast
            dark: "#005C4B",
          },
          incoming: {
            DEFAULT: "#FFFFFF",
            dark: "#202C33", // Slightly lighter for better dark mode
          },
          status: {
            sent: "#8696A0",
            delivered: "#53BDEB",
            read: "#25D366",
          },
        },

        // UI Elements (mobile touch-friendly)
        element: {
          hover: {
            DEFAULT: "#F5F6F6",
            dark: "#2A3942",
          },
          active: {
            DEFAULT: "#25D366",
            dark: "#00A884",
          },
          border: {
            DEFAULT: "#E9EDEF",
            dark: "#2A3942", // Better visibility in dark mode
          },
          icon: {
            DEFAULT: "#54656F",
            dark: "#AEBAC1",
          },
        },

        // Status & System colors (consistent across themes)
        status: {
          online: "#25D366",
          offline: "#667781",
          typing: "#25D366",
          error: "#EA0038",
          warning: "#FFD279",
          success: "#25D366",
          info: "#53BDEB",
        },

        // Additional functional colors
        functional: {
          red: {
            DEFAULT: "#EA0038",
            dark: "#FF5252",
          },
          blue: {
            DEFAULT: "#0084FF",
            dark: "#53BDEB",
          },
          yellow: {
            DEFAULT: "#FFD279",
            dark: "#FFC107",
          },
        },
      },

      // Mobile-optimized spacing and typography
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "26px"],
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
      },

      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
      },
    },
  },
  plugins: [],
};
