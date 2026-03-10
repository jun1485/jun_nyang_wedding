import { MD_BREAKPOINT, SM_BREAKPOINT, withEmotionLabels } from "./core";

// #region 카운트다운 스타일
const countdownStyles = withEmotionLabels("countdown", {
  countdown__root: `
    text-align: center;
  `,
  countdown__calendarPaper: `
    border-radius: 0.75rem;
    margin: 0 auto 1.5rem;
    border: 1px solid rgba(199, 186, 157, 0.32);
    background: rgba(255, 255, 255, 0.72);
    box-shadow: 0 10px 22px rgba(149, 133, 92, 0.08);
    padding: 0.55rem 0.68rem 0.48rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      width: min(14rem, 60vw);
    }
  `,
  countdown__calendarHead: `
    display: flex;
    align-items: flex-end;
    gap: 0.4rem;
  `,
  countdown__calendarMonthNumber: `
    margin: 0;
    color: #d64e75;
    font-family: var(--font-main), sans-serif;
    font-size: 2.4rem;
    line-height: 0.9;
    font-weight: 700;
    letter-spacing: 0.02em;
  `,
  countdown__calendarMonthLabel: `
    margin: 0 0 0.18rem;
    color: #8f91ad;
    font-size: calc(0.62rem + 3px);
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  `,
  countdown__calendarGuide: `
    margin: 0.22rem 0 0.4rem;
    height: 0.92rem;
    background-image: linear-gradient(
      to right,
      rgba(208, 197, 172, 0.55),
      rgba(208, 197, 172, 0.55)
    );
    background-repeat: no-repeat;
    background-size: 100% 1px;
    background-position: center;
  `,
  countdown__calendarGrid: `
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    column-gap: 0.16rem;
    row-gap: 0.2rem;
  `,
  countdown__calendarCell: `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 1.05rem;
    color: #8697c2;
    font-family: var(--font-main), sans-serif;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.01em;
    margin: 0.2rem 0;
  `,
  countdown__calendarCellEmpty: `
    opacity: 0;
  `,
  countdown__calendarCellSunday: `
    color: #b49a5e;
  `,
  countdown__calendarCellSaturday: `
    color: #7f95c4;
  `,
  countdown__calendarCellTarget: `
    position: relative;
    z-index: 0;
    isolation: isolate;
    min-height: 1.7rem;
    color: #cf2b3a;
    font-size: calc(0.98rem + 3px);
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.68);

    &::before {
      content: "";
      position: absolute;
      inset: 50% auto auto 50%;
      z-index: -1;
      width: 2.2rem;
      height: 1.95rem;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 36'%3E%3Cpath d='M20 33.2c-.6 0-1.2-.2-1.7-.6l-3.1-2.8C7 22.3 1.2 17 1.2 10.4 1.2 5.3 5.1 1.4 10.2 1.4c3.9 0 7.4 2 9.8 5.1 2.4-3.1 5.9-5.1 9.8-5.1 5.1 0 9 3.9 9 9 0 6.6-5.4 11.5-13.1 18.6l-3.1 2.8c-.5.4-1.1.6-1.7.6Z' fill='%23ffd3de' stroke='%23f06d95' stroke-width='1.8'/%3E%3Cpath d='M12.6 8.3c1-.9 2.4-1.5 3.9-1.5 1.4 0 2.7.4 3.5 1' fill='none' stroke='%23fff8fb' stroke-width='1.35' stroke-linecap='round' opacity='.95'/%3E%3C/svg%3E");
      pointer-events: none;
      transform: translate(-50%, -50%);
    }
  `,
  countdown__title: `
    margin: 0;
    color: #6f5360;
    font-family: var(--font-main), sans-serif;
    font-weight: 700;
    letter-spacing: 0.06em;
    font-size: calc(1.075rem + 3px);

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1rem;
    }
  `,
  countdown__grid: `
    margin-top: 0.75rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.75rem;
    }
  `,
  countdown__card: `
    border-radius: 0.9rem;
    border: 1px solid rgba(231, 90, 132, 0.22);
    background: rgba(255, 255, 255, 0.84);
    padding: 0.7rem 0.45rem;
  `,
  countdown__value: `
    margin: 0;
    color: #422f39;
    font-size: clamp(1.35rem, 5vw, 2.05rem);
    font-weight: 700;
    line-height: 1.1;
  `,
  countdown__label: `
    margin: 0.2rem 0 0;
    color: #8d6f7d;
    font-size: calc(0.72rem + 3px);
    letter-spacing: 0.07em;
    text-transform: uppercase;
  `,
} as const);
// #endregion

