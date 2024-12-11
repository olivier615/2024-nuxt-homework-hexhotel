const verifyEmail = async (email) => {
  const { $apiConfig } = useNuxtApp();
  const apiUrl = $apiConfig.apiUrl;
  const { $showAlert } = useNuxtApp();
  let result;
  try {
    const response = await $fetch("/api/v1/verify/email", {
      method: "POST",
      body: {
        email,
      },
      baseURL: apiUrl,
    });
    if (response) {
      result = response.result.isEmailExists;
    }
  } catch (error) {
    $showAlert({
      title: "信箱驗證錯誤",
      icon: "error",
      text: error.message,
    });
  }
  return result;
};

const createNewAccount = async (signupData) => {
  const { $apiConfig } = useNuxtApp();
  const apiUrl = $apiConfig.apiUrl;
  const { $showAlert } = useNuxtApp();
  let result;
  try {
    const response = await $fetch("/api/v1/user/signup", {
      method: "POST",
      body: {
        ...signupData,
      },
      baseURL: apiUrl,
    });
    console.log(response);
  } catch (error) {
    $showAlert({
      title: "錯誤",
      icon: "error",
      text: error.message,
    });
  }
  return result;
};

export const accountApi = {
  verifyEmail,
  createNewAccount,
};
