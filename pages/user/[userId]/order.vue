<script setup>
import { Icon } from "@iconify/vue";
import { orderApi } from "~/apis/order";
const { $showAlert } = useNuxtApp();

useSeoMeta({
  title: "享樂酒店 | 我的訂單",
});

const shortList = ref([])
const historyList = ref([])
const getUserCookie = useCookie("auth");
const userStore = useUserStore();

const showFullList = ref(false);
const discount = ref(1000);
const orderList = ref([]);
const orderResult = await orderApi.getOrderList(
  userStore.userData._id,
  getUserCookie.value
);
orderList.value = orderResult.result;
console.log(orderList.value.length)
shortList.value = [
orderList.value[0],
orderList.value[1],
orderList.value[2],
]
historyList.value = shortList.value

watch(showFullList, (newOption) => {
  if(newOption) {
    historyList.value = orderList.value
  } else {
    historyList.value = shortList.value
  }
});
const lastOrder = ref(orderList.value[orderList.value.length - 1]);

const daysCount = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  return checkOut.getDate() - checkIn.getDate();
};

const handelCancelOrder = async (id, token) => {
  const result = await orderApi.cancelOrder(id, token);
  if (result) {
    $showAlert({
      title: "已取消訂單",
      icon: "success",
    });
  }
};

</script>

