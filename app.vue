<script setup lang="ts">
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import FlowerPetals from "~/components/WebGL/FlowerPetals.vue";
import { useWeddingStore } from "~/stores/wedding";

const { appStyles } = useEmotionStyles();
const weddingStore = useWeddingStore();
await weddingStore.fetchWeddingData();
</script>

<template>
  <div :class="appStyles.container">
    <client-only>
      <FlowerPetals />
    </client-only>
    <main :class="appStyles.contentWrapper">
      <NuxtPage />
    </main>
  </div>
</template>
