<template>
  <div class="py-16 bg-white bg-opacity-75 text-gray-800">
    <div class="container mx-auto text-center px-4">
      <h2 class="text-4xl font-display text-gray-900 mb-8">초대합니다</h2>
      <p class="max-w-3xl mx-auto text-lg leading-relaxed">
        <span v-for="(line, index) in store.invitationMessage" :key="index">
          {{ line }}<br />
        </span>
      </p>
      <div class="mt-12 border-t border-gray-300 pt-8 max-w-sm mx-auto">
        <div class="flex justify-around text-xl">
          <div>
            <p class="font-semibold">{{ store.groom?.name }}</p>
          </div>
          <p>·</p>
          <div>
            <p class="font-semibold">{{ store.bride?.name }}</p>
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
