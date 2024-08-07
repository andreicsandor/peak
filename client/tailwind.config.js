module.exports = {
  content: [
    "./index.html", // Add the path to your HTML files
    "./src/**/*.html",
    "./src/**/*.js",
  ],
  theme: {
    // Your theme configuration
  },
  plugins: [
    // Your plugins
    require('@tailwindcss/aspect-ratio'),
  ],
};
