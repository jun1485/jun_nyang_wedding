<template>
  <section class="section-wrap pt-1 sm:pt-2">
    <div class="text-center">
      <span class="floral-chip">Gallery</span>
      <h2 class="section-title mt-4 text-3xl sm:text-4xl">우리의 순간</h2>
      <p class="section-subtitle mt-2">사진을 누르면 크게 볼 수 있어요</p>
    </div>

    <div class="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      <button
        v-for="(image, index) in store.galleryImages"
        :key="index"
        type="button"
        class="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-rose-100 bg-white/75 shadow-md outline-none"
        @click="openLightbox(index)"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-300 group-active:scale-[1.02] sm:group-hover:scale-105"
        />
        <div
          class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2 text-left text-xs text-white"
        >
          {{ index + 1 }}번째 추억
        </div>
      </button>
    </div>

    <div
      v-if="isLightboxOpen"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-[#1e1018]/95 p-2 sm:p-4"
      @click.self="closeLightbox"
    >
      <button
        type="button"
        class="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-[71] flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm"
        @click="closeLightbox"
        aria-label="닫기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="h-5 w-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div
        class="relative flex h-full w-full select-none items-center justify-center overflow-hidden rounded-2xl"
        @touchstart="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
      >
        <img
          v-if="currentImage"
          :src="currentImage.src"
          :alt="currentImage.alt"
          class="max-h-[84svh] max-w-[92vw] object-contain transition-transform duration-200"
          :style="{
            transform: `translateX(${dragOffsetX}px) scale(${zoomScale})`,
          }"
          @dblclick="toggleZoom"
        />
      </div>

      <button
        v-if="hasPrev"
        type="button"
        class="absolute left-2 top-1/2 z-[71] -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm sm:left-4"
        @click.stop="prevImage"
        aria-label="이전"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="h-5 w-5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        v-if="hasNext"
        type="button"
        class="absolute right-2 top-1/2 z-[71] -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm sm:right-4"
        @click.stop="nextImage"
        aria-label="다음"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="h-5 w-5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        class="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-[71] -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur-sm"
      >
        {{ (selectedIndex ?? 0) + 1 }} / {{ totalImages }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useWeddingStore } from "~/stores/wedding";

const store = useWeddingStore();

const isLightboxOpen = ref(false);
const selectedIndex = ref<number | null>(null);
const zoomScale = ref(1);
const dragOffsetX = ref(0);
const touchStartX = ref(0);
const touchStartY = ref(0);

const images = computed(() => store.galleryImages);
const totalImages = computed(() => images.value?.length ?? 0);
const currentImage = computed(() =>
  selectedIndex.value != null ? images.value[selectedIndex.value] : null
);
const hasPrev = computed(() => (selectedIndex.value ?? 0) > 0);
const hasNext = computed(
  () =>
    selectedIndex.value != null && selectedIndex.value < totalImages.value - 1
);

function openLightbox(index: number) {
  if (!images.value || images.value.length === 0) return;
  selectedIndex.value = index;
  isLightboxOpen.value = true;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  isLightboxOpen.value = false;
  selectedIndex.value = null;
  dragOffsetX.value = 0;
  zoomScale.value = 1;
  document.body.style.overflow = "";
}

function prevImage() {
  if (hasPrev.value && selectedIndex.value != null) {
    selectedIndex.value -= 1;
    dragOffsetX.value = 0;
    zoomScale.value = 1;
  }
}

function nextImage() {
  if (hasNext.value && selectedIndex.value != null) {
    selectedIndex.value += 1;
    dragOffsetX.value = 0;
    zoomScale.value = 1;
  }
}

function toggleZoom() {
  zoomScale.value = zoomScale.value === 1 ? 2 : 1;
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return;
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
  dragOffsetX.value = 0;
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length !== 1) return;
  const dx = e.touches[0].clientX - touchStartX.value;
  const dy = e.touches[0].clientY - touchStartY.value;
  if (Math.abs(dy) > Math.abs(dx)) return;
  dragOffsetX.value = dx;
}

function onTouchEnd() {
  if (zoomScale.value > 1) {
    dragOffsetX.value = 0;
    return;
  }

  const threshold = 55;
  if (dragOffsetX.value > threshold) {
    prevImage();
  } else if (dragOffsetX.value < -threshold) {
    nextImage();
  }
  dragOffsetX.value = 0;
}

function onKeydown(e: KeyboardEvent) {
  if (!isLightboxOpen.value) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "ArrowRight") nextImage();
}

onMounted(async () => {
  await store.fetchWeddingData();
  await store.fetchGallery();
  window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  document.body.style.overflow = "";
});
</script>
