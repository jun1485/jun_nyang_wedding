<script setup lang="ts">
import { useWeddingStore } from "~/stores/wedding";

const weddingStore = useWeddingStore();
await weddingStore.fetchWeddingData();
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
