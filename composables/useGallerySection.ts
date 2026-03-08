import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, triggerRef } from "vue";
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import { useGalleryLazyLoad } from "~/composables/useGalleryLazyLoad";
import { useWeddingStore } from "~/stores/wedding";
import type { GalleryImage } from "~/types/wedding";

// #region 썸네일 페이지 이동 규칙 상수
const THUMB_GROUP_MOBILE = 1;
const THUMB_GROUP_TABLET = 2;
const THUMB_GROUP_DESKTOP = 3;
const TABLET_BREAKPOINT = 640;
const DESKTOP_BREAKPOINT = 1024;
const LAYOUT_RETRY_DELAY_MS = 16;
const LIGHTBOX_SWIPE_THRESHOLD_PX = 48;
const THUMB_SCROLL_DURATION_MS = 420;
const ALL_PHOTOS_CLOSE_HINT_PULL_THRESHOLD_PX = 28;
const ALL_PHOTOS_CLOSE_HINT_WHEEL_THRESHOLD_PX = 48;
const ALL_PHOTOS_CLOSE_PULL_THRESHOLD_PX = 84;
const ALL_PHOTOS_CLOSE_WHEEL_THRESHOLD_PX = 140;
const ALL_PHOTOS_CLOSE_ANIMATION_MS = 320;
const ALL_PHOTOS_WHEEL_HINT_RESET_DELAY_MS = 180;
const ALL_PHOTOS_HISTORY_STATE_KEY = "__galleryAllPhotosLayer";
const LIGHTBOX_CLOSE_PULL_THRESHOLD_PX = 84;
const LIGHTBOX_CLOSE_WHEEL_THRESHOLD_PX = 140;
const LIGHTBOX_CLOSE_HINT_PULL_THRESHOLD_PX = 28;
const LIGHTBOX_CLOSE_HINT_WHEEL_THRESHOLD_PX = 48;
const LIGHTBOX_WHEEL_HINT_RESET_DELAY_MS = 180;
const LIGHTBOX_CLOSE_ANIMATION_MS = 320;
const LIGHTBOX_HISTORY_STATE_KEY = "__galleryLightboxLayer";
// #endregion

