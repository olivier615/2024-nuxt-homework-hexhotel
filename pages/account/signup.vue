<script setup>
import { Icon } from "@iconify/vue";
import { accountApi } from "~/apis/account";
import zipCodeList from "~/assets/zipCode";
const { $showAlert } = useNuxtApp();

const route = useRoute()
const router = useRouter()
const isEmailAndPasswordValid = ref(false);
const password = ref("");
const city = ref("臺北市");
const agreement = ref(false);
const districts = ref([]);
watch(city, (newCity) => {
  const selectedCity = zipCodeList.find((item) => item.name === newCity);
  districts.value = selectedCity ? selectedCity.districts : [];
});

const step1OnSubmit = async (value = {}, { resetForm }) => {
  const isEmailExists = await accountApi.verifyEmail(value.email);
  if (isEmailExists) {
    $showAlert({
      title: "此信箱已有註冊",
      icon: "info",
      text: "請使用其他信箱註冊",
    });
    return;
  }
  accountData.value = {
    email: value.email,
    password: value.password,
  };
  isEmailAndPasswordValid.value = true;
};

const step2OnSubmit = async (value = {}, { resetForm }) => {
  if (!agreement.value) {
    $showAlert({
      title: "請勾選同意本網站個資使用規範",
      icon: "info",
      text: "",
    });
    return;
  }
  const { email, password } = accountData.value
  const signupData = {
    name: value.name,
    email,
    password,
    phone: value.phone,
    birthday: `${value.birthYear}/${value.birthMonth}/${value.birthDay}`,
    address: {
      zipcode: value.zipcode,
      detail: value.address,
    },
  };
  const response = await accountApi.createNewAccount(signupData)
  if (response.status) {
    $showAlert({
        title: "註冊成功",
        icon: "success",
        text: '您已完成註冊，即將回到首頁',
      });
    router.push("/")
  }
};

const accountData = ref({
  email: "",
  password: "",
});
</script>

<template>
  <div class="p-5 px-md-0 py-md-30">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="mb-4 text-neutral-0 fw-bold">立即註冊</h1>

      <div class="d-flex align-items-center py-4 gap-2">
        <div class="d-flex flex-column align-items-center gap-1 text-neutral-0">
          <span
            :class="{ 'd-none': isEmailAndPasswordValid }"
            class="step p-2 bg-primary-100 rounded-circle"
            >1</span
          >
          <Icon
            :class="{ 'd-none': !isEmailAndPasswordValid }"
            class="p-2 fs-3 bg-primary-100 rounded-circle"
            icon="material-symbols:check"
          />
          <p class="mb-0 fs-8 fs-md-7 fw-bold">輸入信箱及密碼</p>
        </div>

        <hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100" />

        <div
          :class="{
            'text-neutral-0': isEmailAndPasswordValid,
            'text-neutral-60': !isEmailAndPasswordValid,
          }"
          class="d-flex flex-column align-items-center gap-1"
        >
          <span
            :class="{
              'bg-primary-100': isEmailAndPasswordValid,
              'bg-transparent border border-neutral-60':
                !isEmailAndPasswordValid,
            }"
            class="step p-2 rounded-circle"
            >2</span
          >
          <p class="mb-0 fs-8 fs-md-7 fw-bold">填寫基本資料</p>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <VForm
        @submit="step1OnSubmit"
        v-slot="{ errors }"
        :class="{ 'd-none': isEmailAndPasswordValid }"
        class="mb-4"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="email">
            電子信箱
          </label>
          <VField
            id="email"
            name="email"
            type="email"
            rules="required|email"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors['email'] }"
            placeholder="hello@exsample.com"
          />
          <VErrorMessage name="email" class="invalid-feedback" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="password">
            密碼
          </label>
          <VField
            id="password"
            name="password"
            type="password"
            rules="required|password"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors['password'] }"
            placeholder="請輸入密碼"
            v-model="password"
          />
          <VErrorMessage name="password" class="invalid-feedback" />
        </div>
        <div class="mb-10 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="confirmPassword">
            確認密碼
          </label>
          <VField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            :rules="`required|confirmPassword:${password}`"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
            :class="{ 'is-invalid': errors['confirmPassword'] }"
            placeholder="請再輸入一次密碼"
          />
          <VErrorMessage name="confirmPassword" class="invalid-feedback" />
        </div>
        <button
          class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold"
          type="submit"
        >
          下一步
        </button>
      </VForm>
      <VForm
        @submit="step2OnSubmit"
        v-slot="{ errors }"
        :class="{ 'd-none': !isEmailAndPasswordValid }"
        class="mb-4"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="name"> 姓名 </label>
          <VField
            id="name"
            name="name"
            type="text"
            rules="required|name"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 rounded-3"
            :class="{ 'is-invalid': errors['name'] }"
            placeholder="請輸入姓名"
          />
          <VErrorMessage name="name" class="invalid-feedback" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="phone">
            手機號碼
          </label>
          <VField
            id="phone"
            name="phone"
            type="tel"
            rules="required|phone"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40 rounded-3"
            :class="{ 'is-invalid': errors['phone'] }"
            placeholder="請輸入手機號碼"
          />
          <VErrorMessage name="phone" class="invalid-feedback" />
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="mb-2 text-neutral-0 fw-bold" for="birth"> 生日 </label>
          <div class="d-flex gap-2">
            <VField
              as="select"
              name="birthYear"
              rules="required"
              id="birthYear"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              :class="{ 'is-invalid': errors['birthYear'] }"
            >
              <option
                v-for="year in 65"
                :key="year"
                :value=" year + 1947 "
              >
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
            >
              <option v-for="day in 30" :key="day" :value="day">
                {{ day }} 日
              </option>
            </VField>
            <VErrorMessage name="birthDay" class="invalid-feedback" />
          </div>
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label class="form-label text-neutral-0 fw-bold" for="address">
            地址
          </label>
          <div>
            <div class="d-flex gap-2 mb-2">
              <select
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                v-model="city"
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
            />
            <VErrorMessage name="address" class="invalid-feedback" />
          </div>
        </div>

        <div
          class="form-check d-flex align-items-end gap-2 mb-10 text-neutral-0"
        >
          <input
            id="agreementCheck"
            class="form-check-input"
            type="checkbox"
            v-model="agreement"
          />
          <label class="form-check-label fw-bold" for="agreementCheck">
            我已閱讀並同意本網站個資使用規範
          </label>
        </div>
        <button
          class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
          type="submit"
        >
          完成註冊
        </button>
      </VForm>
    </div>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">已經有會員了嗎？</span>
      <NuxtLink
        to="/account/login"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>立即登入</span>
      </NuxtLink>
    </p>
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

input[type="password"] {
  font: small-caption;
  font-size: 1.5rem;
}

input::placeholder {
  color: #909090;
  font-size: 1rem;
  font-weight: 500;

  @include media-breakpoint-down(md) {
    font-size: 14px;
  }
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
}

.form-check-input:checked {
  background-color: #bf9d7d;
  border-color: #bf9d7d;
}

.step {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}
</style>
