import Swal from "sweetalert2";

function showAlert({
  title= '未知的錯誤',
  icon= 'warning',
  text= '',
  confirmButtonText = '確認',
  showCloseButton = true,
  ...otherParameters
} = {}) {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    ...otherParameters,
  });
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("showAlert", showAlert);
});