<template>
  <section :class="[sharedStyles.shared__sectionWrap, galleryStyles.gallery__sectionOffset]">
    <div :class="galleryStyles.gallery__header">
      <span :class="sharedStyles.shared__floralChip">Gallery</span>
      <h2 :class="[sharedStyles.shared__sectionTitle, galleryStyles.gallery__title]">우리의 순간</h2>
      <p :class="[sharedStyles.shared__sectionSubtitle, galleryStyles.gallery__subtitle]">사진을 누르면 크게 볼 수 있어요</p>
    </div>

    <div :class="galleryStyles.gallery__carouselShell">
      <button
        v-if="showThumbNavigation"
        type="button"
        :disabled="isThumbBeginning"
        :class="[galleryStyles.gallery__carouselNavButton, galleryStyles.gallery__carouselNavButtonLeft]"
        aria-label="썸네일 이전"
        @click="scrollThumbPrev"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          :class="galleryStyles.gallery__icon"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        v-if="showThumbNavigation"
        type="button"
        :disabled="isThumbEnd"
        :class="[galleryStyles.gallery__carouselNavButton, galleryStyles.gallery__carouselNavButtonRight]"
        aria-label="썸네일 다음"
        @click="scrollThumbNext"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          :class="galleryStyles.gallery__icon"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        ref="thumbViewportRef"
        :class="galleryStyles.gallery__carouselViewport"
      >
        <div :class="galleryStyles.gallery__carouselContainer">
          <div
            v-for="(image, index) in store.galleryImages"
            :key="`${image.fullSrc}-${index}`"
            :class="galleryStyles.gallery__carouselSlide"
          >
            <button
              :ref="(el) => registerThumb(el as Element | null, index)"
              type="button"
              :class="galleryStyles.gallery__thumbButton"
              @click="openLightbox(index, image.fullSrc)"
            >
              <img
                v-if="isThumbReady(index)"
                :src="image.thumbSrc"
                :alt="image.alt"
                :class="[
                  galleryStyles.gallery__thumbImage,
                  isThumbLoaded(index)
                    ? galleryStyles.gallery__thumbImageVisible
                    : galleryStyles.gallery__thumbImageHidden,
                ]"
                @load="markThumbLoaded(index)"
                @error="markThumbError(index)"
              />
              <div v-if="!isThumbReady(index)" :class="galleryStyles.gallery__thumbPlaceholder" />
              <div v-else-if="!isThumbLoaded(index)" :class="galleryStyles.gallery__thumbLoadingOverlay">
                <span :class="galleryStyles.gallery__thumbLoadingSpinner" />
                <span :class="galleryStyles.gallery__thumbLoadingText">로딩 중</span>
              </div>
              <div :class="galleryStyles.gallery__thumbCaption">{{ index + 1 }}번째 추억</div>
            </button>
          </div>
        </div>
      </div>

    </div>

    <div :class="galleryStyles.gallery__viewAllButtonWrap">
      <button
        type="button"
        :class="galleryStyles.gallery__viewAllButton"
        :disabled="totalImages === 0"
        @click="openAllPhotosLayer"
      >
        사진 전체보기
      </button>
    </div>

    <div
      v-if="isAllPhotosLayerOpen"
      :class="[galleryStyles.gallery__allPhotosLayer, allPhotosLayerMotionClass]"
      @click.self="closeAllPhotosLayer"
    >
      <div :class="[galleryStyles.gallery__allPhotosPanel, allPhotosPanelMotionClass]">
        <div :class="galleryStyles.gallery__allPhotosHeader">
          <h3 :class="galleryStyles.gallery__allPhotosTitle">사진 전체보기</h3>
          <button
            type="button"
            :class="galleryStyles.gallery__allPhotosCloseButton"
            aria-label="사진 전체보기 닫기"
            @click="closeAllPhotosLayer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              :class="galleryStyles.gallery__icon"
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
          ref="allPhotosBodyRef"
          :class="galleryStyles.gallery__allPhotosBody"
          @wheel.passive="onAllPhotosWheel"
          @touchstart.passive="onAllPhotosTouchStart"
          @touchmove.passive="onAllPhotosTouchMove"
          @touchend.passive="onAllPhotosTouchEnd"
          @touchcancel.passive="onAllPhotosTouchEnd"
        >
          <div :class="galleryStyles.gallery__allPhotosGrid">
            <button
              v-for="(image, index) in allPhotosVisibleImages"
              :key="`gallery-all-${image.fullSrc}-${index}`"
              type="button"
              :class="galleryStyles.gallery__allPhotosItemButton"
              @click="openLightboxFromAllPhotos(index, image.fullSrc)"
            >
              <div :class="galleryStyles.gallery__allPhotosMedia">
                <img
                  :ref="(el) => registerAllPhotosImage(el, image.thumbSrc)"
                  :src="image.thumbSrc"
                  :alt="image.alt"
                  loading="lazy"
                  fetchpriority="low"
                  decoding="sync"
                  :class="[
                    galleryStyles.gallery__allPhotosImage,
                    isAllPhotosImageLoaded(image.thumbSrc)
                      ? galleryStyles.gallery__allPhotosImageVisible
                      : galleryStyles.gallery__allPhotosImageHidden,
                  ]"
                  @load="markAllPhotosImageLoaded(image.thumbSrc)"
                  @error="markAllPhotosImageError(image.thumbSrc)"
                />
                <div
                  :class="[
                    galleryStyles.gallery__allPhotosSkeleton,
                    isAllPhotosImageLoaded(image.thumbSrc) ? galleryStyles.gallery__allPhotosSkeletonDone : '',
                  ]"
                />
                <div
                  v-if="!isAllPhotosImageLoaded(image.thumbSrc)"
                  :class="galleryStyles.gallery__allPhotosLoadingOverlay"
                >
                  <span :class="galleryStyles.gallery__allPhotosLoadingSpinner" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isLightboxOpen"
      :class="[galleryStyles.gallery__overlay, lightboxOverlayMotionClass]"
      @click.self="closeLightbox"
      @wheel.passive="onLightboxWheel"
    >
      <button
        type="button"
        :class="galleryStyles.gallery__closeButton"
        @click="closeLightbox"
        aria-label="닫기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          :class="galleryStyles.gallery__icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div
        :class="[galleryStyles.gallery__lightboxViewport, lightboxViewportMotionClass]"
        @touchstart.passive="onLightboxTouchStart"
        @touchmove.passive="onLightboxTouchMove"
        @touchend.passive="onLightboxTouchEnd"
        @touchcancel.passive="onLightboxTouchCancel"
      >
        <div :class="galleryStyles.gallery__lightboxContainer">
          <div :class="galleryStyles.gallery__lightboxSlide">
            <div :class="galleryStyles.gallery__lightboxMedia">
              <Transition
                :enter-active-class="currentLightboxTransitionClasses.enterActiveClass"
                :enter-from-class="currentLightboxTransitionClasses.enterFromClass"
                :enter-to-class="currentLightboxTransitionClasses.enterToClass"
                :leave-active-class="currentLightboxTransitionClasses.leaveActiveClass"
                :leave-from-class="currentLightboxTransitionClasses.leaveFromClass"
                :leave-to-class="currentLightboxTransitionClasses.leaveToClass"
              >
                <img
                  v-if="currentLightboxImage"
                  :key="currentLightboxImageKey"
                  :src="currentLightboxImage.fullSrc"
                  :alt="currentLightboxImage.alt"
                  :data-image-src="currentLightboxImage.fullSrc"
                  decoding="async"
                  :class="galleryStyles.gallery__lightboxImage"
                  @load="onLightboxImageLoad"
                  @error="onLightboxImageError"
                />
              </Transition>
            </div>
            <div
              v-if="currentLightboxImage && !isLightboxImageLoaded"
              :class="galleryStyles.gallery__lightboxLoadingOverlay"
            >
              <span :class="galleryStyles.gallery__lightboxLoadingSpinner" />
              <span :class="galleryStyles.gallery__lightboxLoadingText">사진 불러오는 중</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        :disabled="!hasPrev"
        :class="[galleryStyles.gallery__navButton, galleryStyles.gallery__navButtonLeft]"
        @click.stop="slidePrev"
        aria-label="이전"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          :class="galleryStyles.gallery__icon"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        :disabled="!hasNext"
        :class="[galleryStyles.gallery__navButton, galleryStyles.gallery__navButtonRight]"
        @click.stop="slideNext"
        aria-label="다음"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          :class="galleryStyles.gallery__icon"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div :class="galleryStyles.gallery__counter">
        {{ currentLightboxIndex + 1 }} / {{ totalImages }}
      </div>

      <div :class="galleryStyles.gallery__lightboxControlBar">
        <button
          type="button"
          :disabled="!hasPrev"
          :class="galleryStyles.gallery__lightboxControlButton"
          aria-label="이전 사진"
          @click.stop="slidePrev"
        >
          이전
        </button>
        <button
          type="button"
          :disabled="!hasNext"
          :class="galleryStyles.gallery__lightboxControlButton"
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
  allPhotosBodyRef,
  allPhotosVisibleImages,
  totalImages,
  isAllPhotosLayerOpen,
  allPhotosLayerMotionClass,
  allPhotosPanelMotionClass,
  isLightboxOpen,
  currentLightboxIndex,
  currentLightboxImage,
  currentLightboxImageKey,
  currentLightboxTransitionClasses,
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
  onAllPhotosWheel,
  onAllPhotosTouchStart,
  onAllPhotosTouchMove,
  onAllPhotosTouchEnd,
  scrollThumbPrev,
  scrollThumbNext,
  slidePrev,
  slideNext,
  onLightboxImageLoad,
  onLightboxImageError,
  lightboxOverlayMotionClass,
  lightboxViewportMotionClass,
  onLightboxTouchStart,
  onLightboxTouchMove,
  onLightboxTouchEnd,
  onLightboxTouchCancel,
  onLightboxWheel,
} = useGallerySection();
</script>
