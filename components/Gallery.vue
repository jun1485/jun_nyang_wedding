<template>
  <section :class="[sharedStyles.sectionWrap, galleryStyles.sectionOffset]">
    <div :class="galleryStyles.header">
      <span :class="sharedStyles.floralChip">Gallery</span>
      <h2 :class="[sharedStyles.sectionTitle, galleryStyles.title]">우리의 순간</h2>
      <p :class="[sharedStyles.sectionSubtitle, galleryStyles.subtitle]">사진을 누르면 크게 볼 수 있어요</p>
    </div>

    <div :class="galleryStyles.carouselShell">
      <button
        v-if="showThumbNavigation"
        type="button"
        :disabled="isThumbBeginning"
        :class="[galleryStyles.carouselNavButton, galleryStyles.carouselNavButtonLeft]"
        aria-label="썸네일 이전"
        @click="scrollThumbPrev"
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
        v-if="showThumbNavigation"
        type="button"
        :disabled="isThumbEnd"
        :class="[galleryStyles.carouselNavButton, galleryStyles.carouselNavButtonRight]"
        aria-label="썸네일 다음"
        @click="scrollThumbNext"
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

      <div
        ref="thumbViewportRef"
        :class="galleryStyles.carouselViewport"
      >
        <div :class="galleryStyles.carouselContainer">
          <div
            v-for="(image, index) in store.galleryImages"
            :key="`${image.src}-${index}`"
            :class="galleryStyles.carouselSlide"
          >
            <button
              :ref="(el) => registerThumb(el as Element | null, index)"
              type="button"
              :class="galleryStyles.thumbButton"
              @click="openLightbox(index, image.src)"
            >
              <img
                v-if="isThumbReady(index)"
                :src="image.src"
                :alt="image.alt"
                :class="[
                  galleryStyles.thumbImage,
                  isThumbLoaded(index)
                    ? galleryStyles.thumbImageVisible
                    : galleryStyles.thumbImageHidden,
                ]"
                @load="markThumbLoaded(index)"
                @error="markThumbError(index)"
              />
              <div v-if="!isThumbReady(index)" :class="galleryStyles.thumbPlaceholder" />
              <div v-else-if="!isThumbLoaded(index)" :class="galleryStyles.thumbLoadingOverlay">
                <span :class="galleryStyles.thumbLoadingSpinner" />
                <span :class="galleryStyles.thumbLoadingText">로딩 중</span>
              </div>
              <div :class="galleryStyles.thumbCaption">{{ index + 1 }}번째 추억</div>
            </button>
          </div>
        </div>
      </div>

    </div>

    <div :class="galleryStyles.viewAllButtonWrap">
      <button
        type="button"
        :class="galleryStyles.viewAllButton"
        :disabled="totalImages === 0"
        @click="openAllPhotosLayer"
      >
        사진 전체보기
      </button>
    </div>

    <div
      v-if="isAllPhotosLayerOpen"
      :class="galleryStyles.allPhotosLayer"
      @click.self="closeAllPhotosLayer"
    >
      <div :class="galleryStyles.allPhotosPanel">
        <div :class="galleryStyles.allPhotosHeader">
          <h3 :class="galleryStyles.allPhotosTitle">사진 전체보기</h3>
          <button
            type="button"
            :class="galleryStyles.allPhotosCloseButton"
            aria-label="사진 전체보기 닫기"
            @click="closeAllPhotosLayer"
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
        </div>

        <div
          :class="galleryStyles.allPhotosBody"
        >
          <div :class="galleryStyles.allPhotosGrid">
            <button
              v-for="(image, index) in allPhotosVisibleImages"
              :key="`gallery-all-${image.src}-${index}`"
              type="button"
              :class="galleryStyles.allPhotosItemButton"
              @click="openLightboxFromAllPhotos(index, image.src)"
            >
              <div :class="galleryStyles.allPhotosMedia">
                <img
                  :ref="(el) => registerAllPhotosImage(el, image.src)"
                  :src="image.src"
                  :alt="image.alt"
                  loading="lazy"
                  fetchpriority="low"
                  decoding="sync"
                  :class="[
                    galleryStyles.allPhotosImage,
                    isAllPhotosImageLoaded(image.src)
                      ? galleryStyles.allPhotosImageVisible
                      : galleryStyles.allPhotosImageHidden,
                  ]"
                  @load="markAllPhotosImageLoaded(image.src)"
                  @error="markAllPhotosImageError(image.src)"
                />
                <div
                  :class="[
                    galleryStyles.allPhotosSkeleton,
                    isAllPhotosImageLoaded(image.src) ? galleryStyles.allPhotosSkeletonDone : '',
                  ]"
                />
                <div
                  v-if="!isAllPhotosImageLoaded(image.src)"
                  :class="galleryStyles.allPhotosLoadingOverlay"
                >
                  <span :class="galleryStyles.allPhotosLoadingSpinner" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
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
        :class="galleryStyles.lightboxViewport"
        @touchstart.passive="onLightboxTouchStart"
        @touchend.passive="onLightboxTouchEnd"
        @touchcancel.passive="onLightboxTouchCancel"
      >
        <div :class="galleryStyles.lightboxContainer">
          <div :class="galleryStyles.lightboxSlide">
            <img
              v-if="currentLightboxImage"
              :key="currentLightboxImageKey"
              :src="currentLightboxImage.src"
              :alt="currentLightboxImage.alt"
              decoding="async"
              :class="[galleryStyles.lightboxImage, currentLightboxMotionClass]"
              @load="onLightboxImageLoad"
              @error="onLightboxImageLoad"
            />
            <div
              v-if="currentLightboxImage && !isLightboxImageLoaded"
              :class="galleryStyles.lightboxLoadingOverlay"
            >
              <span :class="galleryStyles.lightboxLoadingSpinner" />
              <span :class="galleryStyles.lightboxLoadingText">사진 불러오는 중</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        :disabled="!hasPrev"
        :class="[galleryStyles.navButton, galleryStyles.navButtonLeft]"
        @click.stop="slidePrev"
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
        type="button"
        :disabled="!hasNext"
        :class="[galleryStyles.navButton, galleryStyles.navButtonRight]"
        @click.stop="slideNext"
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
        {{ currentLightboxIndex + 1 }} / {{ totalImages }}
      </div>

      <div :class="galleryStyles.lightboxControlBar">
        <button
          type="button"
          :disabled="!hasPrev"
          :class="galleryStyles.lightboxControlButton"
          aria-label="이전 사진"
          @click.stop="slidePrev"
        >
          이전
        </button>
        <button
          type="button"
          :disabled="!hasNext"
          :class="galleryStyles.lightboxControlButton"
          aria-label="다음 사진"
          @click.stop="slideNext"
        >
          다음
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useGallerySection } from "~/composables/useGallerySection";

const {
  store,
  sharedStyles,
  galleryStyles,
  isThumbReady,
  isThumbLoaded,
  markThumbLoaded,
  markThumbError,
  markAllPhotosImageLoaded,
  markAllPhotosImageError,
  registerAllPhotosImage,
  isAllPhotosImageLoaded,
  registerThumb,
  allPhotosVisibleImages,
  totalImages,
  isAllPhotosLayerOpen,
  isLightboxOpen,
  currentLightboxIndex,
  currentLightboxImage,
  currentLightboxImageKey,
  currentLightboxMotionClass,
  isLightboxImageLoaded,
  hasPrev,
  hasNext,
  isThumbBeginning,
  isThumbEnd,
  showThumbNavigation,
  thumbViewportRef,
  openLightbox,
  openAllPhotosLayer,
  closeAllPhotosLayer,
  openLightboxFromAllPhotos,
  closeLightbox,
  scrollThumbPrev,
  scrollThumbNext,
  slidePrev,
  slideNext,
  onLightboxImageLoad,
  onLightboxTouchStart,
  onLightboxTouchEnd,
  onLightboxTouchCancel,
} = useGallerySection();
</script>
