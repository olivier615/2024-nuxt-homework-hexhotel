<script setup>
import { accountApi } from "~/apis/account";
import zipCodeList from "~/assets/zipCode";

const { $showAlert } = useNuxtApp();

const isEditPassword = ref(false);
const isEditProfile = ref(false);

const getUserCookie = useCookie("auth");
const token = ref(getUserCookie.value);
const userStore = useUserStore();

const password = ref("");
const editingUserData = ref({});

const selectCity = ref("臺北市");
const districts = ref([]);
const selectDistrict = ref([]);
const addressDetail = ref("");
const userBirthday = ref({
  year: "",
  month: "",
  day: "",
});
watch(selectCity, (newCity) => {
  const selectedCity = zipCodeList.find((item) => item.name === newCity);
  districts.value = selectedCity ? selectedCity.districts : [];
});

const handleChangePassword = async (value = {}, { resetForm }) => {
  const { newPassword, oldPassword } = value;
  const { _id } = editingUserData.value;
  const newData = {
    userId: _id,
    newPassword,
    oldPassword,
  };
  const result = await accountApi.changeUserData(newData, token);
  if (result?.status) {
    $showAlert({
      title: "資料更新成功",
      icon: "success",
    });
    resetForm();
    isEditPassword.value = false;
  } else {
    $showAlert({
      title: "資料更新失敗",
      icon: "info",
    });
  }
};

const getUserInfo = async () => {
  if (token.value !== undefined) {
    const userData = await accountApi.getUserData(token.value);
    editingUserData.value = userData.result;
    addressDetail.value = userData.result.address.detail;
    const date = new Date(userData.result.birthday);
    userBirthday.value = {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
    };
  }
  zipCodeList.forEach((city) => {
    city.districts.forEach((district) => {
      if (district.zip == editingUserData.value.address.zipcode) {
        selectCity.value = city.name;
        selectDistrict.value = district;
      }
    });
  });
};

const submitEditProfile = async (value = {}, { resetForm }) => {
  const { _id } = editingUserData.value
  const newData = {
  "userId": _id,
  "name": value.name,
  "phone": value.phone,
  "birthday": `${value.birthYear}/${value.birthMonth}/${value.birthDay}`,
  "address": {
    "zipcode": value.zipcode,
    "detail": value.address
  }
}
const result = await accountApi.changeUserData(newData, token)
if (result?.status) {
    $showAlert({
      title: "資料更新成功",
      icon: "success",
    });
    resetForm();
    getUserInfo()
    isEditProfile.value = false;
  } else {
    $showAlert({
      title: "資料更新失敗",
      icon: "info",
    });
  }
}

onMounted(() => {
  getUserInfo();
});
</script>