// #region 갤러리 스타일
const galleryStyles = withEmotionLabels("gallery", {
  gallery__sectionOffset: `
    && {
      padding: 0.25rem 0 0;
    }

    @media (min-width: ${SM_BREAKPOINT}) {
      && {
        padding: 0.5rem 0 4.5rem;
      }
    }
  `,
  gallery__header: `
    text-align: center;
    padding-right: 1rem;
    padding-left: 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding-right: 1.5rem;
      padding-left: 1.5rem;
    }
  `,
  gallery__title: `
    font-size: 1.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  gallery__subtitle: `
    margin-top: 0.5rem;
  `,
  // 갤러리 셸 배경 레이어 사용
  gallery__carouselShell: `
    position: relative;
    margin-top: 1.25rem;
    padding: 0.65rem 0 0.9rem;

    &::before {
      content: "";
      position: absolute;
      inset: 0.2rem 0.75rem 0.35rem;
      z-index: 0;
      border-radius: 1.35rem;
      background: linear-gradient(
        135deg,
        rgba(255, 237, 243, 0.78) 0%,
        rgba(255, 255, 255, 0.5) 54%,
        rgba(255, 234, 217, 0.72) 100%
      );
      box-shadow: 0 18px 36px rgba(205, 88, 124, 0.14);
      pointer-events: none;
    }

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 0.85rem 0 1rem;

      &::before {
        inset-inline: 1.25rem;
      }
    }
  `,
  gallery__viewAllButtonWrap: `
    margin-top: 0.35rem;
    display: flex;
    justify-content: center;
    padding: 0 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      margin-top: 0.65rem;
      padding: 0 1.5rem;
    }
  `,
  gallery__viewAllButton: `
    min-width: 11.75rem;
    border: 0;
    border-radius: 9999px;
    margin-bottom: 1.5rem;
    background: linear-gradient(
      135deg,
      rgba(214, 78, 117, 0.96),
      rgba(227, 102, 138, 0.92)
    );
    color: #fff;
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    padding: 0.58rem 1.15rem;
    box-shadow: 0 10px 18px rgba(190, 72, 108, 0.28);
    cursor: pointer;
    transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      opacity 180ms ease;

    &:active {
      transform: scale(0.97);
      box-shadow: 0 8px 14px rgba(190, 72, 108, 0.24);
    }

    &:disabled {
      opacity: 0.45;
      cursor: default;
      box-shadow: none;
    }
  `,
  gallery__allPhotosLayer: `
    position: fixed;
    inset: 0;
    z-index: 68;
    background: rgba(25, 17, 22, 0.58);
    animation: gallery-all-photos-fade-in 220ms ease-out both;
    transition: background-color 180ms ease;

    @keyframes gallery-all-photos-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  // allPhotosLayer 상단 닫힘 배경 페이드 적용
  gallery__allPhotosLayerClosing: `
    animation: gallery-all-photos-fade-out 320ms cubic-bezier(0.3, 0.7, 0, 1)
      both;

    @keyframes gallery-all-photos-fade-out {
      0% {
        opacity: 1;
        background: rgba(25, 17, 22, 0.58);
      }
      100% {
        opacity: 0;
        background: rgba(25, 17, 22, 0.08);
      }
    }
  `,
  gallery__allPhotosPanel: `
    width: min(38rem, 100%);
    height: 100%;
    margin: 0 auto;
    background: #f7f7f7;
    display: flex;
    flex-direction: column;
    contain: layout paint;
    transform-origin: top center;
    will-change: transform, opacity;
    transition:
      transform 160ms cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 160ms ease;
  `,
  // allPhotosPanel 상단 당김 힌트 모션 적용
  gallery__allPhotosPanelPullHint: `
    transform: translateY(-0.18rem) scale(0.998);
    box-shadow: 0 14px 24px rgba(31, 22, 27, 0.08);
  `,
  // allPhotosPanel 상단 닫힘 슬라이드아웃 모션 적용
  gallery__allPhotosPanelClosing: `
    pointer-events: none;
    animation: gallery-all-photos-panel-close
      320ms cubic-bezier(0.3, 0.7, 0, 1) both;

    @keyframes gallery-all-photos-panel-close {
      0% {
        transform: translateY(-0.12rem) scale(0.999);
        opacity: 1;
      }
      38% {
        transform: translateY(-0.55rem) scale(0.997);
        opacity: 0.98;
      }
      100% {
        transform: translateY(-1.7rem) scale(0.992);
        opacity: 0.88;
      }
    }
  `,
  gallery__allPhotosHeader: `
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: calc(max(0.6rem, env(safe-area-inset-top)) + 0.5rem) 3.2rem 0.8rem;
    border-bottom: 1px solid rgba(220, 220, 220, 0.9);
    background: rgba(247, 247, 247, 0.98);

    @media (min-width: ${SM_BREAKPOINT}) {
      backdrop-filter: blur(6px);
    }
  `,
  gallery__allPhotosTitle: `
    margin: 0;
    color: #3b3237;
    font-size: 1.15rem;
    font-weight: 500;
    letter-spacing: 0.02em;
  `,
  gallery__allPhotosCloseButton: `
    position: absolute;
    right: 0.7rem;
    top: 50%;
    display: inline-flex;
    width: 2.5rem;
    height: 2.5rem;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 9999px;
    background: transparent;
    color: #7a7176;
    cursor: pointer;
    transform: translateY(-50%);

    &:active {
      transform: translateY(-50%) scale(0.95);
    }
  `,
  gallery__allPhotosBody: `
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
    padding:
      0.6rem 0.65rem
      calc(max(0.65rem, env(safe-area-inset-bottom)) + 0.4rem);

    @media (min-width: ${SM_BREAKPOINT}) {
      padding-right: 0.85rem;
      padding-left: 0.85rem;
    }
  `,
  gallery__allPhotosGrid: `
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.62rem;
    contain: layout paint style;

    @media (min-width: ${SM_BREAKPOINT}) {
      gap: 0.78rem;
    }
  `,
  gallery__allPhotosItemButton: `
    border: 0;
    border-radius: 0.1rem;
    padding: 0;
    background: transparent;
    overflow: hidden;
    cursor: pointer;
    contain: layout paint style;
    content-visibility: auto;
    contain-intrinsic-size: auto 14rem;

    &:active {
      transform: scale(0.985);
    }
  `,
  gallery__allPhotosMedia: `
    position: relative;
    overflow: hidden;
    aspect-ratio: 3 / 4;
    background: #e9e2e7;
    contain: paint;
  `,
  // allPhotosImage 이미지 지연 시 skeleton 하단 배치 유지
  gallery__allPhotosImage: `
    position: absolute;
    inset: 0;
    z-index: 2;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: transparent;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    transition: opacity 220ms ease;
  `,
  gallery__allPhotosImageVisible: `
    opacity: 1;
  `,
  gallery__allPhotosImageHidden: `
    opacity: 0;
  `,
  // allPhotosSkeleton 로딩 shimmer 및 완료 배경 전환 유지
  gallery__allPhotosSkeleton: `
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(90deg, #dbd3d9 0%, #efe8ec 50%, #dbd3d9 100%);
    background-size: 200% 100%;
    animation: gallery-all-photos-skeleton-shimmer 1.5s ease-in-out infinite;

    @keyframes gallery-all-photos-skeleton-shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `,
  gallery__allPhotosSkeletonDone: `
    animation: none;
    background: #dbd3d9;
  `,
  gallery__allPhotosLoadingOverlay: `
    position: absolute;
    inset: 0;
    z-index: 3;
    display: grid;
    place-items: center;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.2) 100%
    );
    pointer-events: none;
  `,
  gallery__allPhotosLoadingSpinner: `
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 9999px;
    border: 2px solid rgba(122, 113, 118, 0.24);
    border-top-color: rgba(122, 113, 118, 0.92);
    animation: gallery-all-photos-spinner-rotate 800ms linear infinite;

    @keyframes gallery-all-photos-spinner-rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,
  // gallery__carouselViewport Embla viewport 영역 고정, 스크롤 제스처 충돌 최소화 유지
  gallery__carouselViewport: `
    position: relative;
    z-index: 1;
    margin-top: 0;
    overflow-x: auto;
    overflow-y: visible;
    padding: 0 1.15rem 0.25rem;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    touch-action: pan-x pan-y;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 0 1.85rem;
    }
  `,
  // carouselContainer Embla 가로 정렬 및 transform 최적화 적용
  gallery__carouselContainer: `
    display: flex;
    align-items: stretch;
    gap: 0.7rem;
  `,
  gallery__carouselSlide: `
    min-width: 0;
    flex: 0 0 72%;
    padding-bottom: 0.7rem;
    opacity: 1;
    transform: none;
    filter: none;
    scroll-snap-align: center;

    @media (min-width: 360px) {
      flex: 0 0 56%;
    }

    @media (min-width: ${SM_BREAKPOINT}) {
      flex: 0 0 32%;
    }

    @media (min-width: ${MD_BREAKPOINT}) {
      flex: 0 0 24%;
    }
  `,
  gallery__carouselNavButton: `
    position: absolute;
    top: calc(50% - 0.35rem);
    z-index: 2;
    display: inline-flex;
    width: 2.35rem;
    height: 2.35rem;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.84);
    background: linear-gradient(
      140deg,
      rgba(255, 255, 255, 0.95),
      rgba(254, 236, 244, 0.92)
    );
    color: #8d4b63;
    box-shadow: 0 8px 18px rgba(190, 87, 118, 0.22);
    transform: translateY(-50%);
    transition:
      transform 180ms ease,
      opacity 180ms ease,
      box-shadow 180ms ease;
    cursor: pointer;

    &:active {
      transform: translateY(-50%) scale(0.94);
    }

    &:disabled {
      opacity: 0;
      pointer-events: none;
      box-shadow: none;
    }
  `,
  gallery__carouselNavButtonLeft: `
    left: 0.2rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      left: 0.55rem;
    }
  `,
  gallery__carouselNavButtonRight: `
    right: 0.2rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      right: 0.55rem;
    }
  `,
  gallery__thumbButton: `
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    border-radius: 1rem;
    border: 0;
    padding: 0;
    background: #f7edf2;
    appearance: none;
    -webkit-appearance: none;
    box-shadow: 0 10px 16px rgba(26, 18, 22, 0.14);
    outline: none;
    cursor: pointer;
    transition: transform 160ms ease;

    &:focus-visible {
      box-shadow:
        0 0 0 3px rgba(240, 109, 149, 0.35),
        0 10px 16px rgba(26, 18, 22, 0.14);
    }

    &:active {
      transform: scale(0.97);
    }
  `,
  gallery__thumbImage: `
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 240ms ease;
  `,
  gallery__thumbImageVisible: `
    opacity: 1;
  `,
  gallery__thumbImageHidden: `
    opacity: 0;
  `,
  // thumbPlaceholder 이미지 미로드 상태 shimmer placeholder 사용
  gallery__thumbPlaceholder: `
    display: block;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f0e6ec 0%, #f8f0f4 50%, #f0e6ec 100%);
    background-size: 200% 100%;
    animation: gallery-skeleton-shimmer 1.5s ease-in-out infinite;

    @keyframes gallery-skeleton-shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `,
  // thumbLoadingOverlay 네트워크 로딩 상태 오버레이 및 스피너 표시
  gallery__thumbLoadingOverlay: `
    position: absolute;
    inset: 0;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 0.45rem;
    background: linear-gradient(
      180deg,
      rgba(29, 18, 24, 0.26) 0%,
      rgba(35, 23, 29, 0.44) 100%
    );
    pointer-events: none;
  `,
  gallery__thumbLoadingSpinner: `
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: rgba(255, 255, 255, 0.96);
    animation: gallery-thumb-spinner-rotate 820ms linear infinite;

    @keyframes gallery-thumb-spinner-rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,
  gallery__thumbLoadingText: `
    color: rgba(255, 255, 255, 0.94);
    font-size: calc(0.72rem + 3px);
    font-weight: 700;
    letter-spacing: 0.04em;
  `,
  gallery__thumbCaption: `
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(31, 19, 24, 0.66), transparent);
    padding: 0.6rem 0.78rem 0.52rem;
    text-align: left;
    font-size: calc(0.72rem + 3px);
    letter-spacing: 0.04em;
    color: #fff;
  `,
  // overlay 라이트박스 오버레이 고정 및 스와이프 영역 분리 적용
  gallery__overlay: `
    position: fixed;
    inset: 0;
    z-index: 70;
    overflow: hidden;
    background: rgba(30, 16, 24, 0.95);
    animation: gallery-overlay-fade-in 220ms ease-out both;

    @keyframes gallery-overlay-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  // 라이트박스 풀다운/휠 닫기 힌트 모션 적용
  gallery__overlayPullHint: `
    background: rgba(30, 16, 24, 0.82);
    transition: background 160ms ease;
  `,
  // 라이트박스 닫힘 배경 페이드아웃 - 전체보기 레이어 닫힘과 동일 패턴 적용
  gallery__overlayClosing: `
    animation: gallery-overlay-close 320ms cubic-bezier(0.3, 0.7, 0, 1) both;

    @keyframes gallery-overlay-close {
      0% {
        opacity: 1;
        background: rgba(30, 16, 24, 0.95);
      }
      100% {
        opacity: 0;
        background: rgba(30, 16, 24, 0.08);
      }
    }
  `,
  // lightboxViewport Embla viewport 및 track 중앙 배치 사용
  gallery__lightboxViewport: `
    width: 100%;
    height: 100%;
    overflow: hidden;
    touch-action: pan-x pan-y;
    will-change: transform, opacity;
    transform-origin: top center;
    transition:
      transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 160ms ease;
  `,
  // 라이트박스 뷰포트 풀다운/휠 힌트 모션 - 전체보기 패널 힌트와 동일 패턴
  gallery__lightboxViewportPullHint: `
    transform: translateY(-0.18rem) scale(0.998);
    box-shadow: 0 14px 24px rgba(31, 22, 27, 0.08);
  `,
  // 라이트박스 뷰포트 닫힘 슬라이드업 + 스케일다운 - 전체보기 패널 닫힘과 동일 패턴
  gallery__lightboxViewportClosing: `
    pointer-events: none;
    animation: gallery-lightbox-viewport-close
      320ms cubic-bezier(0.3, 0.7, 0, 1) both;

    @keyframes gallery-lightbox-viewport-close {
      0% {
        transform: translateY(-0.12rem) scale(0.999);
        opacity: 1;
      }
      38% {
        transform: translateY(-0.55rem) scale(0.997);
        opacity: 0.98;
      }
      100% {
        transform: translateY(-1.7rem) scale(0.992);
        opacity: 0.88;
      }
    }
  `,
  gallery__lightboxContainer: `
    display: flex;
    height: 100%;
    will-change: transform;
  `,
  gallery__lightboxSlide: `
    min-width: 0;
    flex: 0 0 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  `,
  // lightboxMedia enter/leave 중첩 이미지 중앙 정렬 및 잘림 방지 유지
  gallery__lightboxMedia: `
    position: relative;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    overflow: hidden;
  `,
  // lightboxLoadingOverlay 이미지 로딩 상태 스피너 및 안내 문구 고정
  gallery__lightboxLoadingOverlay: `
    position: absolute;
    inset: 0;
    z-index: 2;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 0.55rem;
    pointer-events: none;
  `,
  gallery__lightboxLoadingSpinner: `
    width: 2.15rem;
    height: 2.15rem;
    border-radius: 9999px;
    border: 2px solid rgba(255, 255, 255, 0.25);
    border-top-color: rgba(255, 255, 255, 0.96);
    animation: gallery-lightbox-spinner-rotate 900ms linear infinite;

    @keyframes gallery-lightbox-spinner-rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,
  gallery__lightboxLoadingText: `
    color: rgba(255, 255, 255, 0.92);
    font-size: calc(0.83rem + 3px);
    font-weight: 700;
    letter-spacing: 0.03em;
  `,

  gallery__closeButton: `
    position: absolute;
    right: 0.75rem;
    top: max(0.75rem, env(safe-area-inset-top));
    z-index: 71;
    display: inline-flex;
    width: 2.75rem;
    height: 2.75rem;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    backdrop-filter: blur(4px);
    cursor: pointer;
  `,
  gallery__icon: `
    width: 1.25rem;
    height: 1.25rem;
  `,
  // lightboxImage 이미지 비율 유지 및 화면 중앙 배치
  gallery__lightboxImage: `
    position: absolute;
    inset: 0;
    margin: auto;
    max-height: 84svh;
    max-width: 92vw;
    object-fit: contain;
    display: block;
    opacity: 1;
    backface-visibility: hidden;
    will-change: transform, opacity;
    transform: translate3d(0, 0, 0) scale(1);
  `,
  // lightboxImageEnterActive 다음/이전 공통 진입 전환 시간 적용
  gallery__lightboxImageEnterActive: `
    transition:
      transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 360ms ease-out;

    @media (prefers-reduced-motion: reduce) {
      transition: opacity 120ms ease-out;
    }
  `,
  // lightboxImageEnterFromNext 다음 이동 진입 시작 위치 적용
  gallery__lightboxImageEnterFromNext: `
    opacity: 0;
    transform: translate3d(56px, 0, 0) scale(0.982);

    @media (prefers-reduced-motion: reduce) {
      transform: translate3d(0, 0, 0) scale(1);
    }
  `,
  // lightboxImageEnterFromPrev 이전 이동 진입 시작 위치 적용
  gallery__lightboxImageEnterFromPrev: `
    opacity: 0;
    transform: translate3d(-56px, 0, 0) scale(0.982);

    @media (prefers-reduced-motion: reduce) {
      transform: translate3d(0, 0, 0) scale(1);
    }
  `,
  // lightboxImageEnterTo 진입 완료 상태 복원
  gallery__lightboxImageEnterTo: `
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  `,
  // lightboxImageLeaveActive 다음/이전 공통 이탈 전환 시간 적용
  gallery__lightboxImageLeaveActive: `
    transition:
      transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 320ms ease-out;
    pointer-events: none;

    @media (prefers-reduced-motion: reduce) {
      transition: opacity 120ms ease-out;
    }
  `,
  // lightboxImageLeaveFrom 이탈 시작 상태 고정
  gallery__lightboxImageLeaveFrom: `
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  `,
  // lightboxImageLeaveToNext 다음 이동 기존 이미지 이탈 방향 적용
  gallery__lightboxImageLeaveToNext: `
    opacity: 0;
    transform: translate3d(-56px, 0, 0) scale(0.986);

    @media (prefers-reduced-motion: reduce) {
      transform: translate3d(0, 0, 0) scale(1);
    }
  `,
  // lightboxImageLeaveToPrev 이전 이동 기존 이미지 이탈 방향 적용
  gallery__lightboxImageLeaveToPrev: `
    opacity: 0;
    transform: translate3d(56px, 0, 0) scale(0.986);

    @media (prefers-reduced-motion: reduce) {
      transform: translate3d(0, 0, 0) scale(1);
    }
  `,
  gallery__navButton: `
    position: absolute;
    top: 50%;
    z-index: 72;
    display: inline-flex;
    width: 3rem;
    height: 3rem;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    background: rgba(28, 20, 24, 0.52);
    color: #fff;
    backdrop-filter: blur(4px);
    transform: translateY(-50%);
    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.28);
    cursor: pointer;
    transition:
      transform 180ms ease,
      background-color 180ms ease,
      border-color 180ms ease;

    &:active {
      transform: translateY(-50%) scale(0.92);
      background: rgba(28, 20, 24, 0.64);
      border-color: rgba(255, 255, 255, 0.85);
    }

    &:disabled {
      opacity: 0.24;
      cursor: default;
      pointer-events: none;
    }
  `,
  gallery__navButtonLeft: `
    left: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      left: 1rem;
    }
  `,
  gallery__navButtonRight: `
    right: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      right: 1rem;
    }
  `,
  gallery__counter: `
    position: absolute;
    left: 50%;
    bottom: calc(max(0.75rem, env(safe-area-inset-bottom)) + 3.25rem);
    z-index: 72;
    transform: translateX(-50%);
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.15);
    padding: 0.25rem 0.75rem;
    font-size: calc(0.75rem + 3px);
    color: #fff;
    backdrop-filter: blur(4px);
  `,
  gallery__lightboxControlBar: `
    position: absolute;
    left: 50%;
    bottom: max(0.75rem, env(safe-area-inset-bottom));
    z-index: 72;
    transform: translateX(-50%);
    display: inline-flex;
    gap: 0.5rem;
  `,
  gallery__lightboxControlButton: `
    min-width: 4.75rem;
    border: 1px solid rgba(255, 255, 255, 0.58);
    border-radius: 9999px;
    background: rgba(28, 20, 24, 0.58);
    color: #fff;
    font-size: calc(0.95rem + 3px);
    font-weight: 600;
    padding: 0.4rem 0.9rem;
    cursor: pointer;
    transition:
      transform 180ms ease,
      background-color 180ms ease,
      border-color 180ms ease;

    &:active {
      transform: scale(0.96);
      background: rgba(28, 20, 24, 0.72);
      border-color: rgba(255, 255, 255, 0.78);
    }

    &:disabled {
      opacity: 0.24;
      pointer-events: none;
    }
  `,
} as const);
// #endregion

