export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('timeFormat', (el, binding) => {
    const time = new Date(binding.value);
    const dayIndex = time.getDay();
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const month = time.getMonth();
    const date = time.getDate();
    el.innerHTML = `${month + 1} 月 ${date} 日${weekDays[dayIndex]}`;
  })
});
