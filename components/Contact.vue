<template>
  <div class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-4xl font-display text-gray-900 mb-12">Contact Us</h2>
      <div class="grid md:grid-cols-2 gap-12">
        <div class="text-left">
          <h3 class="text-2xl font-semibold mb-6">신랑 측</h3>
          <div class="space-y-4">
            <p>
              <strong>신랑 {{ store.groom?.name }}:</strong>
              <a
                :href="`tel:${store.groom?.tel}`"
                class="text-blue-600 hover:underline"
                >📞</a
              >
            </p>
            <div v-for="parent in store.groom?.parents" :key="parent.name">
              <p>
                <strong>{{ parent.role }} {{ parent.name }}:</strong>
                <a
                  :href="`tel:${parent.tel}`"
                  class="text-blue-600 hover:underline"
                  >📞</a
                >
              </p>
            </div>
          </div>
        </div>
        <div class="text-left">
          <h3 class="text-2xl font-semibold mb-6">신부 측</h3>
          <div class="space-y-4">
            <p>
              <strong>신부 {{ store.bride?.name }}:</strong>
              <a
                :href="`tel:${store.bride?.tel}`"
                class="text-pink-500 hover:underline"
                >📞</a
              >
            </p>
            <div v-for="parent in store.bride?.parents" :key="parent.name">
              <p>
                <strong>{{ parent.role }} {{ parent.name }}:</strong>
                <a
                  :href="`tel:${parent.tel}`"
                  class="text-pink-500 hover:underline"
                  >📞</a
                >
              </p>
            </div>
          </div>
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
