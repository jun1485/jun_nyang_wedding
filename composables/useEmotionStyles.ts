import { injectGlobal } from "@emotion/css";

// #region 브레이크포인트
const SM_BREAKPOINT = "640px";
const MD_BREAKPOINT = "768px";
// #endregion

// #region Emotion 라벨링
function withEmotionLabels<T extends Record<string, string>>(
  scope: string,
  styles: T,
): T {
  const entries = Object.entries(styles).map(([key, styleText]) => {
    const labelClassName = `${scope}__${key}`;
    // 스타일 키 기반 고정 클래스명 사용 - 브라우저/IDE 동일 명칭 탐색 용이화
    injectGlobal`
      .${labelClassName} {
        ${styleText}
      }
    `;
    return [key, labelClassName];
  });

  return Object.fromEntries(entries) as T;
}
// #endregion

// #region 공통 스타일
const sharedStyles = withEmotionLabels("shared", {
  sectionWrap: `
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
    padding: 0.75rem 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 4.5rem 1.5rem;
    }
  `,
  sectionCard: `
    border-radius: 1.5rem;
    border: 1px solid rgba(231, 90, 132, 0.18);
    background: rgba(255, 255, 255, 0.76);
    backdrop-filter: blur(8px);
    box-shadow: 0 18px 40px rgba(215, 63, 109, 0.12);
    animation: section-card-fade-up 480ms cubic-bezier(0.2, 0.8, 0.2, 1) both;

    @keyframes section-card-fade-up {
      from {
        opacity: 0;
        transform: translateY(14px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `,
  sectionTitle: `
    margin: 0;
    font-family: var(--font-main), sans-serif;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #36242f;
  `,
  sectionSubtitle: `
    margin: 0;
    font-size: 0.95rem;
    color: var(--text-sub);
  `,
  floralChip: `
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.38rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid rgba(231, 90, 132, 0.25);
    background: rgba(255, 248, 250, 0.88);
    color: #8f4762;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin: 1rem 0;
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
      content: "✿";
      font-size: 0.85rem;
    }
  `,
  petalButton: `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 9999px;
    background: linear-gradient(135deg, var(--rose-500), var(--rose-600));
    color: #fff;
    font-weight: 700;
    padding: 0.7rem 1rem;
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(215, 63, 109, 0.2);
    transition:
      transform 180ms ease,
      box-shadow 180ms ease,
      filter 180ms ease;

    &:focus-visible {
      outline: 2px solid rgba(231, 90, 132, 0.35);
      outline-offset: 2px;
    }

    &:active {
      transform: translateY(1px) scale(0.985);
      box-shadow: 0 6px 14px rgba(215, 63, 109, 0.22);
      filter: saturate(0.95);
    }
  `,
} as const);
// #endregion

// #region 앱 스타일
const appStyles = withEmotionLabels("app", {
  container: `
    position: relative;
    min-height: 100dvh;
    overflow-x: clip;

    &::before,
    &::after {
      content: "";
      position: fixed;
      width: 280px;
      height: 280px;
      border-radius: 9999px;
      pointer-events: none;
      z-index: 0;
      opacity: 0.7;
    }

    &::before {
      top: -100px;
      left: -90px;
      background: radial-gradient(
        circle,
        rgba(255, 199, 216, 0.45) 0%,
        rgba(255, 199, 216, 0) 72%
      );
    }

    &::after {
      bottom: -100px;
      right: -90px;
      background: radial-gradient(
        circle,
        rgba(255, 225, 190, 0.4) 0%,
        rgba(255, 225, 190, 0) 70%
      );
    }
  `,
  contentWrapper: `
    position: relative;
    z-index: 1;
    background-color: transparent;
  `,
} as const);
// #endregion

