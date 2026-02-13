import { css } from "@emotion/css";

// #region 브레이크포인트
const SM_BREAKPOINT = "640px";
const MD_BREAKPOINT = "768px";
// #endregion

// #region 공통 스타일
const sharedStyles = {
  sectionWrap: css`
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
    padding: 2.75rem 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 4.5rem 1.5rem;
    }
  `,
  sectionCard: css`
    border-radius: 1.5rem;
    border: 1px solid rgba(231, 90, 132, 0.18);
    background: rgba(255, 255, 255, 0.76);
    backdrop-filter: blur(8px);
    box-shadow: 0 18px 40px rgba(215, 63, 109, 0.12);
  `,
  sectionTitle: css`
    margin: 0;
    font-family: "Gaegu", sans-serif;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #36242f;
  `,
  sectionSubtitle: css`
    margin: 0;
    font-size: 0.95rem;
    color: var(--text-sub);
  `,
  floralChip: css`
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
    margin-bottom: 1.75rem;

    &::before {
      content: "✿";
      font-size: 0.85rem;
    }
  `,
  petalButton: css`
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

    &:focus-visible {
      outline: 2px solid rgba(231, 90, 132, 0.35);
      outline-offset: 2px;
    }
  `,
} as const;
// #endregion

// #region 앱 스타일
const appStyles = {
  container: css`
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
  contentWrapper: css`
    position: relative;
    z-index: 1;
    background-color: transparent;
  `,
} as const;
// #endregion

// #region 홈 스타일
const homeStyles = {
  root: css`
    color: var(--text-main);
  `,
  heroSection: css`
    position: relative;
    display: flex;
    min-height: 100svh;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 4rem 1.5rem;
    }
  `,
  heroInner: css`
    width: 100%;
    max-width: 56rem;
  `,
  heroCard: css`
    position: relative;
    overflow: hidden;
    padding: 2rem 1.25rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 3rem 2.5rem;
    }
  `,
  heroBlush: css`
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 9999px;
    pointer-events: none;
    opacity: 0.75;
  `,
  heroBlushLeft: css`
    top: -110px;
    left: -90px;
    background: radial-gradient(
      circle,
      rgba(255, 205, 219, 0.55) 0%,
      rgba(255, 205, 219, 0) 72%
    );
  `,
  heroBlushRight: css`
    right: -90px;
    bottom: -110px;
    background: radial-gradient(
      circle,
      rgba(255, 229, 188, 0.55) 0%,
      rgba(255, 229, 188, 0) 72%
    );
  `,
  heroContent: css`
    position: relative;
    z-index: 1;
    text-align: center;
  `,
  heroTitle: css`
    margin: 0;
    color: #432f3a;
    line-height: 1.05;
    text-wrap: balance;
    font-size: 2.25rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 3rem;
    }

    @media (min-width: ${MD_BREAKPOINT}) {
      font-size: 4.5rem;
    }
  `,
  ampersand: css`
    display: block;
    margin: 0 0.5rem;
    font-size: clamp(2.2rem, 9vw, 4.3rem);
    color: #d64e75;

    @media (min-width: ${MD_BREAKPOINT}) {
      display: inline;
    }
  `,
  heroSubtitle: css`
    margin-top: 0.5rem;
    color: #5f4552;
    font-size: 1.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.875rem;
    }

    @media (min-width: ${MD_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  namesGrid: css`
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      gap: 1rem;
    }
  `,
  nameCard: css`
    border-radius: 1rem;
    border: 1px solid rgba(231, 90, 132, 0.18);
    background: rgba(255, 255, 255, 0.82);
    padding: 0.95rem 0.75rem;
  `,
  nameValue: css`
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.875rem;
    }
  `,
  nameRole: css`
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #8c6d7c;
  `,
  countdownWrap: css`
    margin-top: 2rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.65);
    padding: 1rem 0.75rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 1.25rem 1rem;
    }
  `,
  dateCard: css`
    margin-top: 2rem;
    border-radius: 1rem;
    border: 1px solid rgba(253, 164, 175, 0.6);
    background: rgba(255, 255, 255, 0.78);
    padding: 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 1rem 1.5rem;
    }
  `,
  dateText: css`
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: #624652;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.5rem;
    }
  `,
  venueText: css`
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: #7a5b68;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.125rem;
    }
  `,
} as const;
// #endregion

// #region 연락처 스타일
const contactStyles = {
  sectionOffset: css`
    padding-top: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding-top: 1rem;
    }
  `,
  header: css`
    text-align: center;
  `,
  title: css`
    margin-top: 1rem;
    font-size: 1.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  subtitle: css`
    margin-top: 0.5rem;
  `,
  cardGrid: css`
    margin-top: 1.75rem;
    display: grid;
    gap: 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      margin-top: 2rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  `,
  cardInner: css`
    padding: 1.25rem 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 1.75rem 1.5rem;
    }
  `,
  sectionLabel: css`
    margin: 0;
    color: #422f39;
    font-size: 1.2rem;
    font-weight: 700;
  `,
  contactList: css`
    margin: 1rem 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  `,
  contactRow: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border: 1px solid rgba(231, 90, 132, 0.15);
    background: rgba(255, 255, 255, 0.78);
    border-radius: 0.9rem;
    padding: 0.75rem;
  `,
  contactName: css`
    margin: 0;
    color: #4c3540;
    font-size: 0.95rem;
    font-weight: 700;
  `,
  contactNumber: css`
    margin: 0.18rem 0 0;
    color: #7f6470;
    font-size: 0.82rem;
  `,
  callButton: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 3.5rem;
    border-radius: 9999px;
    border: 1px solid rgba(231, 90, 132, 0.3);
    background: #fff3f7;
    color: #c73e6a;
    font-size: 0.84rem;
    font-weight: 700;
    text-decoration: none;
    padding: 0.45rem 0.75rem;
  `,
} as const;
// #endregion

// #region 카운트다운 스타일
const countdownStyles = {
  root: css`
    text-align: center;
  `,
  title: css`
    margin: 0;
    color: #6f5360;
    font-family: "Gaegu", sans-serif;
    font-weight: 700;
    letter-spacing: 0.06em;
    font-size: 0.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1rem;
    }
  `,
  grid: css`
    margin-top: 0.75rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.75rem;
    }
  `,
  card: css`
    border-radius: 0.9rem;
    border: 1px solid rgba(231, 90, 132, 0.22);
    background: rgba(255, 255, 255, 0.84);
    padding: 0.7rem 0.45rem;
  `,
  value: css`
    margin: 0;
    color: #422f39;
    font-size: clamp(1.35rem, 5vw, 2.05rem);
    font-weight: 700;
    line-height: 1.1;
  `,
  label: css`
    margin: 0.2rem 0 0;
    color: #8d6f7d;
    font-size: 0.72rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  `,
} as const;
// #endregion

// #region 갤러리 스타일
const galleryStyles = {
  sectionOffset: css`
    && {
      padding: 0.25rem 0 2.75rem;
    }

    @media (min-width: ${SM_BREAKPOINT}) {
      && {
        padding: 0.5rem 0 4.5rem;
      }
    }
  `,
  header: css`
    text-align: center;
    padding-right: 1rem;
    padding-left: 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding-right: 1.5rem;
      padding-left: 1.5rem;
    }
  `,
  title: css`
    margin-top: 1rem;
    font-size: 1.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  subtitle: css`
    margin-top: 0.5rem;
  `,
  grid: css`
    margin-top: 1.75rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;

    @media (max-width: 359px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 0.625rem;
    }

    @media (min-width: ${MD_BREAKPOINT}) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }
  `,
  thumbButton: css`
    position: relative;
    display: block;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    border-radius: 1rem;
    border: 1px solid rgba(255, 228, 230, 1);
    background: rgba(255, 255, 255, 0.75);
    box-shadow: 0 4px 6px rgba(15, 23, 42, 0.08);
    outline: none;
    cursor: pointer;

    &:only-child {
      grid-column: 1 / -1;
    }
  `,
  thumbImage: css`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;

    &:active {
      transform: scale(1.02);
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        transform: scale(1.05);
      }
    }
  `,
  thumbCaption: css`
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
    padding: 0.5rem 0.75rem;
    text-align: left;
    font-size: 0.75rem;
    color: #fff;
  `,
  overlay: css`
    position: fixed;
    inset: 0;
    z-index: 70;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(30, 16, 24, 0.95);
    padding: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 1rem;
    }
  `,
  closeButton: css`
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
  icon: css`
    width: 1.25rem;
    height: 1.25rem;
  `,
  stage: css`
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    user-select: none;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 1rem;
  `,
  lightboxImage: css`
    max-height: 84svh;
    max-width: 92vw;
    object-fit: contain;
    transition: transform 0.2s;
    transform: translateX(0) scale(1);
    transform-origin: center center;
  `,
  navButton: css`
    position: absolute;
    top: 50%;
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
    transform: translateY(-50%);
    cursor: pointer;
  `,
  navButtonLeft: css`
    left: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      left: 1rem;
    }
  `,
  navButtonRight: css`
    right: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      right: 1rem;
    }
  `,
  counter: css`
    position: absolute;
    left: 50%;
    bottom: max(0.75rem, env(safe-area-inset-bottom));
    z-index: 71;
    transform: translateX(-50%);
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.15);
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    color: #fff;
    backdrop-filter: blur(4px);
  `,
} as const;
// #endregion

// #region 초대장 스타일
const invitationStyles = {
  card: css`
    position: relative;
    overflow: hidden;
    text-align: center;
    padding: 2.25rem 1.25rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 3.5rem 3rem;
    }
  `,
  title: css`
    margin-top: 1rem;
    font-size: 1.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  body: css`
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
  messageLine: css`
    display: block;
  `,
  namesWrap: css`
    margin: 2.25rem auto 0;
    max-width: 28rem;
    border-top: 1px solid rgba(253, 205, 211, 0.7);
    padding-top: 1.5rem;
  `,
  namesRow: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: 1.125rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.25rem;
    }
  `,
  nameText: css`
    margin: 0;
    font-weight: 700;
  `,
  heart: css`
    margin: 0;
    color: #f43f5e;
  `,
  deco: css`
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 9999px;
    pointer-events: none;
    opacity: 0.72;
  `,
  decoLeft: css`
    top: -120px;
    left: -110px;
    background: radial-gradient(
      circle,
      rgba(255, 210, 224, 0.52) 0%,
      rgba(255, 210, 224, 0) 70%
    );
  `,
  decoRight: css`
    right: -110px;
    bottom: -130px;
    background: radial-gradient(
      circle,
      rgba(255, 231, 202, 0.52) 0%,
      rgba(255, 231, 202, 0) 70%
    );
  `,
} as const;
// #endregion

