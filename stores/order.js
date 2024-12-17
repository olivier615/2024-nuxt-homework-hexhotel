import { defineStore } from "pinia";
export const useOrderStore = defineStore("order", () => {
  const orderRoomInfo = ref({});
  const setOrderRoomInfo = ({ roomId, checkInDate, checkOutDate, peopleNum, daysCount }) => {
    orderRoomInfo.value = {
      roomId,
      checkInDate,
      checkOutDate,
      peopleNum,
      daysCount
    };
  };
  return {
    orderRoomInfo,
    setOrderRoomInfo,
  };
});

