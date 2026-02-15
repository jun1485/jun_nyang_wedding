<template>
  <section :class="[sharedStyles.sectionWrap, galleryStyles.sectionOffset]">
    <div :class="galleryStyles.header">
      <span :class="sharedStyles.floralChip">Gallery</span>
      <h2 :class="[sharedStyles.sectionTitle, galleryStyles.title]">우리의 순간</h2>
      <p :class="[sharedStyles.sectionSubtitle, galleryStyles.subtitle]">사진을 누르면 크게 볼 수 있어요</p>
    </div>

    <div :class="galleryStyles.grid">
      <button
        v-for="(image, index) in store.galleryImages"
        :key="index"
        type="button"
        :class="galleryStyles.thumbButton"
        @click="openLightbox(index)"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          loading="lazy"
          :class="galleryStyles.thumbImage"
        />
        <div :class="galleryStyles.thumbCaption">{{ index + 1 }}번째 추억</div>
      </button>
    </div>

    <div
      v-if="isLightboxOpen"
      :class="galleryStyles.overlay"
      @click.self="closeLightbox"
    >
      <button
        type="button"
        :class="galleryStyles.closeButton"
        @click="closeLightbox"
        aria-label="닫기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          :class="galleryStyles.icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div
        :class="galleryStyles.stage"
        @touchstart="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
      >
        <img
          v-if="currentImage"
          ref="lightboxImage"
          :key="currentImageKey"
          :src="currentImage.src"
          :alt="currentImage.alt"
          :class="[galleryStyles.lightboxImage, currentImageMotionClass]"
          @dblclick="toggleZoom"
        />
      </div>

      <button
        v-if="hasPrev"
        type="button"
        :class="[galleryStyles.navButton, galleryStyles.navButtonLeft]"
        @click.stop="prevImage"
        aria-label="이전"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          :class="galleryStyles.icon"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        v-if="hasNext"
        type="button"
        :class="[galleryStyles.navButton, galleryStyles.navButtonRight]"
        @click.stop="nextImage"
        aria-label="다음"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          :class="galleryStyles.icon"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div :class="galleryStyles.counter">
        {{ (selectedIndex ?? 0) + 1 }} / {{ totalImages }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import { useWeddingStore } from "~/stores/wedding";

const store = useWeddingStore();
const { sharedStyles, galleryStyles } = useEmotionStyles();

const isLightboxOpen = ref(false);
const selectedIndex = ref<number | null>(null);
const zoomScale = ref(1);
const dragOffsetX = ref(0);
const touchStartX = ref(0);
const touchStartY = ref(0);
const lightboxImage = ref<HTMLImageElement | null>(null);
const lightboxImageRenderSeed = ref(0);
const slideDirection = ref<"next" | "prev">("next");

const images = computed(() => store.galleryImages);
const totalImages = computed(() => images.value?.length ?? 0);
const currentImage = computed(() =>
  selectedIndex.value != null ? images.value[selectedIndex.value] : null
);
const currentImageKey = computed(() =>
  currentImage.value
    ? `${currentImage.value.src}-${lightboxImageRenderSeed.value}`
    : "lightbox-image-empty"
);
const currentImageMotionClass = computed(() =>
  slideDirection.value === "next"
    ? galleryStyles.lightboxImageEnterNext
    : galleryStyles.lightboxImageEnterPrev
);
const hasPrev = computed(() => (selectedIndex.value ?? 0) > 0);
const hasNext = computed(
  () =>
    selectedIndex.value != null && selectedIndex.value < totalImages.value - 1
);

function syncImageTransform() {
  if (!lightboxImage.value) return;
  lightboxImage.value.style.transform = `translateX(${dragOffsetX.value}px) scale(${zoomScale.value})`;
}

function lockBodyScroll() {
  document.body.classList.add("wedding-no-scroll");
}

function unlockBodyScroll() {
  document.body.classList.remove("wedding-no-scroll");
}

function openLightbox(index: number) {
  if (!images.value || images.value.length === 0) return;
  slideDirection.value = "next";
  lightboxImageRenderSeed.value += 1;
  selectedIndex.value = index;
  isLightboxOpen.value = true;
  lockBodyScroll();

  void nextTick(() => {
    syncImageTransform();
  });
}

function closeLightbox() {
  isLightboxOpen.value = false;
  selectedIndex.value = null;
  dragOffsetX.value = 0;
  zoomScale.value = 1;
  lightboxImageRenderSeed.value = 0;
  unlockBodyScroll();
}

function prevImage() {
  if (hasPrev.value && selectedIndex.value != null) {
    slideDirection.value = "prev";
    lightboxImageRenderSeed.value += 1;
    selectedIndex.value -= 1;
    dragOffsetX.value = 0;
    zoomScale.value = 1;
  }
}

function nextImage() {
  if (hasNext.value && selectedIndex.value != null) {
    slideDirection.value = "next";
    lightboxImageRenderSeed.value += 1;
    selectedIndex.value += 1;
    dragOffsetX.value = 0;
    zoomScale.value = 1;
  }
}

function toggleZoom() {
  zoomScale.value = zoomScale.value === 1 ? 2 : 1;
  syncImageTransform();
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return;
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
  dragOffsetX.value = 0;
  syncImageTransform();
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length !== 1) return;
  const dx = e.touches[0].clientX - touchStartX.value;
  const dy = e.touches[0].clientY - touchStartY.value;
  if (Math.abs(dy) > Math.abs(dx)) return;
  dragOffsetX.value = dx;
  syncImageTransform();
}

function onTouchEnd() {
  if (zoomScale.value > 1) {
    dragOffsetX.value = 0;
    syncImageTransform();
    return;
  }

  const threshold = 55;
  if (dragOffsetX.value > threshold) {
    prevImage();
    return;
  }

  if (dragOffsetX.value < -threshold) {
    nextImage();
    return;
  }

  dragOffsetX.value = 0;
  syncImageTransform();
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
  unlockBodyScroll();
});
</script>
