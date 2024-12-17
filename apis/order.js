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

const getOrderDetail = async (id, token) => {
  const { $apiConfig } = useNuxtApp();
  const apiUrl = $apiConfig.apiUrl;
  const { $showAlert } = useNuxtApp();
  let result;
  try {
    const response = await $fetch(`/api/v1/orders/${id}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
      baseURL: apiUrl,
    });
    if (response.status) {
      result = response;
    } else {
      $showAlert({
        title: "取得訂單失敗",
        icon: "info",
        text: "請重新嘗試取得訂單",
      });
    }
  } catch (error) {
    $showAlert({
      title: "取得訂單失敗",
      icon: "error",
      text: error.message,
    });
    return;
  }
  return result;
}

export const orderApi = {
  postOrder,
  getOrderDetail
}