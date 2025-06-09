export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts", "@pinia/nuxt"],
  googleFonts: {
    families: {
      Quicksand: [400, 700],
      "Dancing Script": [700],
    },
  },
});
