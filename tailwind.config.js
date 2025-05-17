export default {
  content: [
    "./main.tsx",
    "./index.html",
    "/router/index.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [  
    require('tailwind-scrollbar-hide'),
  ],
};
