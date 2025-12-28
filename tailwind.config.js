/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- This enables the toggle functionality
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        apple: {
          // Light Mode Colors
          bg: "#F5F5F7",       
          card: "#FFFFFF",     
          text: "#1D1D1F",     
          subtext: "#86868B",  
          blue: "#0071E3",
          
          // Dark Mode Colors (Custom palette)
          dark: {
            bg: "#050505",      // Rich Black
            card: "#121212",    // Dark Gray
            border: "#2A2A2A",  // Subtle Border
            text: "#F5F5F7",    // Off-white text
            subtext: "#A1A1A6", // Lighter gray
          }
        }
      }
    },
  },
  plugins: [],
}