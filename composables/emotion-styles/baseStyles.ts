import { MD_BREAKPOINT, SM_BREAKPOINT, withEmotionLabels } from "./core";

// #region 공통 스타일
const sharedStyles = withEmotionLabels("shared", {
  shared__sectionWrap: `
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
    padding: 0.75rem 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 4.5rem 1.5rem;
    }
  `,
  shared__sectionCard: `
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
  shared__sectionTitle: `
    margin: 0;
    font-family: var(--font-main), sans-serif;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #36242f;
  `,
  shared__sectionSubtitle: `
    margin: 0;
    font-size: calc(1.05rem + 3px);
    color: var(--text-sub);
  `,
  shared__floralChip: `
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
      display: inline-flex;
      align-items: center;
      justify-content: center;
      content: "✿";
      font-size: 0.85rem;
      line-height: 1;
    }
  `,
  shared__petalButton: `
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
  app__container: `
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
  app__contentWrapper: `
    position: relative;
    z-index: 1;
    background-color: transparent;
  `,
} as const);
// #endregion

// #region 홈 스타일
const homeStyles = withEmotionLabels("home", {
  home__root: `
    color: var(--text-main);
  `,
  home__heroSection: `
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
  home__heroInner: `
    width: 100%;
    max-width: 56rem;
  `,
  home__heroCard: `
    position: relative;
    overflow: hidden;
    padding: 2rem 1.25rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 3rem 2.5rem;
    }
  `,
  home__heroBlush: `
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 9999px;
    pointer-events: none;
    opacity: 0.75;
  `,
  home__heroBlushLeft: `
    top: -110px;
    left: -90px;
    background: radial-gradient(
      circle,
      rgba(255, 205, 219, 0.55) 0%,
      rgba(255, 205, 219, 0) 72%
    );
  `,
  home__heroBlushRight: `
    right: -90px;
    bottom: -110px;
    background: radial-gradient(
      circle,
      rgba(255, 229, 188, 0.55) 0%,
      rgba(255, 229, 188, 0) 72%
    );
  `,
  home__heroContent: `
    position: relative;
    z-index: 1;
    text-align: center;
  `,
  home__heroTitle: `
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
  home__ampersand: `
    display: block;
    margin: 0.4rem 0.5rem 0;
    font-size: clamp(2.2rem, 9vw, 4.3rem);
    color: #d64e75;

    @media (min-width: ${MD_BREAKPOINT}) {
      display: inline;
    }
  `,
  home__heroSubtitle: `
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
  home__namesGrid: `
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      gap: 1rem;
    }
  `,
  home__nameCard: `
    border-radius: 1rem;
    border: 1px solid rgba(231, 90, 132, 0.18);
    background: rgba(255, 255, 255, 0.82);
    padding: 0.95rem 0.75rem;
  `,
  home__nameValue: `
    margin: 0;
    font-size: 1.35rem;
    font-weight: 500;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.875rem;
    }
  `,
  home__nameRole: `
    margin: 0.25rem 0 0;
    font-size: calc(0.75rem + 3px);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #8c6d7c;
  `,
  home__countdownWrap: `
    margin-top: 2rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.65);
    padding: 1rem 0.75rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 1.25rem 1rem;
    }
  `,
  home__dateCard: `
    margin-top: 2rem;
    border-radius: 1rem;
    border: 1px solid rgba(253, 164, 175, 0.6);
    background: rgba(255, 255, 255, 0.78);
    padding: 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 1rem 1.5rem;
    }
  `,
  home__dateText: `
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #624652;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1.5rem;
    }
  `,
  home__venueText: `
    margin: 0.25rem 0 0;
    font-size: calc(0.9rem + 3px);
    color: #7a5b68;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 1rem;
    }
  `,
} as const);
// #endregion

// #region 연락처 스타일
const contactStyles = withEmotionLabels("contact", {
  contact__sectionOffset: `
    padding-top: 0.5rem;
    padding-bottom: calc(max(5.6rem, env(safe-area-inset-bottom)) + 1rem);

    @media (min-width: ${SM_BREAKPOINT}) {
      padding-top: 1rem;
      padding-bottom: 6.25rem;
    }
  `,
  contact__header: `
    text-align: center;
  `,
  contact__floralChip: `
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.38rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid rgba(231, 90, 132, 0.25);
    background: rgba(255, 248, 250, 0.88);
    color: #8f4762;
    font-size: calc(0.75rem + 3px);
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
  contact__title: `
    margin-top: 1rem;
    font-size: 1.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  contact__subtitle: `
    margin-top: 0.5rem;
  `,
  contact__cardGrid: `
    margin-top: 1.75rem;
    display: grid;
    gap: 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      margin-top: 2rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  `,
  contact__cardInner: `
    padding: 1.25rem 0.5rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 1.75rem 1.5rem;
    }
  `,
  contact__sectionLabel: `
    margin: 0 0.5rem;
    color: #422f39;
    font-size: 1.3rem;
    font-weight: 700;
  `,
  contact__contactList: `
    margin: 1rem 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  `,
  contact__contactRow: `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.3rem;
    border: 1px solid rgba(231, 90, 132, 0.14);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 248, 251, 0.9));
    border-radius: 1.15rem;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.82);
    padding: 0.9rem 0.7rem;
  `,
  contact__contactContent: `
    min-width: 0;
    flex: 1 1 auto;
  `,
  contact__contactName: `
    margin: 0;
    color: #4c3540;
    font-size: 1.2rem;
    font-weight: 700;
  `,
  contact__contactNumber: `
    margin: 0.18rem 0 0;
    color: #7f6470;
    font-size: calc(1rem + 3px);
    letter-spacing: 0.01em;
    word-break: break-all;
  `,
  contact__copyButton: `
    appearance: none;
    -webkit-appearance: none;
    position: relative;
    border: 1px solid rgba(231, 90, 132, 0.18);
    border-radius: 9999px;
    background:
      radial-gradient(circle at top, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0) 48%),
      linear-gradient(135deg, rgba(255, 238, 244, 0.98), rgba(255, 228, 238, 0.98));
    box-shadow:
      0 6px 14px rgba(215, 63, 109, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.88);
    color: #b34167;
    font-family: inherit;
    font-size: calc(0.84rem + 3px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0.01em;
    white-space: nowrap;
    padding: 0.78rem 1rem 0.76rem;
    cursor: pointer;
    transition:
      transform 160ms ease,
      box-shadow 160ms ease,
      background-color 160ms ease,
      color 160ms ease,
      border-color 160ms ease;

    &:hover {
      box-shadow:
        0 8px 16px rgba(215, 63, 109, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.92);
    }

    &:active {
      transform: translateY(1px) scale(0.98);
    }
  `,
  contact__copyButtonActive: `
    border-color: rgba(214, 78, 117, 0.22);
    background:
      radial-gradient(circle at top, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0) 48%),
      linear-gradient(135deg, rgba(255, 223, 234, 0.98), rgba(255, 235, 242, 0.98));
    color: #913658;
  `,
} as const);
// #endregion

export { sharedStyles, appStyles, homeStyles, contactStyles };