// #region 홈 스타일
const homeStyles = withEmotionLabels("home", {
  root: `
    color: var(--text-main);
  `,
  heroSection: `
    position: relative;
    display: flex;
    min-height: 100svh;
    align-items: center;
    justify-content: center;
    padding: 1rem 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 4rem 1.5rem;
    }
  `,
  heroInner: `
    width: 100%;
    max-width: 56rem;
  `,
  heroCard: `
    position: relative;
    overflow: hidden;
    padding: 2rem 1.25rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 3rem 2.5rem;
    }
  `,
  heroBlush: `
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 9999px;
    pointer-events: none;
    opacity: 0.75;
  `,
  heroBlushLeft: `
    top: -110px;
    left: -90px;
    background: radial-gradient(
      circle,
      rgba(255, 205, 219, 0.55) 0%,
      rgba(255, 205, 219, 0) 72%
    );
  `,
  heroBlushRight: `
    right: -90px;
    bottom: -110px;
    background: radial-gradient(
      circle,
      rgba(255, 229, 188, 0.55) 0%,
      rgba(255, 229, 188, 0) 72%
    );
  `,
  heroContent: `
    position: relative;
    z-index: 1;
    text-align: center;
  `,
  heroTitle: `
    margin: 0;
    color: #432f3a;
    line-height: 1.05;
    text-wrap: balance;
    font-size: 2.25rem;
    font-weight: 500;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 3rem;
    }

    @media (min-width: ${MD_BREAKPOINT}) {
      font-size: 4.5rem;
    }
  `,
  ampersand: `
    display: block;
    margin: 0.4rem 0.5rem 0;
    font-size: clamp(2.2rem, 9vw, 4.3rem);
    color: #d64e75;

    @media (min-width: ${MD_BREAKPOINT}) {
      display: inline;
    }
  `,
  heroSubtitle: `
    margin-top: 0.5rem;
    color: #5f4552;
    font-size: 1.3rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.875rem;
    }

    @media (min-width: ${MD_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  namesGrid: `
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      gap: 1rem;
    }
  `,
  nameCard: `
    border-radius: 1rem;
    border: 1px solid rgba(231, 90, 132, 0.18);
    background: rgba(255, 255, 255, 0.82);
    padding: 0.95rem 0.75rem;
  `,
  nameValue: `
    margin: 0;
    font-size: 1.25rem;
    font-weight: 500;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.875rem;
    }
  `,
  nameRole: `
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #8c6d7c;
  `,
  countdownWrap: `
    margin-top: 2rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.65);
    padding: 1rem 0.75rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 1.25rem 1rem;
    }
  `,
  dateCard: `
    margin-top: 2rem;
    border-radius: 1rem;
    border: 1px solid rgba(253, 164, 175, 0.6);
    background: rgba(255, 255, 255, 0.78);
    padding: 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 1rem 1.5rem;
    }
  `,
  dateText: `
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: #624652;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.5rem;
    }
  `,
  venueText: `
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: #7a5b68;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.125rem;
    }
  `,
} as const);
// #endregion

// #region 연락처 스타일
const contactStyles = withEmotionLabels("contact", {
  sectionOffset: `
    padding-top: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding-top: 1rem;
    }
  `,
  header: `
    text-align: center;
  `,
  floralChip: `
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.38rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid rgba(231, 90, 132, 0.25);
    background: rgba(255, 248, 250, 0.88);
    color: #8f4762;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 0.25rem;
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
      content: "✿";
      font-size: 0.85rem;
    }
  `,
  title: `
    margin-top: 1rem;
    font-size: 1.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  subtitle: `
    margin-top: 0.5rem;
  `,
  cardGrid: `
    margin-top: 1.75rem;
    display: grid;
    gap: 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      margin-top: 2rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  `,
  cardInner: `
    padding: 1.25rem 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 1.75rem 1.5rem;
    }
  `,
  sectionLabel: `
    margin: 0;
    color: #422f39;
    font-size: 1.2rem;
    font-weight: 700;
  `,
  contactList: `
    margin: 1rem 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  `,
  contactRow: `
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.75rem;
    border: 1px solid rgba(231, 90, 132, 0.15);
    background: rgba(255, 255, 255, 0.78);
    border-radius: 0.9rem;
    padding: 0.75rem;
  `,
  contactName: `
    margin: 0;
    color: #4c3540;
    font-size: 0.95rem;
    font-weight: 700;
  `,
  contactNumber: `
    margin: 0.18rem 0 0;
    color: #7f6470;
    font-size: 0.82rem;
  `,
} as const);
// #endregion

