import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, triggerRef } from "vue";
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
const THUMB_SCROLL_DURATION_MS = 420;
// #endregion

export function useGallerySection() {
  // #region 초기화
  const store = useWeddingStore();
  const { sharedStyles, galleryStyles } = useEmotionStyles();
  const {
    isReady,
    isLoaded,
    markLoaded: markThumbLoadedRaw,
    registerThumb,
  } = useGalleryLazyLoad();
  const thumbViewportRef = ref<HTMLElement | null>(null);
  // #endregion

  // #region 상태
  const isLightboxOpen = ref(false);
  const isAllPhotosLayerOpen = ref(false);
  // 전체보기 이미지 로드 완료 src 캐시 - 레이어 재열기 시 로드 상태 유지
  const allPhotosLoadedSrcSet = shallowRef(new Set<string>());
  // 라이트박스/프리로드용 이미지 캐시 - 반응성 불필요
  const cachedImageSrcSet = new Set<string>();
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
  const allPhotosVisibleImages = computed(() => images.value);
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
  let thumbScrollAnimationRafId: number | null = null;
  let thumbScrollAnimationStartAt: number | null = null;
  let thumbScrollAnimationFrom = 0;
  let thumbScrollAnimationTo = 0;
  const imagePreloadPromiseMap = new Map<string, Promise<void>>();
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

  function clearThumbScrollAnimationRaf() {
    if (thumbScrollAnimationRafId == null) return;
    window.cancelAnimationFrame(thumbScrollAnimationRafId);
    thumbScrollAnimationRafId = null;
    thumbScrollAnimationStartAt = null;
  }

  function lockBodyScroll() {
    document.body.classList.add("wedding-no-scroll");
  }

  function unlockBodyScroll() {
    document.body.classList.remove("wedding-no-scroll");
  }

  // overlay 상태 기반 body 스크롤 잠금 동기화 - 라이트박스/전체보기 레이어 동시 조건 반영
  function syncBodyScrollState() {
    if (isLightboxOpen.value || isAllPhotosLayerOpen.value) {
      lockBodyScroll();
      return;
    }
    unlockBodyScroll();
  }

  function resolveThumbGroupSize(viewportWidth: number): number {
    if (viewportWidth >= DESKTOP_BREAKPOINT) return THUMB_GROUP_DESKTOP;
    if (viewportWidth >= TABLET_BREAKPOINT) return THUMB_GROUP_TABLET;
    return THUMB_GROUP_MOBILE;
  }

  function easeInOutCubic(progress: number): number {
    if (progress < 0.5) {
      return 4 * progress * progress * progress;
    }

    const easedProgress = -2 * progress + 2;
    return 1 - (easedProgress * easedProgress * easedProgress) / 2;
  }

  // cachedImageSrcSet에 src 추가
  function markImageCached(imageSrc: string) {
    cachedImageSrcSet.add(imageSrc);
  }

  // allPhotosLoadedSrcSet에 src 추가 및 반응성 트리거
  function markAllPhotosLoaded(imageSrc: string) {
    if (allPhotosLoadedSrcSet.value.has(imageSrc)) return;
    allPhotosLoadedSrcSet.value.add(imageSrc);
    triggerRef(allPhotosLoadedSrcSet);
  }

  // cachedImageSrcSet 캐시 여부 확인
  function isImageCached(imageSrc: string): boolean {
    return cachedImageSrcSet.has(imageSrc);
  }

  // allPhotosLoadedSrcSet 로드 완료 여부 확인
  function isAllPhotosImageLoaded(imageSrc: string): boolean {
    return allPhotosLoadedSrcSet.value.has(imageSrc);
  }

  async function preloadImage(imageSrc: string): Promise<void> {
    if (typeof window === "undefined") return;
    if (isImageCached(imageSrc)) return;

    const existingPromise = imagePreloadPromiseMap.get(imageSrc);
    if (existingPromise) {
      await existingPromise;
      return;
    }

    const preloadPromise = new Promise<void>((resolve) => {
      const preloadImageElement = new Image();

      preloadImageElement.onload = () => {
        markImageCached(imageSrc);
        imagePreloadPromiseMap.delete(imageSrc);
        resolve();
      };

      preloadImageElement.onerror = () => {
        imagePreloadPromiseMap.delete(imageSrc);
        resolve();
      };

      preloadImageElement.src = imageSrc;

      if (preloadImageElement.complete) {
        markImageCached(imageSrc);
        imagePreloadPromiseMap.delete(imageSrc);
        resolve();
      }
    });

    imagePreloadPromiseMap.set(imageSrc, preloadPromise);
    await preloadPromise;
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

  function animateThumbScroll(timestamp: number) {
    const viewport = thumbViewportRef.value;
    if (!viewport) {
      clearThumbScrollAnimationRaf();
      return;
    }

    if (thumbScrollAnimationStartAt == null) {
      thumbScrollAnimationStartAt = timestamp;
    }

    const elapsedMs = timestamp - thumbScrollAnimationStartAt;
    const normalizedProgress = Math.min(elapsedMs / THUMB_SCROLL_DURATION_MS, 1);
    const easedProgress = easeInOutCubic(normalizedProgress);
    const nextScrollLeft =
      thumbScrollAnimationFrom +
      (thumbScrollAnimationTo - thumbScrollAnimationFrom) * easedProgress;
    viewport.scrollLeft = nextScrollLeft;

    if (normalizedProgress >= 1) {
      viewport.scrollLeft = thumbScrollAnimationTo;
      clearThumbScrollAnimationRaf();
      syncThumbSelectedIndexFromScroll();
      return;
    }

    thumbScrollAnimationRafId = window.requestAnimationFrame(animateThumbScroll);
  }

  function startThumbScrollAnimation(targetOffset: number) {
    const viewport = thumbViewportRef.value;
    if (!viewport) return;

    const currentOffset = viewport.scrollLeft;
    if (Math.abs(targetOffset - currentOffset) < 1) {
      viewport.scrollLeft = targetOffset;
      syncThumbSelectedIndexFromScroll();
      return;
    }

    clearThumbScrollAnimationRaf();
    thumbScrollAnimationFrom = currentOffset;
    thumbScrollAnimationTo = targetOffset;
    thumbScrollAnimationRafId = window.requestAnimationFrame(animateThumbScroll);
  }

  function scrollThumbTo(index: number) {
    const viewport = thumbViewportRef.value;
    if (!viewport) return;
    const safeIndex = clampPageIndex(index);
    const targetOffset = thumbPageOffsets.value[safeIndex] ?? 0;
    thumbSelectedSnapIndex.value = safeIndex;
    startThumbScrollAnimation(targetOffset);
  }

  function scrollThumbPrev() {
    scrollThumbTo(thumbSelectedSnapIndex.value - 1);
  }

  function scrollThumbNext() {
    scrollThumbTo(thumbSelectedSnapIndex.value + 1);
  }

  function markThumbLoaded(index: number) {
    markThumbLoadedRaw(index);
    const image = images.value[index];
    if (!image) return;
    markImageCached(image.src);
  }

  function markThumbError(index: number) {
    markThumbLoadedRaw(index);
  }

  // 전체보기 이미지 로드 완료 처리 - cachedImageSrcSet 및 allPhotosLoadedSrcSet 동시 갱신
  function markAllPhotosImageLoaded(imageSrc: string) {
    markImageCached(imageSrc);
    markAllPhotosLoaded(imageSrc);
  }

  function markAllPhotosImageError(imageSrc: string) {
    markAllPhotosLoaded(imageSrc);
  }

  // 마운트 시점에 이미 complete 상태인 이미지 로드 완료 처리
  function registerAllPhotosImage(el: Element | null, imageSrc: string) {
    if (!(el instanceof HTMLImageElement)) return;
    if (!el.complete || el.naturalWidth <= 0) return;
    markAllPhotosImageLoaded(imageSrc);
  }
  // #endregion

  // #region 라이트박스 제어
  function openLightbox(index: number, imageSrc: string) {
    if (totalImages.value === 0) return;
    lightboxSlideDirection.value = "next";
    currentLightboxIndex.value = resolveLightboxIndex(index, imageSrc);
    lightboxImageRenderSeed.value += 1;
    const selectedImage = images.value[currentLightboxIndex.value];
    const isSelectedImageCached =
      selectedImage == null ? false : isImageCached(selectedImage.src);
    isLightboxImageLoaded.value = isSelectedImageCached;
    isLightboxOpen.value = true;
    syncBodyScrollState();

    if (selectedImage && !isSelectedImageCached) {
      void preloadImage(selectedImage.src);
    }
  }

  function closeLightbox() {
    isLightboxOpen.value = false;
    lightboxImageRenderSeed.value = 0;
    lightboxSlideDirection.value = "next";
    isLightboxImageLoaded.value = false;
    resetLightboxTouchPosition();
    syncBodyScrollState();
  }

  // 전체보기 레이어 열기 - 이전 로드 상태 유지
  function openAllPhotosLayer() {
    if (totalImages.value === 0) return;
    isAllPhotosLayerOpen.value = true;
    syncBodyScrollState();
  }

  // 전체보기 레이어 닫기 - 로드 완료 상태는 초기화하지 않음
  function closeAllPhotosLayer() {
    isAllPhotosLayerOpen.value = false;
    syncBodyScrollState();
  }

  function openLightboxFromAllPhotos(index: number, imageSrc: string) {
    openLightbox(index, imageSrc);
  }

  function slidePrev() {
    if (!hasPrev.value) return;
    const nextIndex = currentLightboxIndex.value - 1;
    lightboxSlideDirection.value = "prev";
    lightboxImageRenderSeed.value += 1;
    currentLightboxIndex.value = nextIndex;

    const nextImage = images.value[nextIndex];
    const isNextImageCached = nextImage == null ? false : isImageCached(nextImage.src);
    isLightboxImageLoaded.value = isNextImageCached;

    if (nextImage && !isNextImageCached) {
      void preloadImage(nextImage.src);
    }
  }

  function slideNext() {
    if (!hasNext.value) return;
    const nextIndex = currentLightboxIndex.value + 1;
    lightboxSlideDirection.value = "next";
    lightboxImageRenderSeed.value += 1;
    currentLightboxIndex.value = nextIndex;

    const nextImage = images.value[nextIndex];
    const isNextImageCached = nextImage == null ? false : isImageCached(nextImage.src);
    isLightboxImageLoaded.value = isNextImageCached;

    if (nextImage && !isNextImageCached) {
      void preloadImage(nextImage.src);
    }
  }

  function onLightboxImageLoad() {
    isLightboxImageLoaded.value = true;
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      if (isLightboxOpen.value) {
        closeLightbox();
        return;
      }

      if (isAllPhotosLayerOpen.value) {
        closeAllPhotosLayer();
      }
      return;
    }

    if (!isLightboxOpen.value) return;

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
    clearThumbScrollAnimationRaf();
    imagePreloadPromiseMap.clear();
    unlockBodyScroll();
  });
  // #endregion

  return {
    store,
    sharedStyles,
    galleryStyles,
    isThumbReady: isReady,
    isThumbLoaded: isLoaded,
    markThumbLoaded,
    markThumbError,
    markAllPhotosImageLoaded,
    markAllPhotosImageError,
    registerAllPhotosImage,
    isAllPhotosImageLoaded,
    registerThumb,
    thumbViewportRef,
    images,
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
  };
}
