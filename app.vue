<script setup lang="ts">
import { useWeddingStore } from "~/stores/wedding";
import FlowerPetals from "~/components/WebGL/FlowerPetals.vue";

const weddingStore = useWeddingStore();
await weddingStore.fetchWeddingData();
</script>

<template>
  <div class="app-container app-surface">
    <client-only>
      <FlowerPetals />
    </client-only>
    <main class="content-wrapper">
      <NuxtPage />
    </main>
  </div>
</template>

<style>
.app-container {
  position: relative;
  min-height: 100dvh;
}

.content-wrapper {
  position: relative;
  z-index: 1; /* 콘텐츠가 WebGL 배경 위에 오도록 고정 */
  background-color: transparent;
}
</style>
