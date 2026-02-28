<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import { useWeddingStore } from "~/stores/wedding";

const { appStyles } = useEmotionStyles();
const weddingStore = useWeddingStore();
const AsyncFlowerPetals = defineAsyncComponent(
  () => import("~/components/WebGL/FlowerPetals.vue"),
);
await weddingStore.fetchWeddingData();
</script>

<template>
  <div :class="appStyles.container">
    <NuxtPwaManifest />
    <client-only>
      <AsyncFlowerPetals />
    </client-only>
    <main :class="appStyles.contentWrapper">
      <NuxtPage />
    </main>
  </div>
</template>
