<template>
  <section class="section-wrap">
    <div
      class="section-card relative overflow-hidden px-5 py-9 text-center sm:px-12 sm:py-14"
    >
      <div class="invite-deco invite-deco-left" aria-hidden="true"></div>
      <div class="invite-deco invite-deco-right" aria-hidden="true"></div>

      <span class="floral-chip">Invitation</span>
      <h2 class="section-title mt-4 text-3xl sm:text-4xl">초대합니다</h2>

      <p class="mt-7 text-[0.98rem] leading-8 sm:text-lg sm:leading-9 korean-body">
        <span
          v-for="(line, index) in store.invitationMessage ?? []"
          :key="index"
          class="block"
        >
          {{ line }}
        </span>
      </p>

      <div class="mx-auto mt-9 max-w-md border-t border-rose-200/70 pt-6">
        <div class="flex items-center justify-center gap-3 text-lg sm:text-xl">
          <p class="font-semibold">{{ store.groom?.name }}</p>
          <p class="text-rose-500">♥</p>
          <p class="font-semibold">{{ store.bride?.name }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useWeddingStore } from "~/stores/wedding";
const store = useWeddingStore();
</script>

<style scoped>
.korean-body {
  font-family: "Gaegu", sans-serif;
  font-weight: 400;
  color: #4f3b46;
}

.invite-deco {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 9999px;
  pointer-events: none;
  opacity: 0.72;
}

.invite-deco-left {
  top: -120px;
  left: -110px;
  background: radial-gradient(
    circle,
    rgba(255, 210, 224, 0.52) 0%,
    rgba(255, 210, 224, 0) 70%
  );
}

.invite-deco-right {
  right: -110px;
  bottom: -130px;
  background: radial-gradient(
    circle,
    rgba(255, 231, 202, 0.52) 0%,
    rgba(255, 231, 202, 0) 70%
  );
}
</style>
