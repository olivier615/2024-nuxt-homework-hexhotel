import { defineRule, configure } from "vee-validate";
import { required, email, min } from "@vee-validate/rules";

import { localize, setLocale } from "@vee-validate/i18n";
import zhTW from "@vee-validate/i18n/dist/locale/zh_TW.json";

export default defineNuxtPlugin((nuxtApp) => {
  // 定義全域的規則
  defineRule("required", required);
  defineRule("min", min);
  defineRule("email", email);
  defineRule("password", (value) => {
    if (!value) {
      return "密碼為必填項"; // 自定義錯誤訊息（可用 zhTW.json 定義）
    }
    if (value.length < 6) {
      return "密碼最少需要 6 個字符";
    }
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
    if (!regex.test(value)) {
      return "密碼必須包含英文字母和數字";
    }
    return true;
  });
  // 定義確認密碼驗證規則
  defineRule("confirmPassword", (value, [target]) => {
    if (!value) {
      return "確認密碼為必填項";
    }
    if (value !== target) {
      return "確認密碼必須與密碼相符";
    }
    return true;
  });
  defineRule("name", (value) => {
    if (!value) {
      return "名字為必填項";
    }
    if (value.trim().length < 2) {
      return "名字最少需要 2 個字元";
    }
    return true;
  });
  defineRule("phone", (value) => {
    if (!value) {
      return "手機號碼為必填項";
    }
    const regex = /^09\d{8}$/; // 確認以 09 開頭且後面為 8 個數字
    if (!regex.test(value)) {
      return "手機號碼必須以 09 開頭且為 10 位數字";
    }
    return true;
  });
  configure({
    // 載入繁體中文的設定檔，產生繁體中文的驗證訊息
    generateMessage: localize({ zh_TW: zhTW }),
    validateOnInput: true, // 輸入文字時立即進行驗證
  });

  // 設定預設語言為繁體中文
  setLocale("zh_TW");
});
