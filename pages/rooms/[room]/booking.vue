<script setup lang="ts">
import { Icon } from "@iconify/vue";
import zipCodeList from "~/assets/zipCode";
import { roomsApi } from "~/apis/rooms";
import { orderApi } from "~/apis/order";

const { $showAlert } = useNuxtApp();

const route = useRoute();
const roomId = route.params.room;

const roomInfo = ref({});
roomInfo.value = await roomsApi.getRoomDetail(roomId);

const getUserCookie = useCookie("auth");
const token = ref(getUserCookie.value);

const router = useRouter();
const orderStore = useOrderStore();
console.log(orderStore.orderRoomInfo)
const userStore = useUserStore();

const selectCity = ref("");
const districts = ref([]);
const selectDistrict = ref([]);
watch(selectCity, (newCity) => {
  const selectedCity = zipCodeList.find((item) => item.name === newCity);
  districts.value = selectedCity ? selectedCity.districts : [];
});

function goBack() {
  router.back();
}
const isLoading = ref(false);

function confirmBooking(id) {
  isLoading.value = true;

  setTimeout(() => {
    isLoading.value = false;
    router.push({
      name: "booking-confirmation",
      params: {
        bookingId: id,
      },
    });
  }, 1500);
}

const discount = ref(1000);

onMounted(() => {
  selectCity.value = "臺北市";
});

const userBookingData = ref({
  name: "",
  phone: "",
  email: "",
  address: {
    zipcode: "",
    detail: "",
  },
});

const putUserData = () => {
  console.log(userStore.userData);
  const { name, phone, email, address } = userStore.userData;
  userBookingData.value = {
    name,
    phone,
    email,
    address: {
      zipcode: address.zipcode,
      detail: address.detail,
    },
  };
  zipCodeList.forEach((city) => {
    city.districts.forEach((district) => {
      if (district.zip == userStore.userData.address.zipcode) {
        selectCity.value = city.name;
        selectDistrict.value = district;
      }
    });
  });
  $showAlert({
    title: "已套用會員資料",
    icon: "success",
  });
};

const submitBookingInfo = async (value = {}, { resetForm }) => {
  console.log(value);
  const { address, name, phone, email, zipcode } = value;
  const orderData = {
    roomId: orderStore.orderRoomInfo.roomId,
    checkInDate: orderStore.orderRoomInfo.checkInDate,
    checkOutDate: orderStore.orderRoomInfo.checkOutDate,
    peopleNum: orderStore.orderRoomInfo.peopleNum,
    userInfo: {
      address: {
        zipcode,
        detail: address,
      },
      name,
      phone,
      email,
    },
  };
  const orderResult = await orderApi.postOrder(orderData, token.value);
  
  if (orderResult) {
    confirmBooking(orderResult.result._id)
  }
}

</script>

