import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#0A8A80",
          tealDark: "#0B3F44",
          coral: "#E45C48",
          gold: "#D8AE4F",
          grayBg: "#F5F6F7",
          maroon: "#6d2e46",
          maroonDark: "#5a2438",
          pink: "#b44b73",
          yellow: "#fddf5c",
          whiteText: "#f7f7f7",
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
        brand: "0 12px 28px rgba(11,63,68,0.18)",
      },
      backgroundImage: {
        "brand-hero":
          "radial-gradient(800px 400px at 10% -10%, rgba(14,138,128,0.10), transparent 55%), radial-gradient(700px 360px at 95% -15%, rgba(228,92,72,0.10), transparent 55%), linear-gradient(180deg, #F5F6F7 0%, #FFFFFF 100%)",
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-roboto)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      // Animation Configuration - Merged
      animation: {
        'slide-in': 'slide-in 0.3s ease-out forwards',
        'slide-out': 'slide-out 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-out': 'fadeOut 0.5s ease-out',
        'bounce': 'bounce 0.5s ease infinite',
        'bounce-slow': 'bounce 2s ease infinite',
        'bounce-soft': 'bounce 0.5s ease-in-out infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-soft': 'pulse 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'confetti': 'confetti 3s linear forwards',
        'confetti-fall': 'confettiFall 5s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'zoom-in': 'zoomIn 0.3s ease-out',
        'zoom-out': 'zoomOut 0.3s ease-out',
      },
      // Keyframes Configuration - Added missing 'confetti'
      keyframes: {
        'slide-in': {
          'from': { 
            opacity: '0', 
            transform: 'translateX(30px)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
        },
        'slide-out': {
          'from': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
          'to': { 
            opacity: '0', 
            transform: 'translateX(-30px)' 
          },
        },
        'fadeIn': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'fadeOut': {
          'from': { opacity: '1' },
          'to': { opacity: '0' },
        },
        'bounce': {
          '0%, 100%': { 
            transform: 'translateY(0)' 
          },
          '50%': { 
            transform: 'translateY(-10px)' 
          },
        },
        'ping': {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        'confetti': {
          '0%': { 
            transform: 'translateY(-100px) rotate(0deg)',
            opacity: '1'
          },
          '100%': { 
            transform: 'translateY(100vh) rotate(360deg)',
            opacity: '0'
          },
        },
        'confettiFall': {
          '0%': { 
            transform: 'translateY(-100vh) rotate(0deg)',
            opacity: '1'
          },
          '100%': { 
            transform: 'translateY(100vh) rotate(360deg)',
            opacity: '0'
          },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'zoomIn': {
          'from': { 
            opacity: '0', 
            transform: 'scale(0.95)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'scale(1)' 
          },
        },
        'zoomOut': {
          'from': { 
            opacity: '1', 
            transform: 'scale(1)' 
          },
          'to': { 
            opacity: '0', 
            transform: 'scale(0.95)' 
          },
        },
      },
      // Transition Configuration
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;