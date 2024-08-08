import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  server: {
    host: 'localhost',
    port: 5173,
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
};