// #region 카운트다운 스타일
const countdownStyles = withEmotionLabels("countdown", {
  root: `
    text-align: center;
  `,
  calendarPaper: `
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
  calendarHead: `
    display: flex;
    align-items: flex-end;
    gap: 0.4rem;
  `,
  calendarMonthNumber: `
    margin: 0;
    color: #d64e75;
    font-family: var(--font-main), sans-serif;
    font-size: 2.4rem;
    line-height: 0.9;
    font-weight: 700;
    letter-spacing: 0.02em;
  `,
  calendarMonthLabel: `
    margin: 0 0 0.18rem;
    color: #8f91ad;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  `,
  calendarGuide: `
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
  calendarGrid: `
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    column-gap: 0.16rem;
    row-gap: 0.2rem;
  `,
  calendarCell: `
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
  calendarCellEmpty: `
    opacity: 0;
  `,
  calendarCellSunday: `
    color: #b49a5e;
  `,
  calendarCellSaturday: `
    color: #7f95c4;
  `,
  calendarCellTarget: `
    position: relative;
    z-index: 0;
    isolation: isolate;
    color: #d13114;
    font-size: 1rem;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);

    &::after {
      content: "";
      position: absolute;
      z-index: -1;
      width: 1.14em;
      height: 1.02em;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100% 100%;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 22'%3E%3Cpath d='M12 20.4c-.3 0-.6-.1-.8-.3l-1.5-1.4C5.5 14.9 2.7 12.3 2.7 9.1 2.7 6.6 4.6 4.7 7.1 4.7c1.8 0 3.4.9 4.3 2.3.9-1.4 2.5-2.3 4.3-2.3 2.5 0 4.4 1.9 4.4 4.4 0 3.2-2.8 5.8-7 9.6l-1.5 1.4c-.2.2-.5.3-.8.3Z' fill='%23ffb3c8' stroke='%23f06d95' stroke-width='1.45'/%3E%3Ccircle cx='9' cy='8.2' r='1.15' fill='%23fff7fb'/%3E%3C/svg%3E");
      opacity: 0.96;
      pointer-events: none;
      top: 50%;
      left: 50%;
      transform: translate(36%, -108%) rotate(8deg);
    }
  `,
  title: `
    margin: 0;
    color: #6f5360;
    font-family: var(--font-main), sans-serif;
    font-weight: 700;
    letter-spacing: 0.06em;
    font-size: 0.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1rem;
    }
  `,
  grid: `
    margin-top: 0.75rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.75rem;
    }
  `,
  card: `
    border-radius: 0.9rem;
    border: 1px solid rgba(231, 90, 132, 0.22);
    background: rgba(255, 255, 255, 0.84);
    padding: 0.7rem 0.45rem;
  `,
  value: `
    margin: 0;
    color: #422f39;
    font-size: clamp(1.35rem, 5vw, 2.05rem);
    font-weight: 700;
    line-height: 1.1;
  `,
  label: `
    margin: 0.2rem 0 0;
    color: #8d6f7d;
    font-size: 0.72rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  `,
} as const);
// #endregion

