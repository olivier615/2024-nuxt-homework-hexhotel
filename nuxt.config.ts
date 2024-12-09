// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["@/assets/styles/all.scss"],
  runtimeConfig: {
    token: "1234567890",
    // 不公開的敏感訊息
    public: {
      apiUrl: "https://nuxr3.zeabur.app/api",
      // PI URL 等環境差異有關的變數放 public
    },
  },
});
