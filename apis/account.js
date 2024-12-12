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
    if (response.status) {
      saveToken(response.token);
      result = response
    } else {
      $showAlert({
        title: "註冊失敗",
        icon: "info",
        text: '請重新嘗試註冊',
      });
    }
  } catch (error) {
    $showAlert({
      title: "註冊發生錯誤",
      icon: "error",
      text: error.message,
    });
    return;
  }
  return result;
};

const checkCookie = async (token) => {
  const { $apiConfig } = useNuxtApp();
  const apiUrl = $apiConfig.apiUrl;
  try {
    const response = await $fetch("/api/v1/user/check", {
      method: "GET",
      baseURL: apiUrl,
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

const userLogin = async ({ email, password }) => {
  const { $apiConfig } = useNuxtApp();
  const apiUrl = $apiConfig.apiUrl;
  try {
    const response = await $fetch("/api/v1/user/login", {
      method: "POST",
      baseURL: apiUrl,
      body: {
        email,
        password,
      },
    });
    if (response.status) {
      saveToken(response.token);
      return response.status
    } else {
      $showAlert({
        title: "登入失敗",
        icon: "info",
        text: '請重新嘗試登入',
      });
      return false
    }
  } catch (error) {
    console.error(error);
  }
};

const getUserData = async (token) => {
  const { $apiConfig } = useNuxtApp();
  const apiUrl = $apiConfig.apiUrl;
  try {
    const response = await $fetch("/api/v1/user", {
      method: "GET",
      baseURL: apiUrl,
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    // console.error(error);
  }
}

const logOut = () => {
  const cookie = useCookie("auth")
  cookie.value = null
}

const saveToken = (token) => {
  const cookie = useCookie("auth", {
    expire: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    path: "/",
  });
  cookie.value = token;
};

export const accountApi = {
  verifyEmail,
  createNewAccount,
  checkCookie,
  userLogin,
  getUserData,
  logOut
};