// #region 갤러리 스타일
const galleryStyles = withEmotionLabels("gallery", {
  sectionOffset: `
    && {
      padding: 0.25rem 0 0;
    }

    @media (min-width: ${SM_BREAKPOINT}) {
      && {
        padding: 0.5rem 0 4.5rem;
      }
    }
  `,
  header: `
    text-align: center;
    padding-right: 1rem;
    padding-left: 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding-right: 1.5rem;
      padding-left: 1.5rem;
    }
  `,
  title: `
    font-size: 1.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  subtitle: `
    margin-top: 0.5rem;
  `,
  // 캐러셀 래퍼 배경 프레임 사용
  carouselShell: `
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
  viewAllButtonWrap: `
    margin-top: 0.35rem;
    display: flex;
    justify-content: center;
    padding: 0 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      margin-top: 0.65rem;
      padding: 0 1.5rem;
    }
  `,
  viewAllButton: `
    min-width: 11.75rem;
    border: 0;
    border-radius: 9999px;
    background: linear-gradient(
      135deg,
      rgba(214, 78, 117, 0.96),
      rgba(227, 102, 138, 0.92)
    );
    color: #fff;
    font-size: 1.1rem;
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
  allPhotosLayer: `
    position: fixed;
    inset: 0;
    z-index: 68;
    background: rgba(25, 17, 22, 0.58);
    animation: gallery-all-photos-fade-in 220ms ease-out both;

    @keyframes gallery-all-photos-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  allPhotosPanel: `
    width: min(38rem, 100%);
    height: 100%;
    margin: 0 auto;
    background: #f7f7f7;
    display: flex;
    flex-direction: column;
  `,
  allPhotosHeader: `
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: calc(max(0.6rem, env(safe-area-inset-top)) + 0.5rem) 3.2rem 0.8rem;
    border-bottom: 1px solid rgba(220, 220, 220, 0.9);
    background: rgba(247, 247, 247, 0.96);
    backdrop-filter: blur(6px);
  `,
  allPhotosTitle: `
    margin: 0;
    color: #3b3237;
    font-size: 1.15rem;
    font-weight: 500;
    letter-spacing: 0.02em;
  `,
  allPhotosCloseButton: `
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
  allPhotosBody: `
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding:
      0.6rem 0.65rem
      calc(max(0.65rem, env(safe-area-inset-bottom)) + 0.4rem);

    @media (min-width: ${SM_BREAKPOINT}) {
      padding-right: 0.85rem;
      padding-left: 0.85rem;
    }
  `,
  allPhotosGrid: `
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.62rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      gap: 0.78rem;
    }
  `,
  allPhotosItemButton: `
    border: 0;
    border-radius: 0.1rem;
    padding: 0;
    background: transparent;
    overflow: hidden;
    cursor: pointer;

    &:active {
      transform: scale(0.985);
    }
  `,
  allPhotosMedia: `
    position: relative;
    overflow: hidden;
    aspect-ratio: 3 / 4;
    background: #e9e2e7;
  `,
  // img GPU eviction 대비 - skeleton 위 z-index 2에 배치, 항상 DOM에 유지되는 skeleton이 blank 시 배경 역할
  allPhotosImage: `
    position: absolute;
    inset: 0;
    z-index: 2;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #ece7ea;
    transition: opacity 220ms ease;
  `,
  allPhotosImageVisible: `
    opacity: 1;
  `,
  allPhotosImageHidden: `
    opacity: 0;
  `,
  // 로드 전: shimmer 애니메이션 / 로드 후: 정적 배경으로 전환 - img blank 시 회색 배경 노출
  allPhotosSkeleton: `
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
  allPhotosSkeletonDone: `
    animation: none;
    background: #dbd3d9;
  `,
  allPhotosLoadingOverlay: `
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
  allPhotosLoadingSpinner: `
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
  // Embla viewport 영역 고정 및 터치 제스처 충돌 최소화
  carouselViewport: `
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
  // Embla track 가로 정렬 및 transform 최적화 적용
  carouselContainer: `
    display: flex;
    align-items: stretch;
    gap: 0.7rem;
  `,
  carouselSlide: `
    min-width: 0;
    flex: 0 0 78%;
    padding-bottom: 0.7rem;
    opacity: 1;
    transform: none;
    filter: none;
    scroll-snap-align: center;

    @media (min-width: 360px) {
      flex: 0 0 62%;
    }

    @media (min-width: ${SM_BREAKPOINT}) {
      flex: 0 0 36%;
    }

    @media (min-width: ${MD_BREAKPOINT}) {
      flex: 0 0 27%;
    }
  `,
  carouselNavButton: `
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
  carouselNavButtonLeft: `
    left: 0.2rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      left: 0.55rem;
    }
  `,
  carouselNavButtonRight: `
    right: 0.2rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      right: 0.55rem;
    }
  `,
  thumbButton: `
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
  thumbImage: `
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 240ms ease;
  `,
  thumbImageVisible: `
    opacity: 1;
  `,
  thumbImageHidden: `
    opacity: 0;
  `,
  // 이미지 미로드 상태 - shimmer 스켈레톤 placeholder
  thumbPlaceholder: `
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
  // 썸네일 네트워크 로딩 상태 표현 - 반투명 오버레이와 스피너 동시 표시
  thumbLoadingOverlay: `
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
  thumbLoadingSpinner: `
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
  thumbLoadingText: `
    color: rgba(255, 255, 255, 0.94);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
  `,
  thumbCaption: `
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(31, 19, 24, 0.66), transparent);
    padding: 0.6rem 0.78rem 0.52rem;
    text-align: left;
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    color: #fff;
  `,
  // 라이트박스 오버레이 고정 및 스와이프 영역 클리핑 적용
  overlay: `
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
  // Embla 라이트박스 viewport/track 중앙 배치 사용
  lightboxViewport: `
    width: 100%;
    height: 100%;
    overflow: hidden;
    touch-action: pan-x pan-y;
  `,
  lightboxContainer: `
    display: flex;
    height: 100%;
    will-change: transform;
  `,
  lightboxSlide: `
    min-width: 0;
    flex: 0 0 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  `,
  // 라이트박스 이미지 로딩 상태 표현 - 중앙 스피너와 안내 텍스트 고정 배치
  lightboxLoadingOverlay: `
    position: absolute;
    inset: 0;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 0.55rem;
    pointer-events: none;
  `,
  lightboxLoadingSpinner: `
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
  lightboxLoadingText: `
    color: rgba(255, 255, 255, 0.92);
    font-size: 0.83rem;
    font-weight: 700;
    letter-spacing: 0.03em;
  `,

  closeButton: `
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
  icon: `
    width: 1.25rem;
    height: 1.25rem;
  `,
  // 라이트박스 이미지 비율 유지 및 화면 내 중앙 배치
  lightboxImage: `
    max-height: 84svh;
    max-width: 92vw;
    object-fit: contain;
    display: block;
    backface-visibility: hidden;
    will-change: transform, opacity;
  `,
  // 라이트박스 다음 전환 애니메이션 적용 - 우측 진입/부드러운 감속 사용
  lightboxImageEnterNext: `
    animation: gallery-lightbox-enter-next 320ms cubic-bezier(0.22, 1, 0.36, 1)
      both;

    @keyframes gallery-lightbox-enter-next {
      from {
        opacity: 0;
        transform: translate3d(32px, 0, 0) scale(0.985);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
    }
  `,
  // 라이트박스 이전 전환 애니메이션 적용 - 좌측 진입/부드러운 감속 사용
  lightboxImageEnterPrev: `
    animation: gallery-lightbox-enter-prev 320ms cubic-bezier(0.22, 1, 0.36, 1)
      both;

    @keyframes gallery-lightbox-enter-prev {
      from {
        opacity: 0;
        transform: translate3d(-32px, 0, 0) scale(0.985);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
    }
  `,
  navButton: `
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
  navButtonLeft: `
    left: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      left: 1rem;
    }
  `,
  navButtonRight: `
    right: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      right: 1rem;
    }
  `,
  counter: `
    position: absolute;
    left: 50%;
    bottom: calc(max(0.75rem, env(safe-area-inset-bottom)) + 3.25rem);
    z-index: 72;
    transform: translateX(-50%);
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.15);
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    color: #fff;
    backdrop-filter: blur(4px);
  `,
  lightboxControlBar: `
    position: absolute;
    left: 50%;
    bottom: max(0.75rem, env(safe-area-inset-bottom));
    z-index: 72;
    transform: translateX(-50%);
    display: inline-flex;
    gap: 0.5rem;
  `,
  lightboxControlButton: `
    min-width: 4.75rem;
    border: 1px solid rgba(255, 255, 255, 0.58);
    border-radius: 9999px;
    background: rgba(28, 20, 24, 0.58);
    color: #fff;
    font-size: 0.82rem;
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
  card: `
    position: relative;
    overflow: hidden;
    text-align: center;
    padding: 2.25rem 0rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 3.5rem 3rem;
    }
  `,
  title: `
    margin-top: 1rem;
    font-size: 1.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  body: `
    margin-top: 1.25rem;
    color: #4f3b46;
    font-size: 0.98rem;
    line-height: 2rem;
    font-weight: 400;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.125rem;
      line-height: 2.25rem;
    }
  `,
  messageLine: `
    display: block;
  `,
  messageLineSectionGap: `
    margin-bottom: 12px;
  `,
  namesWrap: `
    margin: 2.25rem auto 0;
    max-width: 28rem;
    border-top: 1px solid rgba(253, 205, 211, 0.7);
    padding-top: 1.5rem;
  `,
  namesRow: `
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: 1.3rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.25rem;
    }
  `,
  nameText: `
    margin: 0;
    font-weight: 700;
  `,
  heart: `
    margin: 0;
    color: #f43f5e;
  `,
  deco: `
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 9999px;
    pointer-events: none;
    opacity: 0.72;
  `,
  decoLeft: `
    top: -120px;
    left: -110px;
    background: radial-gradient(
      circle,
      rgba(255, 210, 224, 0.52) 0%,
      rgba(255, 210, 224, 0) 70%
    );
  `,
  decoRight: `
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
  dock: `
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
  button: `
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
  icon: `
    width: 1rem;
    height: 1rem;
  `,
  volume: `
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
  label: `
    color: #8c5a70;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 0 0.38rem 0 0.12rem;
  `,
} as const);
// #endregion