<template>
  <div class="row gap-6 gap-md-0">
    <div class="col-12 col-md-7">
      <p class="text-light" v-if="orderList.length < 1">目前尚無訂單資料</p>
      <div v-else
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
        style="max-width: 730px"
      >
        <div>
          <p class="mb-2 text-neutral-80 fs-8 fs-md-7 fw-medium">
            預訂參考編號： {{ lastOrder._id }}
          </p>
          <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">
            即將來的行程
          </h2>
        </div>

        <img
          class="img-fluid rounded-3"
          src="@/assets/images/room-a-1.png"
          alt="room-a"
        />

        <section class="d-flex flex-column gap-6">
          <h3
            class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold"
          >
            <p class="mb-0">
              {{ lastOrder.roomId.name }}，{{
                daysCount(lastOrder.checkInDate, lastOrder.checkOutDate)
              }}
              晚
            </p>
            <span
              class="d-inline-block mx-4 bg-neutral-80"
              style="width: 1px; height: 18px"
            />
            <p class="mb-0">住宿人數：{{ lastOrder.peopleNum }} 位</p>
          </h3>

          <div class="text-neutral-80 fs-8 fs-md-7 fw-bold">
            <div class="d-flex">
              <p class="title-deco mb-2">入住：</p>
              <p class="mb-2" v-timeFormat="lastOrder.checkInDate"></p>
              <p class="mb-2">，15:00 可入住</p>
            </div>
            <div class="d-flex">
              <p class="title-deco mb-0">退房：</p>
              <p class="mb-0" v-timeFormat="lastOrder.checkOutDate"></p>
              <p class="mb-0">，12:00 前退房</p>
            </div>
          </div>

          <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">
            NT$
            {{
              lastOrder.roomId.price *
                daysCount(lastOrder.checkInDate, lastOrder.checkOutDate) -
              discount *
                daysCount(lastOrder.checkInDate, lastOrder.checkOutDate)
            }}
          </p>
        </section>

        <hr class="my-0 opacity-100 text-neutral-40" />

        <section>
          <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
            房內設備
          </h3>
          <ul
            class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled"
          >
            <li
              class="flex-item d-flex gap-2"
              v-for="(info, index) in lastOrder.roomId.facilityInfo"
              :key="index"
            >
              <Icon
                class="fs-5 text-primary-100"
                icon="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">{{ info.title }}</p>
            </li>
          </ul>
        </section>

        <section>
          <h3 class="title-deco mb-6 text-neutral-100 fs-8 fs-md-7 fw-bold">
            備品提供
          </h3>
          <ul
            class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 border border-neutral-40 rounded-3 list-unstyled"
          >
            <li
              class="flex-item d-flex gap-2"
              v-for="(info, index) in lastOrder.roomId.amenityInfo"
              :key="index"
            >
              <Icon
                class="fs-5 text-primary-100"
                icon="material-symbols:check"
              />
              <p class="mb-0 text-neutral-80 fw-bold">{{ info.title }}</p>
            </li>
          </ul>
        </section>

        <div class="d-flex gap-4">
          <button
            data-bs-toggle="modal"
            data-bs-target="#cancelModal"
            class="btn btn-outline-primary-100 w-50 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            type="button"
          >
            取消預訂
          </button>
          <NuxtLink
            :to="`/rooms/${lastOrder.roomId._id}`"
            class="btn btn-primary-100 text-neutral-0 w-50 py-4 fw-bold"
            type="button"
          >
            查看詳情
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-5">
      <p class="text-light" v-if="orderList.length <= 1">目前尚無歷史訂單</p>
      <div v-else
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-4 p-md-10 bg-neutral-0"
      >
        <h2 class="mb-0 text-neutral-100 fs-7 fs-md-5 fw-bold">歷史訂單</h2>

        <div
          class="d-flex flex-column flex-lg-row gap-6"
          v-for="order in historyList"
          :key="order._id"
        >
          <img
            class="img-fluid object-fit-cover rounded-3"
            style="max-width: 120px; height: 80px"
            :src="order.roomId.imageUrl"
            :alt="order.roomId.name"
          />
          <section class="d-flex flex-column gap-4">
            <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
              預訂參考編號： <small>{{ order._id }}</small>
            </p>

            <h3
              class="d-flex align-items-center mb-0 text-neutral-80 fs-8 fs-md-6 fw-bold"
            >
              尊爵雙人房
            </h3>

            <div class="text-neutral-80 fw-medium">
              <p class="mb-2">住宿天數：{{ daysCount(order.checkInDate, order.checkOutDate) }} 晚</p>
              <p class="mb-0">住宿人數：{{ order.peopleNum }} 位</p>
            </div>

            <div class="text-neutral-80 fs-8 fs-md-7 fw-medium">
              <div class="d-flex">
                <p class="title-deco mb-2">入住：</p>
                <p class="mb-2" v-timeFormat="order.checkInDate"></p>
                <p class="mb-2">，15:00 可入住</p>
              </div>
              <div class="d-flex">
                <p class="title-deco mb-0">退房：</p>
                <p class="mb-0" v-timeFormat="order.checkOutDate"></p>
                <p class="mb-0">，12:00 前退房</p>
              </div>
            </div>
            <p class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-bold">NT$ {{
              lastOrder.roomId.price *
                daysCount(order.checkInDate, order.checkOutDate) -
              discount *
                daysCount(order.checkInDate, order.checkOutDate)
            }}</p>
          </section>
        </div>

        <button
          class="btn btn-outline-primary-100 py-4 fw-bold"
          style="--bs-btn-hover-color: #fff"
          type="button"
          @click="showFullList = !showFullList"
        >
          查看更多
        </button>
      </div>
    </div>
  </div>

  <div id="cancelModal" class="modal fade" tabindex="-1">
    <div
      class="modal-dialog modal-dialog-centered align-items-end align-items-md-center m-0 mx-md-auto h-100"
    >
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div
          class="modal-body mx-auto my-10 my-md-15 text-neutral-80 fs-8 fs-md-6 fw-bold"
        >
          確定要取消此房型的預訂嗎？
        </div>
        <div class="modal-footer d-flex gap-4">
          <button
            type="button"
            class="btn btn-outline-primary-100 flex-grow-1 m-0 py-4 fw-bold"
            style="--bs-btn-hover-color: #fff"
            data-bs-dismiss="modal"
          >
            關閉視窗
          </button>
          <button
            type="button"
            class="btn btn-primary-100 flex-grow-1 m-0 py-4 text-white fw-bold"
            @click="handelCancelOrder(lastOrder._id, getUserCookie)"
            data-bs-dismiss="modal"
          >
            確定取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px,
);

.rounded-3xl {
  border-radius: 1.25rem;
}

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  --color: #bf9d7d;
  content: "";
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: var(--color);
  border-radius: 10px;
  margin-right: 0.75rem;
}

.title-deco:nth-child(2)::before {
  --color: #909090;
}

.flex-item {
  max-width: 97px;
  width: 100%;
  white-space: nowrap;
}

.modal {
  backdrop-filter: blur(10px);

  @include media-breakpoint-down(md) {
    backdrop-filter: none;
  }
}

.modal-header {
  @include media-breakpoint-down(md) {
    border-bottom: 0 !important;
  }
}

.modal-content {
  @include media-breakpoint-down(md) {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
}
</style>