<template>
  <div class="row gap-6 gap-md-0">
    <div class="col-12 col-md-5">
      <section
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0"
      >
        <h2 class="fs-6 fs-md-5 fw-bold">修改密碼</h2>
        <div class="d-flex flex-column gap-4 gap-md-6">
          <div class="fs-8 fs-md-7">
            <p class="mb-2 text-neutral-80 fw-medium">電子信箱</p>
            <span
              class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
              >{{ userStore.userData.email }}</span
            >
          </div>

          <div
            class="d-flex justify-content-between align-items-center"
            :class="{ 'd-none': isEditPassword }"
          >
            <div>
              <label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                密碼
              </label>
              <input
                class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0"
                type="password"
                value="**********"
              />
            </div>

            <button
              class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
              type="button"
              @click="isEditPassword = !isEditPassword"
            >
              重設
            </button>
          </div>

          <VForm
            v-slot="{ errors }"
            @submit="handleChangePassword"
            class="d-flex flex-column gap-4 gap-md-6"
            :class="{ 'd-none': !isEditPassword }"
          >
            <div>
              <label for="oldPassword" class="form-label fs-8 fs-md-7 fw-bold"
                >舊密碼</label
              >
              <VField
                id="oldPassword"
                name="oldPassword"
                rules="required"
                type="password"
                class="form-control p-4 fs-7 rounded-3"
                placeholder="請輸入舊密碼"
                :class="{ 'is-invalid': errors['oldPassword'] }"
              />
              <VErrorMessage name="oldPassword" class="invalid-feedback" />
            </div>

            <div>
              <label for="newPassword" class="form-label fs-8 fs-md-7 fw-bold"
                >新密碼</label
              >
              <VField
                id="newPassword"
                name="newPassword"
                type="password"
                rules="required|password"
                class="form-control p-4 fs-7 rounded-3"
                :class="{ 'is-invalid': errors['newPassword'] }"
                placeholder="請輸入新密碼"
                v-model="password"
              />
              <VErrorMessage name="newPassword" class="invalid-feedback" />
            </div>

            <div>
              <label
                for="confirmPassword"
                class="form-label fs-8 fs-md-7 fw-bold"
                >確認新密碼</label
              >
              <VField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                :rules="`required|confirmPassword:${password}`"
                class="form-control p-4 fs-7 rounded-3"
                :class="{ 'is-invalid': errors['confirmPassword'] }"
                placeholder="請再輸入一次新密碼"
              />
              <VErrorMessage name="confirmPassword" class="invalid-feedback" />
            </div>
            <button
              :class="{ 'd-none': !isEditPassword }"
              class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
              type="submit"
            >
              儲存設定
            </button>
          </VForm>
        </div>
      </section>
    </div>

    <div class="col-12 col-md-7">
      <section
        class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0"
      >
        <h2 class="fs-6 fs-md-5 fw-bold">基本資料</h2>
        <VForm
          @submit="submitEditProfile"
          v-slot="{ errors }"
          class="d-flex flex-column gap-4 gap-md-6"
        >
          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{
                'fw-bold text-neutral-100': isEditProfile,
                'fw-medium text-neutral-80': !isEditProfile,
              }"
              for="name"
            >
              姓名
            </label>
            <VField
              id="name"
              name="name"
              rules="required|name"
              class="form-control text-neutral-100 fw-bold"
              :class="{
                'pe-none p-0 border-0': !isEditProfile,
                'p-4': isEditProfile,
                'is-invalid': errors['name']
              }"
              type="text"
              v-model="editingUserData.name"
            />
            <VErrorMessage name="name" class="invalid-feedback" />
          </div>

          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{
                'fw-bold text-neutral-100': isEditProfile,
                'fw-medium text-neutral-80': !isEditProfile,
              }"
              for="phone"
            >
              手機號碼
            </label>
            <VField
              id="phone"
              name="phone"
              rules="required|phone"
              class="form-control text-neutral-100 fw-bold"
              :class="{
                'pe-none p-0 border-0': !isEditProfile,
                'p-4': isEditProfile,
                'is-invalid': errors['phone']
              }"
              type="tel"
              v-model="editingUserData.phone"
            />
            <VErrorMessage name="phone" class="invalid-feedback" />
          </div>

          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{
                'fw-bold text-neutral-100': isEditProfile,
                'fw-medium text-neutral-80': !isEditProfile,
              }"
              for="birth"
            >
              生日
            </label>
            <span
              class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
              :class="{ 'd-none': isEditProfile }"
              >{{ userBirthday.year }} 年 {{ userBirthday.month }} 月
              {{ userBirthday.year }} 日</span
            >
            <div class="d-flex gap-2" :class="{ 'd-none': !isEditProfile }">
              <VField
                as="select"
                name="birthYear"
                rules="required"
                id="birthYear"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                :class="{ 'is-invalid': errors['birthYear'] }"
                v-model="userBirthday.year"
              >
                <option v-for="year in 65" :key="year" :value="year + 1947">
                  {{ year + 1947 }} 年
                </option>
              </VField>
              <VErrorMessage name="birthYear" class="invalid-feedback" />
              <VField
              as="select"
              id="birthMonth"
              name="birthMonth"
              rules="required"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              :class="{ 'is-invalid': errors['birthMonth'] }"
              v-model="userBirthday.month"
              >
                <option v-for="month in 12" :key="month" :value="month">
                  {{ month }} 月
                </option>
              </VField>
              <VErrorMessage name="birthMonth" class="invalid-feedback" />
              <VField
              as="select"
              id="birthDay"
              name="birthDay"
              rules="required"
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                :class="{ 'is-invalid': errors['birthDay'] }"
                v-model="userBirthday.day"
              >
                <option v-for="day in 30" :key="day" :value="day">
                  {{ day }} 日
                </option>
              </VField>
              <VErrorMessage name="birthDay" class="invalid-feedback" />
            </div>
          </div>

          <div class="fs-8 fs-md-7">
            <label
              class="form-label"
              :class="{
                'fw-bold text-neutral-100': isEditProfile,
                'fw-medium text-neutral-80': !isEditProfile,
              }"
              for="address"
            >
              地址
            </label>
            <span
              class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
              :class="{ 'd-none': isEditProfile }"
              >{{ selectCity }}{{ selectDistrict.name }}{{
              }}{{ editingUserData.address?.detail }}</span
            >
            <div :class="{ 'd-none': !isEditProfile }">
              <div class="d-flex gap-2 mb-2">
                <select
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
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
                as="select"
                id="zipcode"
                name="zipcode"
                rules="required"
                  class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                  :class="{ 'is-invalid': errors['zipcode'] }"
                  v-model="selectDistrict.zip"
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
                class="form-control p-4 rounded-3"
                :class="{ 'is-invalid': errors['address'] }"
                placeholder="請輸入詳細地址"
                v-model="addressDetail"
              />
              <VErrorMessage name="address" class="invalid-feedback" />
            </div>
          </div>
          <button
            :class="{ 'd-none': !isEditProfile }"
            class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3"
            type="submit"
          >
            儲存設定
          </button>
        </VForm>
        <button
          :class="{ 'd-none': isEditProfile }"
          class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3"
          type="button"
          @click="isEditProfile = !isEditProfile"
        >
          編輯
        </button>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rounded-3xl {
  border-radius: 1.25rem;
}

input[type="password"] {
  font: small-caption;
}

.form-control::placeholder {
  --neutral-60: #909090;
  color: var(--neutral-60);
  font-weight: 500;
}
</style>
