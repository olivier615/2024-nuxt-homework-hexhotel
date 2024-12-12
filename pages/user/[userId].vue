<script setup>
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <NuxtLayout name="user">
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped lang="scss"></style>
