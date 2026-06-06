/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#0d9488', // Muted teal
          600: '#0f766e',
          700: '#115e59',
          800: '#134e4a',
          900: '#0f3d39',
        },
        civic: {
          bg: '#f8f9fa',       // Off-white background
          surface: '#ffffff',  // White surfaces
          border: '#e9ecef',   // Soft grey border
          text: '#212529',     // Deep slate text
          muted: '#6c757d',    // Muted slate text
          light: '#f1f3f5',    // Soft grey surface
        },
        status: {
          safe: {
            bg: '#f0fdf4',
            text: '#15803d',
            border: '#dcfce7',
          },
          warning: {
            bg: '#fffbeb',
            text: '#b45309',
            border: '#fef3c7',
          },
          danger: {
            bg: '#fef2f2',
            text: '#b91c1c',
            border: '#fee2e2',
          },
          info: {
            bg: '#f0f9ff',
            text: '#0369a1',
            border: '#e0f2fe',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'civic': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.025)',
        'civic-md': '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.015)',
        'civic-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.015)',
      }
    },
  },
  plugins: [],
}


