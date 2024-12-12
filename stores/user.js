import { defineStore } from "pinia";
export const useUserStore = defineStore("user", () => {
  const userData = ref({})
  const setUserData = (data) => {
    userData.value = data
  }
  const deleteUserData = () => {
    userData.value = {}
  }
  return {
    userData,
    setUserData,
    deleteUserData
  };
});