// #region 예식장 스타일
const venueStyles = withEmotionLabels("venue", {
  card: `
    padding: 1rem 1.25rem 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 2.75rem 2.5rem;
    }
  `,
  header: `
    text-align: center;
  `,
  floralChip: `
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.38rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid rgba(231, 90, 132, 0.25);
    background: rgba(255, 248, 250, 0.88);
    color: #8f4762;
    font-size: 0.75rem;
    font-weight: 700;
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
      content: "✿";
      font-size: 0.85rem;
    }
  `,
  title: `
    font-size: 1.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  venueInfo: `
    margin-top: 1.5rem;
    text-align: center;
  `,
  venueName: `
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.5rem;
    }
  `,
  venueAddress: `
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    color: #71535f;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1rem;
    }
  `,
  mapWrap: `
    position: relative;
    margin-top: 1.5rem;
    overflow: hidden;
    border-radius: 1rem;
    border: 1px solid rgba(255, 228, 230, 1);
    background: rgba(255, 255, 255, 0.75);
    box-shadow: 0 10px 16px rgba(15, 23, 42, 0.12);
  `,
  mapFrame: `
    width: 100%;
    height: 300px;
    border: 0;

    @media (min-width: ${SM_BREAKPOINT}) {
      height: 320px;
    }
  `,
  mapChipWrap: `
    position: absolute;
    right: 0.75rem;
    bottom: 0.75rem;
    left: 0.75rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  `,
  mapChip: `
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    background-color: rgba(255, 255, 255, 0.92);
    color: #563f4b;
    font-size: 0.78rem;
    font-weight: 700;
    text-decoration: none;
    padding: 0.42rem 0.7rem;
  `,
  transportSection: `
    margin-top: 1.75rem;
  `,
  transportTitle: `
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: #432f39;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.25rem;
    }
  `,
  transportGrid: `
    margin-top: 0.75rem;
    display: grid;
    gap: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  `,
  transportCard: `
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 228, 230, 1);
    background: rgba(255, 241, 242, 0.7);
    padding: 0.75rem;
  `,
  transportType: `
    margin: 0;
    font-size: 0.875rem;
    font-weight: 700;
    color: #5f4552;
  `,
  transportDetails: `
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: #6f5864;
    white-space: pre-line;
  `,
  actionRow: `
    margin-top: 1.75rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      gap: 0.75rem;
    }
  `,
  // 예식장 action 버튼 가독성 보정 및 모바일 터치 영역 확장 적용
  actionButton: `
    min-width: 8.5rem;
    min-height: 2.8rem;
    font-size: 0.98rem;
    line-height: 1.15;
    letter-spacing: 0.01em;
    padding: 0.8rem 1.25rem;
    white-space: nowrap;

    @media (min-width: ${SM_BREAKPOINT}) {
      min-width: 9rem;
      font-size: 1rem;
    }
  `,
} as const);
// #endregion

// #region 꽃잎 캔버스 스타일
const flowerPetalStyles = withEmotionLabels("flower-petal", {
  canvas: `
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

// #region 스타일 제공
export function useEmotionStyles() {
  return {
    sharedStyles,
    appStyles,
    homeStyles,
    contactStyles,
    countdownStyles,
    galleryStyles,
    invitationStyles,
    musicPlayerStyles,
    venueStyles,
    flowerPetalStyles,
  };
}
// #endregion