// #region 배경음악 스타일
const musicPlayerStyles = {
  dock: css`
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

    @media (min-width: ${SM_BREAKPOINT}) {
      right: 1.35rem;
      padding-right: 0.5rem;
    }
  `,
  button: css`
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
  icon: css`
    width: 1rem;
    height: 1rem;
  `,
  volume: css`
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
  label: css`
    color: #8c5a70;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 0 0.38rem 0 0.12rem;
  `,
} as const;
// #endregion

// #region 예식장 스타일
const venueStyles = {
  card: css`
    padding: 2rem 1.25rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 2.75rem 2.5rem;
    }
  `,
  header: css`
    text-align: center;
  `,
  title: css`
    margin-top: 1rem;
    font-size: 1.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  venueInfo: css`
    margin-top: 1.5rem;
    text-align: center;
  `,
  venueName: css`
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.5rem;
    }
  `,
  venueAddress: css`
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    color: #71535f;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1rem;
    }
  `,
  mapWrap: css`
    position: relative;
    margin-top: 1.5rem;
    overflow: hidden;
    border-radius: 1rem;
    border: 1px solid rgba(255, 228, 230, 1);
    background: rgba(255, 255, 255, 0.75);
    box-shadow: 0 10px 16px rgba(15, 23, 42, 0.12);
  `,
  mapFrame: css`
    width: 100%;
    height: 300px;
    border: 0;

    @media (min-width: ${SM_BREAKPOINT}) {
      height: 320px;
    }
  `,
  mapChipWrap: css`
    position: absolute;
    right: 0.75rem;
    bottom: 0.75rem;
    left: 0.75rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  `,
  mapChip: css`
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.7);
    background-color: rgba(255, 255, 255, 0.92);
    color: #563f4b;
    font-size: 0.78rem;
    font-weight: 700;
    text-decoration: none;
    padding: 0.42rem 0.7rem;
  `,
  transportSection: css`
    margin-top: 1.75rem;
  `,
  transportTitle: css`
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: #432f39;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.25rem;
    }
  `,
  transportGrid: css`
    margin-top: 0.75rem;
    display: grid;
    gap: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  `,
  transportCard: css`
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 228, 230, 1);
    background: rgba(255, 241, 242, 0.7);
    padding: 0.75rem;
  `,
  transportType: css`
    margin: 0;
    font-size: 0.875rem;
    font-weight: 700;
    color: #5f4552;
  `,
  transportDetails: css`
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: #6f5864;
  `,
  actionRow: css`
    margin-top: 1.75rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      gap: 0.75rem;
    }
  `,
} as const;
// #endregion

// #region 꽃잎 캔버스 스타일
const flowerPetalStyles = {
  canvas: css`
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    outline: none;
    z-index: 0;
    pointer-events: none;
  `,
} as const;
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
