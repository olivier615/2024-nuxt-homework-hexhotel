const getNewsList = async () => {
  const { $apiConfig } = useNuxtApp()
  const apiUrl = $apiConfig.apiUrl
  const { data } = await useAsyncData("news", async () => {
    const apis = $fetch(`${apiUrl}/api/v1/home/news/`).catch(() => ({ result: [] }))
    return apis;
  });
  return data.value.result
}

const getCulinaryList = async () => {
  const { $apiConfig } = useNuxtApp()
  const apiUrl = $apiConfig.apiUrl
  const { data } = await useAsyncData("culinary", async () => {
    const apis = $fetch(`${apiUrl}/api/v1/home/culinary/`).catch(() => ({ result: [] }))
    return apis;
  });
  return data.value.result
}

export const indexApi = {
  getNewsList,
  getCulinaryList
}