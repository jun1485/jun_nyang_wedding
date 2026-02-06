export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["~/assets/css/fonts.css", "~/assets/css/theme.css"],
  // 빌드 시 gallery API 응답 정적 생성 - Vercel 서버리스에서 public/ 접근 불가 대응
  nitro: {
    prerender: {
      routes: ["/api/gallery"],
    },
  },
  app: {
    head: {
      meta: [
        { name: "theme-color", content: "#f43f5e" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/favicon.ico" }],
    },
  },
});
