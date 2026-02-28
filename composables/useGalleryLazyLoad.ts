import { onUnmounted, ref } from "vue";

// IntersectionObserver 기반 갤러리 썸네일 레이지 로딩 - rootMargin으로 진입 전 선제 로드
export function useGalleryLazyLoad() {
  const readySet = ref(new Set<number>());
  const loadedSet = ref(new Set<number>());

  // SSR 환경 대응 - window 없을 때 observer null 유지
  let obs: IntersectionObserver | null = null;

  if (typeof window !== "undefined") {
    obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.lazyIdx);
          // 썸네일 렌더링 시작 인덱스 반영 - Set 재할당으로 반응성 트리거
          readySet.value = new Set([...readySet.value, idx]);
          obs?.unobserve(entry.target);
        });
      },
      // 뷰포트 300px 전 선제 로드
      { rootMargin: "300px 0px" },
    );
  }

  function isReady(index: number): boolean {
    return readySet.value.has(index);
  }

  function isLoaded(index: number): boolean {
    return loadedSet.value.has(index);
  }

  function markLoaded(index: number) {
    if (loadedSet.value.has(index)) return;
    // 실제 이미지 load 완료 인덱스 반영 - overlay 제거 상태 동기화
    loadedSet.value = new Set([...loadedSet.value, index]);
  }

  // v-for :ref 콜백 - 마운트 시 observe, 언마운트 시 null 전달
  function registerThumb(el: Element | null, index: number) {
    if (!el) return;
    (el as HTMLElement).dataset.lazyIdx = String(index);
    if (obs) {
      obs.observe(el);
    } else {
      // observer 미지원 환경 - 즉시 렌더링 시작
      readySet.value = new Set([...readySet.value, index]);
    }
  }

  onUnmounted(() => {
    obs?.disconnect();
  });

  return { isReady, isLoaded, markLoaded, registerThumb };
}