interface LightboxTransitionClasses {
  enterActiveClass: string;
  enterFromClass: string;
  enterToClass: string;
  leaveActiveClass: string;
  leaveFromClass: string;
  leaveToClass: string;
}

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
  const allPhotosBodyRef = ref<HTMLElement | null>(null);
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
  const allPhotosTouchLastY = ref<number | null>(null);
  const allPhotosPullDistance = ref(0);
  const allPhotosWheelDistance = ref(0);
  const isAllPhotosClosing = ref(false);
  const lightboxWheelDistance = ref(0);
  const lightboxPullDistance = ref(0);
  const isLightboxClosing = ref(false);

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

    return `${image.fullSrc}-${currentLightboxIndex.value}-${lightboxImageRenderSeed.value}`;
  });
  const currentLightboxTransitionClasses =
    computed<LightboxTransitionClasses>(() => {
      if (lightboxSlideDirection.value === "next") {
        return {
          enterActiveClass: galleryStyles.gallery__lightboxImageEnterActive,
          enterFromClass: galleryStyles.gallery__lightboxImageEnterFromNext,
          enterToClass: galleryStyles.gallery__lightboxImageEnterTo,
          leaveActiveClass: galleryStyles.gallery__lightboxImageLeaveActive,
          leaveFromClass: galleryStyles.gallery__lightboxImageLeaveFrom,
          leaveToClass: galleryStyles.gallery__lightboxImageLeaveToNext,
        };
      }

      return {
        enterActiveClass: galleryStyles.gallery__lightboxImageEnterActive,
        enterFromClass: galleryStyles.gallery__lightboxImageEnterFromPrev,
        enterToClass: galleryStyles.gallery__lightboxImageEnterTo,
        leaveActiveClass: galleryStyles.gallery__lightboxImageLeaveActive,
        leaveFromClass: galleryStyles.gallery__lightboxImageLeaveFrom,
        leaveToClass: galleryStyles.gallery__lightboxImageLeaveToPrev,
      };
    });
  const hasPrev = computed(() => currentLightboxIndex.value > 0);
  const hasNext = computed(
    () => currentLightboxIndex.value < totalImages.value - 1,
  );
  // 라이트박스 풀다운/휠 닫기 힌트 상태
  const isLightboxCloseHint = computed(
    () =>
      lightboxPullDistance.value >= LIGHTBOX_CLOSE_HINT_PULL_THRESHOLD_PX ||
      lightboxWheelDistance.value >= LIGHTBOX_CLOSE_HINT_WHEEL_THRESHOLD_PX,
  );
  const isAllPhotosCloseHint = computed(
    () =>
      allPhotosPullDistance.value >= ALL_PHOTOS_CLOSE_HINT_PULL_THRESHOLD_PX ||
      allPhotosWheelDistance.value >= ALL_PHOTOS_CLOSE_HINT_WHEEL_THRESHOLD_PX,
  );
  const allPhotosLayerMotionClass = computed(() =>
    isAllPhotosClosing.value ? galleryStyles.gallery__allPhotosLayerClosing : "",
  );
  const allPhotosPanelMotionClass = computed(() => {
    if (isAllPhotosClosing.value) {
      return galleryStyles.gallery__allPhotosPanelClosing;
    }

    if (isAllPhotosCloseHint.value) {
      return galleryStyles.gallery__allPhotosPanelPullHint;
    }

    return "";
  });
  // 라이트박스 오버레이 모션 클래스 - 닫힘 애니메이션 또는 풀다운 힌트
  const lightboxOverlayMotionClass = computed(() => {
    if (isLightboxClosing.value) {
      return galleryStyles.gallery__overlayClosing;
    }

    if (isLightboxCloseHint.value) {
      return galleryStyles.gallery__overlayPullHint;
    }

    return "";
  });
  // 라이트박스 뷰포트 모션 클래스 - 닫힘 슬라이드업 또는 풀다운 힌트
  const lightboxViewportMotionClass = computed(() => {
    if (isLightboxClosing.value) {
      return galleryStyles.gallery__lightboxViewportClosing;
    }

    if (isLightboxCloseHint.value) {
      return galleryStyles.gallery__lightboxViewportPullHint;
    }

    return "";
  });
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
  let allPhotosCloseTimerId: number | null = null;
  let allPhotosWheelHintResetTimerId: number | null = null;
  let lightboxWheelHintResetTimerId: number | null = null;
  let lightboxCloseTimerId: number | null = null;
  let hasAllPhotosHistoryEntry = false;
  let skipNextAllPhotosPopstateClose = false;
  let hasLightboxHistoryEntry = false;
  let skipNextLightboxPopstateClose = false;
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

  function clearAllPhotosCloseTimer() {
    if (allPhotosCloseTimerId == null) return;
    window.clearTimeout(allPhotosCloseTimerId);
    allPhotosCloseTimerId = null;
  }

  function clearAllPhotosWheelHintResetTimer() {
    if (allPhotosWheelHintResetTimerId == null) return;
    window.clearTimeout(allPhotosWheelHintResetTimerId);
    allPhotosWheelHintResetTimerId = null;
  }

  function scheduleAllPhotosWheelHintReset() {
    clearAllPhotosWheelHintResetTimer();
    allPhotosWheelHintResetTimerId = window.setTimeout(() => {
      allPhotosWheelDistance.value = 0;
      allPhotosWheelHintResetTimerId = null;
    }, ALL_PHOTOS_WHEEL_HINT_RESET_DELAY_MS);
  }

  function clearLightboxWheelHintResetTimer() {
    if (lightboxWheelHintResetTimerId == null) return;
    window.clearTimeout(lightboxWheelHintResetTimerId);
    lightboxWheelHintResetTimerId = null;
  }

  function scheduleLightboxWheelHintReset() {
    clearLightboxWheelHintResetTimer();
    lightboxWheelHintResetTimerId = window.setTimeout(() => {
      lightboxWheelDistance.value = 0;
      lightboxWheelHintResetTimerId = null;
    }, LIGHTBOX_WHEEL_HINT_RESET_DELAY_MS);
  }

  function clearLightboxCloseTimer() {
    if (lightboxCloseTimerId == null) return;
    window.clearTimeout(lightboxCloseTimerId);
    lightboxCloseTimerId = null;
  }

  // 라이트박스 풀다운/휠 닫기 제스처 상태 초기화
  function resetLightboxCloseGesture() {
    clearLightboxWheelHintResetTimer();
    lightboxPullDistance.value = 0;
    lightboxWheelDistance.value = 0;
  }

  function resetAllPhotosCloseGesture() {
    clearAllPhotosWheelHintResetTimer();
    allPhotosTouchLastY.value = null;
    allPhotosPullDistance.value = 0;
    allPhotosWheelDistance.value = 0;
  }

  function pushAllPhotosHistoryEntry() {
    if (typeof window === "undefined" || hasAllPhotosHistoryEntry) return;

    const currentHistoryState =
      window.history.state && typeof window.history.state === "object"
        ? window.history.state as Record<string, unknown>
        : {};

    window.history.pushState(
      {
        ...currentHistoryState,
        [ALL_PHOTOS_HISTORY_STATE_KEY]: true,
      },
      "",
      window.location.href,
    );
    hasAllPhotosHistoryEntry = true;
  }

  function pushLightboxHistoryEntry() {
    if (typeof window === "undefined" || hasLightboxHistoryEntry) return;

    const currentHistoryState =
      window.history.state && typeof window.history.state === "object"
        ? window.history.state as Record<string, unknown>
        : {};

    window.history.pushState(
      {
        ...currentHistoryState,
        [LIGHTBOX_HISTORY_STATE_KEY]: true,
      },
      "",
      window.location.href,
    );
    hasLightboxHistoryEntry = true;
  }

  function clearAllPhotosHistoryEntry() {
    if (typeof window === "undefined" || !hasAllPhotosHistoryEntry) return;

    hasAllPhotosHistoryEntry = false;
    skipNextAllPhotosPopstateClose = true;
    window.history.back();
  }

  function clearLightboxHistoryEntry() {
    if (typeof window === "undefined" || !hasLightboxHistoryEntry) return;

    hasLightboxHistoryEntry = false;
    skipNextLightboxPopstateClose = true;
    window.history.back();
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

  // lightboxImage dataset src 추출 및 현재 이미지 로드 상태 판별 사용
  function resolveLightboxImageSrc(event: Event): string | null {
    const imageElement = event.currentTarget;
    if (!(imageElement instanceof HTMLImageElement)) {
      return null;
    }

    return imageElement.dataset.imageSrc ?? null;
  }

  // 라이트박스 현재 인덱스 기준 다음 2장 선로딩 사용
  function preloadUpcomingLightboxImages(baseIndex: number) {
    for (let offset = 0; offset <= 2; offset += 1) {
      const targetImage = images.value[baseIndex + offset];
      if (!targetImage || isImageCached(targetImage.fullSrc)) {
        continue;
      }

      void preloadImage(targetImage.fullSrc);
    }
  }

  function resolveLightboxIndex(index: number, imageSrc: string): number {
    const safeIndex = clampLightboxIndex(index);
    const currentImage = images.value[safeIndex];

    if (currentImage && currentImage.fullSrc === imageSrc) {
      return safeIndex;
    }

    const matchedIndex = images.value.findIndex(
      (image: GalleryImage) => image.fullSrc === imageSrc,
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
    markImageCached(image.thumbSrc);
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

  function isAllPhotosBodyAtTop(): boolean {
    const bodyElement = allPhotosBodyRef.value;
    if (!bodyElement) return false;
    return bodyElement.scrollTop <= 0;
  }

  // allPhotosLayer 닫힘 애니메이션 완료 후 표시 상태 해제
  function finalizeAllPhotosLayerClose() {
    clearAllPhotosCloseTimer();
    isAllPhotosLayerOpen.value = false;
    isAllPhotosClosing.value = false;
    syncBodyScrollState();
  }

  function startAllPhotosLayerClose() {
    if (!isAllPhotosLayerOpen.value || isAllPhotosClosing.value) return;

    isAllPhotosClosing.value = true;
    resetAllPhotosCloseGesture();
    clearAllPhotosCloseTimer();
    allPhotosCloseTimerId = window.setTimeout(() => {
      finalizeAllPhotosLayerClose();
    }, ALL_PHOTOS_CLOSE_ANIMATION_MS);
  }

  // allPhotosLayer 닫힘 모션 시작 및 타이머 종료 처리
  function closeAllPhotosLayer() {
    clearAllPhotosHistoryEntry();
    startAllPhotosLayerClose();
  }

  // allPhotosBody 상단 추가 휠 입력 누적 감지 후 레이어 닫기
  function onAllPhotosWheel(event: WheelEvent) {
    if (!isAllPhotosLayerOpen.value || isAllPhotosClosing.value) return;

    if (!isAllPhotosBodyAtTop()) {
      allPhotosWheelDistance.value = 0;
      return;
    }

    if (event.deltaY >= 0) {
      allPhotosWheelDistance.value = 0;
      return;
    }

    allPhotosWheelDistance.value += Math.abs(event.deltaY);

    if (allPhotosWheelDistance.value >= ALL_PHOTOS_CLOSE_WHEEL_THRESHOLD_PX) {
      closeAllPhotosLayer();
      return;
    }

    scheduleAllPhotosWheelHintReset();
  }

  // allPhotosBody 상단 풀다운 누적 감지 후 레이어 닫기
  function onAllPhotosTouchStart(event: TouchEvent) {
    if (isAllPhotosClosing.value) return;

    const primaryTouch = event.touches[0];
    if (!primaryTouch) return;

    allPhotosTouchLastY.value = primaryTouch.clientY;
    allPhotosPullDistance.value = 0;
  }

  function onAllPhotosTouchMove(event: TouchEvent) {
    if (!isAllPhotosLayerOpen.value || isAllPhotosClosing.value) return;

    const primaryTouch = event.touches[0];
    const lastTouchY = allPhotosTouchLastY.value;

    if (!primaryTouch || lastTouchY == null) {
      resetAllPhotosCloseGesture();
      return;
    }

    const deltaY = primaryTouch.clientY - lastTouchY;
    allPhotosTouchLastY.value = primaryTouch.clientY;

    if (!isAllPhotosBodyAtTop()) {
      allPhotosPullDistance.value = 0;
      return;
    }

    if (deltaY <= 0) {
      allPhotosPullDistance.value = 0;
      return;
    }

    allPhotosPullDistance.value += deltaY;

    if (allPhotosPullDistance.value >= ALL_PHOTOS_CLOSE_PULL_THRESHOLD_PX) {
      closeAllPhotosLayer();
    }
  }

  function onAllPhotosTouchEnd() {
    resetAllPhotosCloseGesture();
  }
  // #endregion

  // #region 라이트박스 제어
  // 라이트박스 닫힘 완료 처리 - 상태 초기화
  function finalizeLightboxClose() {
    clearLightboxCloseTimer();
    isLightboxOpen.value = false;
    isLightboxClosing.value = false;
    lightboxImageRenderSeed.value = 0;
    lightboxSlideDirection.value = "next";
    isLightboxImageLoaded.value = false;
    resetLightboxTouchPosition();
    resetLightboxCloseGesture();
    syncBodyScrollState();
  }

  // 라이트박스 닫힘 애니메이션 시작
  function startLightboxClose() {
    if (!isLightboxOpen.value || isLightboxClosing.value) return;

    isLightboxClosing.value = true;
    resetLightboxCloseGesture();
    clearLightboxCloseTimer();
    lightboxCloseTimerId = window.setTimeout(() => {
      finalizeLightboxClose();
    }, LIGHTBOX_CLOSE_ANIMATION_MS);
  }

  // popstate 용 즉시 닫기 - 애니메이션 없이
  function applyLightboxClosedState() {
    clearLightboxCloseTimer();
    isLightboxOpen.value = false;
    isLightboxClosing.value = false;
    lightboxImageRenderSeed.value = 0;
    lightboxSlideDirection.value = "next";
    isLightboxImageLoaded.value = false;
    resetLightboxTouchPosition();
    resetLightboxCloseGesture();
    syncBodyScrollState();
  }

  function openLightbox(index: number, imageSrc: string) {
    if (totalImages.value === 0) return;

    if (!isLightboxOpen.value) {
      pushLightboxHistoryEntry();
    }
    lightboxSlideDirection.value = "next";
    currentLightboxIndex.value = resolveLightboxIndex(index, imageSrc);
    lightboxImageRenderSeed.value += 1;
    const selectedImage = images.value[currentLightboxIndex.value];
    const isSelectedImageCached =
      selectedImage == null ? false : isImageCached(selectedImage.fullSrc);
    isLightboxImageLoaded.value = isSelectedImageCached;
    isLightboxOpen.value = true;
    syncBodyScrollState();

    if (selectedImage) {
      preloadUpcomingLightboxImages(currentLightboxIndex.value);
    }
  }

  function closeLightbox() {
    clearLightboxHistoryEntry();
    startLightboxClose();
  }

  // 전체보기 레이어 열기 - 이전 로드 상태 유지
  function openAllPhotosLayer() {
    if (totalImages.value === 0) return;
    clearAllPhotosCloseTimer();
    isAllPhotosClosing.value = false;
    isAllPhotosLayerOpen.value = true;
    resetAllPhotosCloseGesture();
    pushAllPhotosHistoryEntry();
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
    const isNextImageCached = nextImage == null ? false : isImageCached(nextImage.fullSrc);
    isLightboxImageLoaded.value = isNextImageCached;

    if (nextImage) {
      preloadUpcomingLightboxImages(nextIndex);
    }
  }

  function slideNext() {
    if (!hasNext.value) return;
    const nextIndex = currentLightboxIndex.value + 1;
    lightboxSlideDirection.value = "next";
    lightboxImageRenderSeed.value += 1;
    currentLightboxIndex.value = nextIndex;

    const nextImage = images.value[nextIndex];
    const isNextImageCached = nextImage == null ? false : isImageCached(nextImage.fullSrc);
    isLightboxImageLoaded.value = isNextImageCached;

    if (nextImage) {
      preloadUpcomingLightboxImages(nextIndex);
    }
  }

  function onLightboxImageLoad(event: Event) {
    const imageSrc = resolveLightboxImageSrc(event);
    if (imageSrc == null) return;

    markImageCached(imageSrc);

    if (currentLightboxImage.value?.fullSrc !== imageSrc) {
      return;
    }

    isLightboxImageLoaded.value = true;
  }

  function onLightboxImageError(event: Event) {
    const imageSrc = resolveLightboxImageSrc(event);
    if (imageSrc == null) return;

    if (currentLightboxImage.value?.fullSrc !== imageSrc) {
      return;
    }

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

  // 라이트박스 터치 시작 좌표 저장 - 좌우 스와이프/풀다운 판별 기준 사용
  function onLightboxTouchStart(event: TouchEvent) {
    const primaryTouch = event.touches[0];
    if (!primaryTouch) return;

    lightboxTouchStartX.value = primaryTouch.clientX;
    lightboxTouchStartY.value = primaryTouch.clientY;
    lightboxPullDistance.value = 0;
  }

  function resetLightboxTouchPosition() {
    lightboxTouchStartX.value = null;
    lightboxTouchStartY.value = null;
  }

  // 라이트박스 터치 이동 - 풀다운 누적량 갱신
  function onLightboxTouchMove(event: TouchEvent) {
    if (!isLightboxOpen.value) return;

    const startY = lightboxTouchStartY.value;
    const primaryTouch = event.touches[0];
    if (startY == null || !primaryTouch) return;

    const deltaY = primaryTouch.clientY - startY;
    lightboxPullDistance.value = deltaY > 0 ? deltaY : 0;
  }

  // 라이트박스 터치 종료 - 수평 스와이프 또는 수직 풀다운 닫기 처리
  function onLightboxTouchEnd(event: TouchEvent) {
    const startX = lightboxTouchStartX.value;
    const startY = lightboxTouchStartY.value;
    const primaryTouch = event.changedTouches[0];

    if (startX == null || startY == null || !primaryTouch) {
      resetLightboxTouchPosition();
      resetLightboxCloseGesture();
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
    } else if (deltaY >= LIGHTBOX_CLOSE_PULL_THRESHOLD_PX) {
      closeLightbox();
    }

    resetLightboxTouchPosition();
    resetLightboxCloseGesture();
  }

  function onLightboxTouchCancel() {
    resetLightboxTouchPosition();
    resetLightboxCloseGesture();
  }

  // 라이트박스 위로 휠 누적 감지 후 닫기
  function onLightboxWheel(event: WheelEvent) {
    if (!isLightboxOpen.value) return;

    if (event.deltaY >= 0) {
      lightboxWheelDistance.value = 0;
      return;
    }

    lightboxWheelDistance.value += Math.abs(event.deltaY);

    if (lightboxWheelDistance.value >= LIGHTBOX_CLOSE_WHEEL_THRESHOLD_PX) {
      closeLightbox();
      return;
    }

    scheduleLightboxWheelHintReset();
  }

  function onWindowPopstate() {
    if (skipNextLightboxPopstateClose) {
      skipNextLightboxPopstateClose = false;
      return;
    }

    if (skipNextAllPhotosPopstateClose) {
      skipNextAllPhotosPopstateClose = false;
      return;
    }

    if (isLightboxOpen.value && hasLightboxHistoryEntry) {
      hasLightboxHistoryEntry = false;
      applyLightboxClosedState();
      return;
    }

    if (!isAllPhotosLayerOpen.value || !hasAllPhotosHistoryEntry) {
      return;
    }

    hasAllPhotosHistoryEntry = false;
    startAllPhotosLayerClose();
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
    window.addEventListener("popstate", onWindowPopstate);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", onKeydown);
    window.removeEventListener("resize", onWindowResize);
    window.removeEventListener("popstate", onWindowPopstate);
    thumbViewportRef.value?.removeEventListener("scroll", onThumbScroll);

    clearThumbLayoutTimer();
    clearThumbScrollRaf();
    clearResizeRaf();
    clearThumbScrollAnimationRaf();
    clearAllPhotosCloseTimer();
    clearLightboxCloseTimer();
    clearAllPhotosWheelHintResetTimer();
    clearLightboxWheelHintResetTimer();
    resetAllPhotosCloseGesture();
    resetLightboxCloseGesture();
    hasLightboxHistoryEntry = false;
    hasAllPhotosHistoryEntry = false;
    skipNextLightboxPopstateClose = false;
    skipNextAllPhotosPopstateClose = false;
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
    allPhotosBodyRef,
    images,
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
  };
}
