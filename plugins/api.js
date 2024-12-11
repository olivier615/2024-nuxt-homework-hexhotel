export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  return {
    provide: {
      apiConfig: config.public,
    },
  };
});