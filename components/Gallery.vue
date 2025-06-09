<template>
  <div class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-display text-center text-gray-900 mb-12">
        Our Gallery
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="(image, index) in store.galleryImages" :key="index">
          <img
            :src="image.src"
            :alt="image.alt"
            class="w-full h-full object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWeddingStore } from "~/stores/wedding";
const store = useWeddingStore();
</script>

<style scoped>
.font-display {
  font-family: "Dancing Script", cursive;
}
</style>
