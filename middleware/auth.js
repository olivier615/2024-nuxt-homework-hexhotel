import { accountApi } from "~/apis/account";
export default defineNuxtRouteMiddleware(async (to, from) => {
  const getUserCookie = useCookie("auth");
  const { $showAlert } = useNuxtApp();
  // console.log(getUserCookie.value);
  console.log("middleware", to, from);
  const token = getUserCookie.value
  const checkResult = await accountApi.checkCookie(token);
  if (!checkResult) {
    $showAlert({
      title: "您尚未登入",
      icon: "info",
      text: "請重新登入或註冊新帳號",
    });
    return navigateTo("/account/login")
  }
});