<template>
  <main class="pt-18 pt-md-30 bg-neutral-120">
    <section class="py-10 py-md-30 bg-primary-10">
      <VForm @submit="submitBookingInfo" v-slot="{ errors }" class="container">
        <button
          class="d-flex align-items-baseline gap-2 mb-10 bg-transparent border-0"
          type="button"
          @click="goBack"
        >
          <Icon class="fs-5 text-neutral-100" icon="mdi:keyboard-arrow-left" />
          <h1 class="mb-0 text-neutral-100 fs-3 fw-bold">確認訂房資訊</h1>
        </button>

        <div class="row gap-10 gap-md-0">
          <div class="col-12 col-md-7">
            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                訂房資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">選擇房型</h3>
                    <p class="mb-0 fw-medium">{{ roomInfo.name }}</p>
                  </div>
                  <NuxtLink
                    class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                    to="/rooms"
                  >
                    編輯
                  </NuxtLink>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">訂房日期</h3>
                    <div class="d-flex">
                      <p>入住:</p>
                      <p
                        class="fw-medium"
                        v-timeFormat="orderStore.orderRoomInfo.checkInDate"
                      ></p>
                    </div>
                    <div class="d-flex mb-0">
                      <p>退房:</p>
                      <p
                        class="fw-medium"
                        v-timeFormat="orderStore.orderRoomInfo.checkOutDate"
                      ></p>
                    </div>
                  </div>
                  <NuxtLink
                    class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                    :to="{
                      name: 'room-detail',
                      params: {
                        room: `${roomId}`,
                      },
                    }"
                  >
                    編輯
                  </NuxtLink>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100"
                >
                  <div>
                    <h3 class="title-deco mb-2 fs-7 fw-bold">房客人數</h3>
                    <p class="mb-0 fw-medium">
                      {{ orderStore.orderRoomInfo.peopleNum }} 人
                    </p>
                  </div>
                  <NuxtLink
                    class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                    :to="{
                      name: 'room-detail',
                      params: {
                        room: `${roomId}`,
                      },
                    }"
                  >
                    編輯
                  </NuxtLink>
                </div>
              </div>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60" />

            <section>
              <div
                class="d-flex justify-content-between align-items-center mb-10"
              >
                <h2 class="mb-0 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  訂房人資訊
                </h2>
                <button
                  class="text-primary-100 bg-transparent border-0 fw-bold text-decoration-underline"
                  type="button"
                  @click="putUserData"
                >
                  套用會員資料
                </button>
              </div>

              <div class="d-flex flex-column gap-6">
                <div class="text-neutral-100">
                  <label for="name" class="form-label fs-8 fs-md-7 fw-bold"
                    >姓名</label
                  >
                  <VField
                    id="name"
                    name="name"
                    type="text"
                    rules="required|name"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    :class="{ 'is-invalid': errors['name'] }"
                    placeholder="請輸入姓名"
                    v-model="userBookingData.name"
                  />
                  <VErrorMessage name="name" class="invalid-feedback" />
                </div>

                <div class="text-neutral-100">
                  <label for="phone" class="form-label fs-8 fs-md-7 fw-bold"
                    >手機號碼</label
                  >
                  <VField
                    id="phone"
                    name="phone"
                    type="tel"
                    rules="required|phone"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    :class="{ 'is-invalid': errors['phone'] }"
                    placeholder="請輸入手機號碼"
                    v-model="userBookingData.phone"
                  />
                  <VErrorMessage name="phone" class="invalid-feedback" />
                </div>

                <div class="text-neutral-100">
                  <label for="email" class="form-label fs-8 fs-md-7 fw-bold"
                    >電子信箱</label
                  >
                  <VField
                    id="email"
                    name="email"
                    type="email"
                    rules="required|email"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    :class="{ 'is-invalid': errors['email'] }"
                    placeholder="請輸入電子信箱"
                    v-model="userBookingData.email"
                  />
                  <VErrorMessage name="email" class="invalid-feedback" />
                </div>

                <div class="text-neutral-100">
                  <label for="address" class="form-label fs-8 fs-md-7 fw-bold"
                    >地址</label
                  >
                  <div class="d-flex gap-2 mb-4">
                    <select
                      class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                      v-model="selectCity"
                    >
                      <option
                        v-for="city in zipCodeList"
                        :value="city.name"
                        :key="city.name"
                      >
                        {{ city.name }}
                      </option>
                    </select>
                    <VField
                      class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                      as="select"
                      id="zipcode"
                      name="zipcode"
                      rules="required"
                      :class="{ 'is-invalid': errors['zipcode'] }"
                      v-model="userBookingData.address.zipcode"
                    >
                      <option
                        v-for="district in districts"
                        :value="district.zip"
                        :key="district.zip"
                      >
                        {{ district.name }}
                      </option>
                    </VField>
                    <VErrorMessage name="zipcode" class="invalid-feedback" />
                  </div>
                  <VField
                    id="address"
                    name="address"
                    type="text"
                    rules="required"
                    class="form-control p-4 fs-8 fs-md-7 rounded-3"
                    :class="{ 'is-invalid': errors['address'] }"
                    placeholder="請輸入詳細地址"
                    v-model="userBookingData.address.detail"
                  />
                  <VErrorMessage name="address" class="invalid-feedback" />
                </div>
              </div>
            </section>

            <hr class="my-10 my-md-12 opacity-100 text-neutral-60" />

            <section>
              <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                房間資訊
              </h2>
              <div class="d-flex flex-column gap-6">
                <section>
                  <h3 class="title-deco mb-4 mb-md-6 fs-7 fs-md-5 fw-bold">
                    房型基本資訊
                  </h3>
                  <ul class="d-flex gap-4 list-unstyled">
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="fluent:slide-size-24-filled"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ roomInfo.areaInfo }}
                      </p>
                    </li>
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="material-symbols:king-bed"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        {{ roomInfo.bedInfo }}
                      </p>
                    </li>
                    <li
                      class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3"
                    >
                      <Icon
                        class="mb-2 fs-5 text-primary-100"
                        icon="ic:baseline-person"
                      />
                      <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                        2-{{ roomInfo.maxPeople }} 人
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    房間格局
                  </h3>
                  <ul
                    class="d-flex flex-wrap gap-6 gap-md-10 p-6 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      class="d-flex gap-2"
                      v-for="(info, index) in roomInfo.layoutInfo"
                      :key="index"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ info.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    房內設備
                  </h3>
                  <ul
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      class="d-flex gap-2"
                      v-for="(info, index) in roomInfo.facilityInfo"
                      :key="index"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ info.title }}
                      </p>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3
                    class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold"
                  >
                    備品提供
                  </h3>
                  <ul
                    class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled"
                  >
                    <li
                      class="d-flex gap-2"
                      v-for="(info, index) in roomInfo.amenityInfo"
                      :key="index"
                    >
                      <Icon
                        class="fs-5 text-primary-100"
                        icon="material-symbols:check"
                      />
                      <p class="mb-0 text-neutral-80 fw-bold">
                        {{ info.title }}
                      </p>
                    </li>
                  </ul>
                </section>
              </div>
            </section>
          </div>

          <div class="col-12 col-md-5">
            <div
              class="confirm-form rounded-3xl d-flex flex-column gap-10 p-6 p-md-10 mx-auto ms-md-auto me-md-0 bg-neutral-0"
            >
              <img
                class="img-fluid rounded-3"
                :src="roomInfo.imageUrl"
                alt="room-a"
              />

              <div>
                <h2 class="mb-6 text-neutral-100 fs-6 fs-md-4 fw-bold">
                  價格詳情
                </h2>
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <div
                    class="d-flex align-items-center text-neutral-100 fw-medium"
                  >
                    <span>NT$ {{ roomInfo.price }}</span>
                    <Icon
                      class="ms-2 me-1 text-neutral-80"
                      icon="material-symbols:close"
                    />
                    <span class="text-neutral-80"
                      >{{ orderStore.orderRoomInfo.daysCount }} 晚</span
                    >
                  </div>
                  <span class="fw-medium">
                    NT$ {{ roomInfo.price * orderStore.orderRoomInfo.daysCount }}
                  </span>
                </div>
                <div
                  class="d-flex justify-content-between align-items-center fw-medium"
                >
                  <p class="d-flex align-items-center mb-0 text-neutral-100">
                    住宿折扣
                  </p>
                  <span class="text-primary-100">
                    -NT$ {{ orderStore.orderRoomInfo.daysCount * discount }}
                  </span>
                </div>
                <hr class="my-6 opacity-100 text-neutral-40" />
                <div
                  class="d-flex justify-content-between align-items-center text-neutral-100 fw-bold"
                >
                  <p class="d-flex align-items-center mb-0">總價</p>
                  <span>
                    NT$
                    {{
                      roomInfo.price * orderStore.orderRoomInfo.daysCount -
                      orderStore.orderRoomInfo.daysCount * discount
                    }}
                  </span>
                </div>
              </div>

              <button
                class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3"
                type="submit"
              >
                確認訂房
              </button>
            </div>
          </div>
        </div>
      </VForm>
    </section>

    <RoomsBookingLoading v-if="isLoading" />
  </main>
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

.title-deco {
  display: flex;
  align-items: center;
}

.title-deco::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: #bf9d7d;
  border-radius: 10px;
  margin-right: 0.75rem;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}

.card-info {
  width: 97px;
  height: 97px;
}

.flex-item {
  flex: 1 1 15%;

  @include media-breakpoint-down(md) {
    flex-basis: 40%;
  }
}

.rounded-3xl {
  border-radius: 1.25rem;
}

.confirm-form {
  position: sticky;
  top: 160px;
  max-width: 478px;

  @include media-breakpoint-down(md) {
    position: static;
    top: 0;
    max-width: auto;
  }
}
</style>
