const getRoomList = async () => {
  const { $apiConfig } = useNuxtApp()
  const apiUrl = $apiConfig.apiUrl
  const { data } = await useAsyncData("rooms", async () => {
    return $fetch(`${apiUrl}/api/v1/rooms`).catch(() => ({ result: [] }))
  });
  return data.value.result
}

const getRoomDetail = async (roomId) => {
  const { $apiConfig } = useNuxtApp()
  const apiUrl = $apiConfig.apiUrl
  const { data } = await useAsyncData("room", async () => {
    return $fetch(`${apiUrl}/api/v1/rooms/${roomId}`)
  });
  return data.value.result
}

const postOrder = async (orderData, token) => {
  const { $apiConfig } = useNuxtApp();
  const apiUrl = $apiConfig.apiUrl;
  const { $showAlert } = useNuxtApp();
  let result;
  try {
    const response = await $fetch("/api/v1/orders", {
      method: "POST",
      body: {
        ...orderData,
      },
      headers: {
        Authorization: token,
      },
      baseURL: apiUrl,
    });
    if (response.status) {
      result = response;
    } else {
      $showAlert({
        title: "訂房失敗",
        icon: "info",
        text: "請重新嘗試訂房",
      });
    }
  } catch (error) {
    $showAlert({
      title: "訂房發生錯誤",
      icon: "error",
      text: error.message,
    });
    return;
  }
  return result;
};

export const roomsApi = {
  getRoomList,
  getRoomDetail,
  postOrder
}