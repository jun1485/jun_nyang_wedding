<script setup lang="ts">
import { useWeddingStore } from "~/stores/wedding";
import FlowerPetals from "~/components/WebGL/FlowerPetals.vue";

const weddingStore = useWeddingStore();
await weddingStore.fetchWeddingData();
</script>

<template>
  <div class="app-container">
    <client-only>
      <FlowerPetals />
    </client-only>
    <main class="content-wrapper">
      <NuxtPage />
    </main>
  </div>
</template>

<style>
/* 기본 폰트 및 배경 설정 */
body {
  font-family: "Pretendard", sans-serif;
  background-color: #fff;
  color: #333;
}

.app-container {
  position: relative;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  background-color: transparent; /* 콘텐츠 배경을 투명하게 하여 WebGL 캔버스가 보이도록 함 */
}
</style>
