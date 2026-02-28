import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import { useGalleryLazyLoad } from "~/composables/useGalleryLazyLoad";
import { useWeddingStore } from "~/stores/wedding";

// #region 갤러리 모델
interface GalleryImage {
  src: string;
  alt: string;
}
// #endregion

// #region 썸네일 페이지 이동 규칙 상수
const THUMB_GROUP_MOBILE = 2;
const THUMB_GROUP_TABLET = 3;
const THUMB_GROUP_DESKTOP = 4;
const TABLET_BREAKPOINT = 640;
const DESKTOP_BREAKPOINT = 1024;
const LAYOUT_RETRY_DELAY_MS = 16;
const LIGHTBOX_SWIPE_THRESHOLD_PX = 48;
// #endregion

export function useGallerySection() {
  // #region 초기화
  const store = useWeddingStore();
  const { sharedStyles, galleryStyles } = useEmotionStyles();
  const { isReady, isLoaded, markLoaded, registerThumb } = useGalleryLazyLoad();
  const thumbViewportRef = ref<HTMLElement | null>(null);
  // #endregion

  // #region 상태
  const isLightboxOpen = ref(false);
  const currentLightboxIndex = ref(0);
  const thumbSelectedSnapIndex = ref(0);
  const thumbPageOffsets = ref<number[]>([]);
  const thumbGroupSize = ref(THUMB_GROUP_MOBILE);
  const lightboxTouchStartX = ref<number | null>(null);
  const lightboxTouchStartY = ref<number | null>(null);
  const lightboxImageRenderSeed = ref(0);
  const lightboxSlideDirection = ref<"next" | "prev">("next");
  const isLightboxImageLoaded = ref(false);

  const images = computed(() => store.galleryImages);
  const totalImages = computed(() => images.value.length);
  const currentLightboxImage = computed(
    () => images.value[currentLightboxIndex.value] ?? null,
  );
  const currentLightboxImageKey = computed(() => {
    const image = currentLightboxImage.value;
    if (!image) {
      return "gallery-lightbox-empty";
    }

    return `${image.src}-${currentLightboxIndex.value}-${lightboxImageRenderSeed.value}`;
  });
  const currentLightboxMotionClass = computed(() =>
    lightboxSlideDirection.value === "next"
      ? galleryStyles.lightboxImageEnterNext
      : galleryStyles.lightboxImageEnterPrev,
  );
  const hasPrev = computed(() => currentLightboxIndex.value > 0);
  const hasNext = computed(
    () => currentLightboxIndex.value < totalImages.value - 1,
  );
  const thumbSnapIndexes = computed(() =>
    Array.from({ length: thumbPageOffsets.value.length }, (_, index) => index),
  );
  const showThumbNavigation = computed(() => thumbPageOffsets.value.length > 1);
  const isThumbBeginning = computed(() => thumbSelectedSnapIndex.value <= 0);
  const isThumbEnd = computed(
    () =>
      thumbPageOffsets.value.length === 0
        ? true
        : thumbSelectedSnapIndex.value >= thumbPageOffsets.value.length - 1,
  );

  let thumbLayoutTimerId: number | null = null;
  let thumbScrollRafId: number | null = null;
  let resizeRafId: number | null = null;
  // #endregion

  // #region 공통 유틸
  function clearThumbLayoutTimer() {
    if (thumbLayoutTimerId == null) return;
    window.clearTimeout(thumbLayoutTimerId);
    thumbLayoutTimerId = null;
  }

  function clearThumbScrollRaf() {
    if (thumbScrollRafId == null) return;
    window.cancelAnimationFrame(thumbScrollRafId);
    thumbScrollRafId = null;
  }

  function clearResizeRaf() {
    if (resizeRafId == null) return;
    window.cancelAnimationFrame(resizeRafId);
    resizeRafId = null;
  }

  function lockBodyScroll() {
    document.body.classList.add("wedding-no-scroll");
  }

  function unlockBodyScroll() {
    document.body.classList.remove("wedding-no-scroll");
  }

  function resolveThumbGroupSize(viewportWidth: number): number {
    if (viewportWidth >= DESKTOP_BREAKPOINT) return THUMB_GROUP_DESKTOP;
    if (viewportWidth >= TABLET_BREAKPOINT) return THUMB_GROUP_TABLET;
    return THUMB_GROUP_MOBILE;
  }

  function clampPageIndex(index: number): number {
    if (thumbPageOffsets.value.length === 0) return 0;
    return Math.max(0, Math.min(index, thumbPageOffsets.value.length - 1));
  }

  function clampLightboxIndex(index: number): number {
    if (totalImages.value === 0) return 0;
    return Math.max(0, Math.min(index, totalImages.value - 1));
  }

  function resolveLightboxIndex(index: number, imageSrc: string): number {
    const safeIndex = clampLightboxIndex(index);
    const currentImage = images.value[safeIndex];

    if (currentImage && currentImage.src === imageSrc) {
      return safeIndex;
    }

    const matchedIndex = images.value.findIndex(
      (image: GalleryImage) => image.src === imageSrc,
    );

    if (matchedIndex >= 0) {
      return matchedIndex;
    }

    return safeIndex;
  }

  function getSlideScrollOffset(
    viewport: HTMLElement,
    slide: HTMLElement,
  ): number {
    const viewportRect = viewport.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    return Math.max(slideRect.left + viewport.scrollLeft - viewportRect.left, 0);
  }
  // #endregion

  // #region 썸네일 스크롤 상태
  function findNearestThumbPageIndex(scrollLeft: number): number {
    const offsets = thumbPageOffsets.value;
    if (offsets.length === 0) return 0;

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    offsets.forEach((offset, index) => {
      const distance = Math.abs(offset - scrollLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  }

  function syncThumbSelectedIndexFromScroll() {
    const viewport = thumbViewportRef.value;
    if (!viewport) return;
    thumbSelectedSnapIndex.value = findNearestThumbPageIndex(viewport.scrollLeft);
  }

  function collectThumbPageOffsets(): number[] {
    const viewport = thumbViewportRef.value;
    if (!viewport) return [];
    const containerNode = viewport.firstElementChild;
    if (!(containerNode instanceof HTMLElement)) return [];

    const slideNodes = Array.from(containerNode.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    );
    if (slideNodes.length === 0) return [];

    thumbGroupSize.value = resolveThumbGroupSize(window.innerWidth);

    const offsets: number[] = [];
    for (
      let slideIndex = 0;
      slideIndex < slideNodes.length;
      slideIndex += thumbGroupSize.value
    ) {
      offsets.push(getSlideScrollOffset(viewport, slideNodes[slideIndex]));
    }

    return offsets;
  }

  function refreshThumbLayout() {
    thumbPageOffsets.value = collectThumbPageOffsets();
    thumbSelectedSnapIndex.value = clampPageIndex(
      findNearestThumbPageIndex(thumbViewportRef.value?.scrollLeft ?? 0),
    );
  }

  function onThumbScroll() {
    if (thumbScrollRafId != null) return;
    thumbScrollRafId = window.requestAnimationFrame(() => {
      thumbScrollRafId = null;
      syncThumbSelectedIndexFromScroll();
    });
  }

  function onWindowResize() {
    if (resizeRafId != null) return;
    resizeRafId = window.requestAnimationFrame(() => {
      resizeRafId = null;
      refreshThumbLayout();
    });
  }

  function scrollThumbTo(index: number) {
    const viewport = thumbViewportRef.value;
    if (!viewport) return;
    const safeIndex = clampPageIndex(index);
    const targetOffset = thumbPageOffsets.value[safeIndex] ?? 0;
    viewport.scrollTo({ left: targetOffset, behavior: "smooth" });
    thumbSelectedSnapIndex.value = safeIndex;
  }

  function scrollThumbPrev() {
    scrollThumbTo(thumbSelectedSnapIndex.value - 1);
  }

  function scrollThumbNext() {
    scrollThumbTo(thumbSelectedSnapIndex.value + 1);
  }
  // #endregion

  // #region 라이트박스 제어
  function openLightbox(index: number, imageSrc: string) {
    if (totalImages.value === 0) return;
    lightboxSlideDirection.value = "next";
    currentLightboxIndex.value = resolveLightboxIndex(index, imageSrc);
    lightboxImageRenderSeed.value += 1;
    isLightboxImageLoaded.value = false;
    isLightboxOpen.value = true;
    lockBodyScroll();
  }

  function closeLightbox() {
    isLightboxOpen.value = false;
    lightboxImageRenderSeed.value = 0;
    lightboxSlideDirection.value = "next";
    isLightboxImageLoaded.value = false;
    resetLightboxTouchPosition();
    unlockBodyScroll();
  }

  function slidePrev() {
    if (!hasPrev.value) return;
    lightboxSlideDirection.value = "prev";
    lightboxImageRenderSeed.value += 1;
    isLightboxImageLoaded.value = false;
    currentLightboxIndex.value -= 1;
  }

  function slideNext() {
    if (!hasNext.value) return;
    lightboxSlideDirection.value = "next";
    lightboxImageRenderSeed.value += 1;
    isLightboxImageLoaded.value = false;
    currentLightboxIndex.value += 1;
  }

  function onLightboxImageLoad() {
    isLightboxImageLoaded.value = true;
  }

  function onKeydown(event: KeyboardEvent) {
    if (!isLightboxOpen.value) return;
    if (event.key === "Escape") {
      closeLightbox();
      return;
    }
    if (event.key === "ArrowLeft") {
      slidePrev();
      return;
    }
    if (event.key === "ArrowRight") {
      slideNext();
    }
  }

  // 라이트박스 터치 시작 좌표 저장 - 좌우 스와이프 판별 기준 사용
  function onLightboxTouchStart(event: TouchEvent) {
    const primaryTouch = event.touches[0];
    if (!primaryTouch) return;

    lightboxTouchStartX.value = primaryTouch.clientX;
    lightboxTouchStartY.value = primaryTouch.clientY;
  }

  function resetLightboxTouchPosition() {
    lightboxTouchStartX.value = null;
    lightboxTouchStartY.value = null;
  }

  // 라이트박스 터치 종료 이동량 계산 - 수평 우선 제스처만 이전/다음 이동 처리
  function onLightboxTouchEnd(event: TouchEvent) {
    const startX = lightboxTouchStartX.value;
    const startY = lightboxTouchStartY.value;
    const primaryTouch = event.changedTouches[0];

    if (startX == null || startY == null || !primaryTouch) {
      resetLightboxTouchPosition();
      return;
    }

    const deltaX = primaryTouch.clientX - startX;
    const deltaY = primaryTouch.clientY - startY;
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const isValidSwipeDistance =
      Math.abs(deltaX) >= LIGHTBOX_SWIPE_THRESHOLD_PX;

    if (isHorizontalSwipe && isValidSwipeDistance) {
      if (deltaX > 0) {
        slidePrev();
      } else {
        slideNext();
      }
    }

    resetLightboxTouchPosition();
  }

  function onLightboxTouchCancel() {
    resetLightboxTouchPosition();
  }
  // #endregion

  // #region 라이프사이클
  onMounted(async () => {
    await store.fetchWeddingData();
    await store.fetchGallery();
    await nextTick();
    refreshThumbLayout();

    if (thumbPageOffsets.value.length === 0 && totalImages.value > 0) {
      clearThumbLayoutTimer();
      thumbLayoutTimerId = window.setTimeout(() => {
        refreshThumbLayout();
      }, LAYOUT_RETRY_DELAY_MS);
    }

    thumbViewportRef.value?.addEventListener("scroll", onThumbScroll, {
      passive: true,
    });
    window.addEventListener("resize", onWindowResize, { passive: true });
    window.addEventListener("keydown", onKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", onKeydown);
    window.removeEventListener("resize", onWindowResize);
    thumbViewportRef.value?.removeEventListener("scroll", onThumbScroll);

    clearThumbLayoutTimer();
    clearThumbScrollRaf();
    clearResizeRaf();
    unlockBodyScroll();
  });
  // #endregion

  return {
    store,
    sharedStyles,
    galleryStyles,
    isThumbReady: isReady,
    isThumbLoaded: isLoaded,
    markThumbLoaded: markLoaded,
    registerThumb,
    thumbViewportRef,
    images,
    totalImages,
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
    thumbSelectedSnapIndex,
    thumbSnapIndexes,
    openLightbox,
    closeLightbox,
    scrollThumbPrev,
    scrollThumbNext,
    scrollThumbTo,
    slidePrev,
    slideNext,
    onLightboxImageLoad,
    onLightboxTouchStart,
    onLightboxTouchEnd,
    onLightboxTouchCancel,
  };
}
