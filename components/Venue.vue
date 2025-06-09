<template>
  <div class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-display text-center text-gray-900 mb-12">
        Location
      </h2>
      <div class="text-center mb-8">
        <p class="text-2xl font-semibold">{{ store.venue?.name }}</p>
        <p class="text-gray-600 mt-2">{{ store.venue?.address }}</p>
      </div>
      <div class="w-full h-80 bg-gray-300 rounded-lg shadow-md mb-8">
        <!-- TODO: 맵 추가 -->
        <img
          :src="`https://via.placeholder.com/800x400.png?text=Map+to+${store.venue?.name}`"
          alt="Map to wedding venue"
          class="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div class="text-left max-w-lg mx-auto">
        <h3 class="text-xl font-semibold mb-4">교통편 안내</h3>
        <div
          v-for="(transport, index) in store.venue?.transportations"
          :key="index"
          class="mb-2"
        >
          <p>
            <strong>{{ transport.type }}:</strong> {{ transport.details }}
          </p>
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
