import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
};