// #region 초대장 스타일
const invitationStyles = withEmotionLabels("invitation", {
  invitation__card: `
    position: relative;
    overflow: hidden;
    text-align: center;
    padding: 2.25rem 0rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 3.5rem 3rem;
    }
  `,
  invitation__title: `
    margin-top: 1rem;
    font-size: 1.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  invitation__body: `
    margin-top: 1.25rem;
    color: #4f3b46;
    font-size: calc(1.05rem + 3px);
    line-height: 2rem;
    font-weight: 400;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.125rem;
      line-height: 2.25rem;
    }
  `,
  invitation__messageLine: `
    display: block;
  `,
  invitation__messageLineSectionGap: `
    margin-bottom: 12px;
  `,
  invitation__namesWrap: `
    margin: 2.25rem auto 0;
    max-width: 28rem;
    border-top: 1px solid rgba(253, 205, 211, 0.7);
    padding-top: 1.5rem;
  `,
  invitation__namesRow: `
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: 1.3rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.25rem;
    }
  `,
  invitation__nameText: `
    margin: 0;
    font-weight: 700;
    font-size: 1.5rem;
  `,
  invitation__heart: `
    margin: 0;
    position: relative;
    z-index: 0;
    isolation: isolate;
    display: inline-flex;
    min-width: 1.72rem;
    min-height: 1.62rem;
    align-items: center;
    justify-content: center;
    color: #cf2b3a;
    font-size: 0.84rem;
    line-height: 1;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.68);

    &::before {
      content: "";
      position: absolute;
      inset: 50% auto auto 50%;
      z-index: -1;
      width: 1.88rem;
      height: 1.62rem;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 36'%3E%3Cpath d='M20 33.2c-.6 0-1.2-.2-1.7-.6l-3.1-2.8C7 22.3 1.2 17 1.2 10.4 1.2 5.3 5.1 1.4 10.2 1.4c3.9 0 7.4 2 9.8 5.1 2.4-3.1 5.9-5.1 9.8-5.1 5.1 0 9 3.9 9 9 0 6.6-5.4 11.5-13.1 18.6l-3.1 2.8c-.5.4-1.1.6-1.7.6Z' fill='%23ffd3de' stroke='%23f06d95' stroke-width='1.8'/%3E%3Cpath d='M12.6 8.3c1-.9 2.4-1.5 3.9-1.5 1.4 0 2.7.4 3.5 1' fill='none' stroke='%23fff8fb' stroke-width='1.35' stroke-linecap='round' opacity='.95'/%3E%3C/svg%3E");
      pointer-events: none;
      transform: translate(-50%, -50%);
    }

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1rem;
    }
  `,
  invitation__deco: `
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 9999px;
    pointer-events: none;
    opacity: 0.72;
  `,
  invitation__decoLeft: `
    top: -120px;
    left: -110px;
    background: radial-gradient(
      circle,
      rgba(255, 210, 224, 0.52) 0%,
      rgba(255, 210, 224, 0) 70%
    );
  `,
  invitation__decoRight: `
    right: -110px;
    bottom: -130px;
    background: radial-gradient(
      circle,
      rgba(255, 231, 202, 0.52) 0%,
      rgba(255, 231, 202, 0) 70%
    );
  `,
} as const);
// #endregion

// #region 배경음악 스타일
const musicPlayerStyles = withEmotionLabels("music-player", {
  "music-player__dock": `
    position: fixed;
    right: 0.9rem;
    bottom: max(0.9rem, env(safe-area-inset-bottom));
    z-index: 60;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    border-radius: 9999px;
    border: 1px solid rgba(231, 90, 132, 0.28);
    background: rgba(255, 255, 255, 0.78);
    backdrop-filter: blur(10px);
    padding: 0.32rem 0.45rem 0.32rem 0.35rem;
    box-shadow: 0 10px 24px rgba(205, 87, 125, 0.22);
    animation: music-dock-slide-up 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both;

    @keyframes music-dock-slide-up {
      from {
        opacity: 0;
        transform: translateY(14px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (min-width: ${SM_BREAKPOINT}) {
      right: 1.35rem;
      padding-right: 0.5rem;
    }
  `,
  "music-player__button": `
    display: inline-flex;
    width: 2.1rem;
    height: 2.1rem;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 9999px;
    background: rgba(255, 245, 249, 0.95);
    color: #be3f68;
    cursor: pointer;
    padding: 0;
  `,
  "music-player__icon": `
    width: 1rem;
    height: 1rem;
  `,
  "music-player__volume": `
    width: 3.8rem;
    height: 0.25rem;
    appearance: none;
    -webkit-appearance: none;
    background: rgba(190, 63, 104, 0.2);
    border-radius: 9999px;
    outline: none;
    cursor: pointer;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 0.85rem;
      height: 0.85rem;
      border-radius: 50%;
      background: #be3f68;
      border: 2px solid #fff;
      box-shadow: 0 1px 4px rgba(190, 63, 104, 0.35);
      cursor: pointer;
    }

    &::-moz-range-thumb {
      width: 0.85rem;
      height: 0.85rem;
      border-radius: 50%;
      background: #be3f68;
      border: 2px solid #fff;
      box-shadow: 0 1px 4px rgba(190, 63, 104, 0.35);
      cursor: pointer;
    }
  `,
  "music-player__label": `
    color: #8c5a70;
    font-size: calc(0.95rem + 3px);
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 0 0.38rem 0 0.12rem;
  `,
} as const);
// #endregion

// #region 예식장 스타일
const venueStyles = withEmotionLabels("venue", {
  venue__card: `
    padding: 1rem 1.25rem 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 2.75rem 2.5rem;
    }
  `,
  venue__header: `
    text-align: center;
  `,
  venue__floralChip: `
    display: inline-flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    min-height: 2.1rem;
    padding: 0.38rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid rgba(231, 90, 132, 0.25);
    background: rgba(255, 248, 250, 0.88);
    color: #8f4762;
    font-size: calc(0.75rem + 3px);
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.75rem;
    animation: floral-chip-fade-in 420ms ease-out both;

    @keyframes floral-chip-fade-in {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    &::before {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      content: "✿";
      font-size: 0.85rem;
      line-height: 1;
    }
  `,
  venue__title: `
    font-size: 1.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  venue__venueInfo: `
    margin-top: 1.2rem;
    text-align: center;
  `,
  venue__venueName: `
    margin: 0;
    font-size: 1.425rem;
    font-weight: 700;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.5rem;
    }
  `,
  venue__venueAddress: `
    margin: 0.5rem 0 0;
    font-size: calc(1.075rem + 3px);
    color: #71535f;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1rem;
    }
  `,
  venue__mapWrap: `
    position: relative;
    margin-top: 1.5rem;
    overflow: hidden;
    border-radius: 1rem;
    border: 1px solid rgba(255, 228, 230, 1);
    background: rgba(255, 255, 255, 0.75);
    box-shadow: 0 10px 16px rgba(15, 23, 42, 0.12);
  `,
  venue__mapFrame: `
    width: 100%;
    height: 300px;
    border: 0;

    @media (min-width: ${SM_BREAKPOINT}) {
      height: 320px;
    }
  `,
  venue__mapChipWrap: `
    position: absolute;
    right: 0.75rem;
    bottom: 0.75rem;
    left: 0.75rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  `,
  venue__mapChip: `
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    background-color: rgba(255, 255, 255, 0.92);
    color: #563f4b;
    font-size: calc(0.78rem + 3px);
    font-weight: 700;
    text-decoration: none;
    padding: 0.42rem 0.7rem;
  `,
  venue__transportSection: `
    margin-top: 1.75rem;
  `,
  venue__transportTitle: `
    margin: 0;
    font-size: 1.425rem;
    font-weight: 700;
    color: #432f39;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.25rem;
    }
  `,
  venue__transportGrid: `
    margin-top: 0.75rem;
    display: grid;
    gap: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  `,
  venue__transportCard: `
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 228, 230, 1);
    background: rgba(255, 241, 242, 0.7);
    padding: 0.75rem;
  `,
  venue__transportType: `
    margin: 0;
    font-size: calc(1.075rem + 3px);
    font-weight: 700;
    color: #5f4552;
  `,
  venue__transportDetails: `
    margin: 0.25rem 0 0;
    font-size: calc(0.975rem + 3px);
    color: #6f5864;
    white-space: pre-line;
  `,
  venue__actionRow: `
    margin-top: 1.2rem;
    display: flex;
    justify-content: center;
  `,
  // 예식장 action 버튼 가독성 보정 및 모바일 터치 영역 확장 적용
  venue__actionButton: `
    min-width: min(100%, 11rem);
    min-height: 2.8rem;
    width: min(100%, 12.5rem);
    font-size: calc(1.1rem + 3px);
    line-height: 1.15;
    letter-spacing: 0.01em;
    padding: 0.8rem 0.85rem;
    white-space: nowrap;

    @media (min-width: ${SM_BREAKPOINT}) {
      min-width: 9rem;
      width: auto;
      font-size: 1rem;
      padding: 0.8rem 1.25rem;
    }
  `,
} as const);
// #endregion

// #region 꽃잎 캔버스 스타일
const flowerPetalStyles = withEmotionLabels("flower-petal", {
  "flower-petal__canvas": `
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    outline: none;
    z-index: 0;
    pointer-events: none;
  `,
} as const);
// #endregion

export {
  countdownStyles,
  galleryStyles,
  invitationStyles,
  musicPlayerStyles,
  venueStyles,
  flowerPetalStyles,
};
