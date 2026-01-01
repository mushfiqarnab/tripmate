module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        midnight: "#0b1021",
        sky: "#6ae0ff",
        blush: "#ff7eb6",
        sand: "#f3efe5",
      },
      boxShadow: {
        glow: "0 10px 50px rgba(106, 224, 255, 0.25)",
      },
    },
  },
  plugins: [],
};
