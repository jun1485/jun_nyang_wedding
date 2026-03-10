import { MD_BREAKPOINT, SM_BREAKPOINT, withEmotionLabels } from "./core";

// #region 댓글 스타일
const guestbookStyles = withEmotionLabels("guestbook", {
  guestbook__sectionOffset: `
    padding-top: 0.5rem;
    padding-bottom: 0.75rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding-top: 1rem;
      padding-bottom: 1.5rem;
    }
  `,
  guestbook__header: `
    text-align: center;
    padding-right: 1rem;
    padding-left: 1rem;
  `,
  guestbook__title: `
    font-size: 1.875rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      font-size: 2.25rem;
    }
  `,
  guestbook__subtitle: `
    margin-top: 0.5rem;
  `,
  guestbook__grid: `
    margin-top: 1.4rem;
    display: grid;
    gap: 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
      gap: 1.1rem;
    }
  `,
  guestbook__formCard: `
    padding: 1.15rem 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 1.6rem 1.4rem;
    }
  `,
  guestbook__listCard: `
    padding: 1.15rem 1rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      padding: 1.6rem 1.4rem;
    }
  `,
  guestbook__form: `
    display: flex;
    flex-direction: column;
    gap: 0.95rem;
  `,
  guestbook__fieldGroup: `
    display: flex;
    flex-direction: column;
    gap: 0.48rem;
  `,
  guestbook__fieldLabelRow: `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
  `,
  guestbook__fieldLabel: `
    color: #442f39;
    font-size: calc(1.1rem + 2px);
    font-weight: 700;
  `,
  guestbook__fieldCount: `
    color: #8b7280;
    font-size: calc(0.74rem + 2px);
    font-weight: 700;
  `,
  guestbook__input: `
    width: 100%;
    border: 1px solid rgba(231, 90, 132, 0.2);
    border-radius: 0.95rem;
    background: rgba(255, 255, 255, 0.9);
    color: #402d36;
    font-size: calc(1.1rem + 2px);
    padding: 0.82rem 0.95rem;
    outline: none;
    transition:
      border-color 180ms ease,
      box-shadow 180ms ease,
      background-color 180ms ease;

    &::placeholder {
      color: #ab93a0;
    }

    &:focus {
      border-color: rgba(214, 78, 117, 0.62);
      box-shadow: 0 0 0 3px rgba(214, 78, 117, 0.12);
      background: rgba(255, 255, 255, 0.98);
    }
  `,
  guestbook__textarea: `
    width: 100%;
    min-height: 8.4rem;
    resize: vertical;
    border: 1px solid rgba(231, 90, 132, 0.2);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.9);
    color: #402d36;
    font-size: calc(1.1rem + 2px);
    line-height: 1.65;
    padding: 0.9rem 0.95rem;
    outline: none;
    transition:
      border-color 180ms ease,
      box-shadow 180ms ease,
      background-color 180ms ease;

    &::placeholder {
      color: #ab93a0;
       font-size: calc(1rem + 2px);
    }

    &:focus {
      border-color: rgba(214, 78, 117, 0.62);
      box-shadow: 0 0 0 3px rgba(214, 78, 117, 0.12);
      background: rgba(255, 255, 255, 0.98);
    }
  `,
  guestbook__actionRow: `
    display: flex;
    justify-content: flex-end;
  `,
  guestbook__submitButton: `
    min-width: 8.4rem;
    font-size: calc(0.92rem + 2px);

    &:disabled {
      opacity: 0.5;
      cursor: default;
      box-shadow: none;
    }
  `,
  guestbook__listHeader: `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  `,
  guestbook__listTitle: `
    margin: 0;
    color: #432f39;
    font-size: 1.3rem;
    font-weight: 700;
  `,
  guestbook__refreshButton: `
    border: 0;
    border-radius: 9999px;
    background: rgba(255, 241, 246, 0.95);
    color: #b13e67;
    font-size: calc(0.78rem + 2px);
    font-weight: 700;
    padding: 0.46rem 0.8rem;
    cursor: pointer;

    &:disabled {
      opacity: 0.45;
      cursor: default;
    }
  `,
  guestbook__emptyState: `
    margin-top: 0.95rem;
    border: 1px dashed rgba(231, 90, 132, 0.2);
    border-radius: 1rem;
    background: rgba(255, 249, 251, 0.76);
    color: #876876;
    font-size: calc(0.9rem + 2px);
    text-align: center;
    padding: 1.25rem 1rem;
  `,
  guestbook__commentList: `
    margin: 0.95rem 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.72rem;
  `,
  guestbook__commentItem: `
    border: 1px solid rgba(231, 90, 132, 0.14);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.84);
    padding: 0.92rem 0.95rem 0.88rem;
  `,
  guestbook__commentMeta: `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.65rem;
  `,
  guestbook__commentAuthor: `
    color: #432f39;
    font-size: calc(1.05rem + 2px);
    font-weight: 700;
  `,
  guestbook__commentDate: `
    color: #987b88;
    font-size: calc(0.73rem + 2px);
    white-space: nowrap;
  `,
  guestbook__commentMessage: `
    margin: 0.3rem 0 0;
    color: #5d4651;
    font-size: calc(1rem + 2px);
    line-height: 1.65;
    white-space: pre-line;
    word-break: break-word;
  `,
  guestbook__commentActions: `
    margin-top: 0.5rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.35rem;
  `,
  guestbook__commentActionButton: `
    border: 1px solid rgba(231, 90, 132, 0.18);
    border-radius: 0.55rem;
    background: rgba(255, 255, 255, 0.9);
    color: #8a5367;
    font-size: calc(0.9rem + 2px);
    font-weight: 700;
    line-height: 1;
    padding: 0.38rem 0.65rem;
    cursor: pointer;
    transition: border-color 160ms ease, background 160ms ease;

    &:hover {
      border-color: rgba(231, 90, 132, 0.36);
      background: rgba(255, 246, 250, 1);
    }
  `,
  guestbook__commentActionButtonDanger: `
    color: #a0545e;
    border-color: rgba(180, 80, 90, 0.18);

    &:hover {
      border-color: rgba(180, 80, 90, 0.36);
      background: rgba(255, 243, 244, 1);
    }
  `,
  guestbook__pagination: `
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.55rem;
  `,
  guestbook__pageButtonRow: `
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
  `,
  guestbook__pageButton: `
    min-width: 2.35rem;
    min-height: 2.35rem;
    border: 1px solid rgba(231, 90, 132, 0.18);
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.92);
    color: #8a5367;
    font-size: calc(0.82rem + 2px);
    font-weight: 700;
    padding: 0.5rem 0.8rem;
    cursor: pointer;
    transition:
      border-color 180ms ease,
      background-color 180ms ease,
      color 180ms ease,
      transform 180ms ease;

    &:active {
      transform: scale(0.96);
    }

    &:disabled {
      opacity: 0.4;
      cursor: default;
      transform: none;
    }
  `,
  guestbook__pageButtonActive: `
    border-color: rgba(214, 78, 117, 0.9);
    background: linear-gradient(135deg, #d64e75, #e26d93);
    color: #ffffff;
    box-shadow: 0 8px 16px rgba(214, 78, 117, 0.18);
  `,
} as const);
// #endregion

// #region 관리자 대시보드 스타일
const adminStyles = withEmotionLabels("admin", {
  admin__page: `
    min-height: 100vh;
  `,
  admin__section: `
    padding-top: 1.5rem;
    padding-bottom: 3rem;
  `,
  admin__header: `
    text-align: center;
    margin-bottom: 1rem;
  `,
  admin__title: `
    font-size: clamp(1.8rem, 6vw, 2.6rem);
  `,
  admin__subtitle: `
    margin-top: 0.45rem;
  `,
  admin__authCard: `
    padding: 1rem;
  `,
  admin__authForm: `
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  `,
  admin__label: `
    color: #5f4552;
    font-size: calc(0.9rem + 2px);
    font-weight: 700;
  `,
  admin__authRow: `
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.7rem;

    @media (min-width: ${SM_BREAKPOINT}) {
      grid-template-columns: minmax(0, 1fr) auto auto;
      align-items: center;
    }
  `,
  admin__input: `
    width: 100%;
    min-height: 3rem;
    border: 1px solid rgba(231, 90, 132, 0.22);
    border-radius: 1rem;
    background: rgba(255, 250, 252, 0.92);
    color: #4d3742;
    font-size: calc(0.95rem + 2px);
    padding: 0 1rem;
    outline: none;

    &:focus {
      border-color: rgba(231, 90, 132, 0.5);
      box-shadow: 0 0 0 4px rgba(231, 90, 132, 0.12);
    }
  `,
  admin__primaryButton: `
    min-width: 8.6rem;
    min-height: 3rem;
  `,
  admin__secondaryButton: `
    min-width: 6rem;
    min-height: 3rem;
    border: 1px solid rgba(231, 90, 132, 0.22);
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.76);
    color: #8b5167;
    font-size: calc(0.92rem + 2px);
    font-weight: 700;
    padding: 0.8rem 1rem;
    cursor: pointer;
  `,
  admin__dangerButton: `
    min-width: 8.6rem;
    min-height: 3rem;
    background: linear-gradient(135deg, #cc486b, #b52d56);

    &:disabled {
      opacity: 0.5;
      cursor: default;
      box-shadow: none;
    }
  `,
  admin__statusText: `
    margin: 0;
    color: #876876;
    font-size: calc(0.9rem + 2px);
  `,
  admin__grid: `
    margin-top: 1rem;
    display: grid;
    gap: 1rem;

    @media (min-width: ${MD_BREAKPOINT}) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      align-items: start;
    }
  `,
  admin__card: `
    padding: 1rem;
  `,
  admin__cardTitle: `
    margin: 0 0 0.9rem;
    color: #3d2a34;
    font-size: 1.05rem;
    font-weight: 700;
  `,
  admin__metricList: `
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  `,
  admin__metricRow: `
    display: grid;
    grid-template-columns: 5.5rem minmax(0, 1fr);
    gap: 0.7rem;
    align-items: start;

    dt {
      color: #8c6677;
      font-size: calc(0.85rem + 2px);
      font-weight: 700;
      margin: 0;
    }

    dd {
      margin: 0;
      color: #4d3742;
      font-size: calc(0.92rem + 2px);
      word-break: break-word;
    }
  `,
  admin__commentActions: `
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  `,
  admin__commentList: `
    margin: 1rem 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  `,
  admin__commentItem: `
    border: 1px solid rgba(231, 90, 132, 0.16);
    border-radius: 1rem;
    background: rgba(255, 250, 252, 0.88);
  `,
  admin__commentLabel: `
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.8rem;
    align-items: start;
    padding: 0.85rem 0.9rem;
    cursor: pointer;
  `,
  admin__commentCheckbox: `
    width: 1rem;
    height: 1rem;
    margin-top: 0.2rem;
    accent-color: #d64e75;
  `,
  admin__commentBody: `
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    min-width: 0;
  `,
  admin__commentMeta: `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.7rem;
  `,
  admin__commentAuthor: `
    color: #432f39;
    font-size: calc(0.92rem + 2px);
    font-weight: 700;
  `,
  admin__commentDate: `
    color: #987b88;
    font-size: calc(0.74rem + 2px);
    white-space: nowrap;
  `,
  admin__commentMessage: `
    color: #5d4651;
    font-size: calc(0.9rem + 2px);
    line-height: 1.6;
    white-space: pre-line;
    word-break: break-word;
  `,
  admin__commentEmpty: `
    margin-top: 1rem;
    border: 1px dashed rgba(231, 90, 132, 0.22);
    border-radius: 1rem;
    background: rgba(255, 249, 251, 0.76);
    color: #876876;
    font-size: calc(0.9rem + 2px);
    text-align: center;
    padding: 1rem;
  `,
  admin__quotaCard: `
    margin-top: 1rem;
    padding: 1rem;
  `,
  admin__quotaHeader: `
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 0.9rem;
  `,
  admin__quotaGuide: `
    margin: 0;
    color: #876876;
    font-size: calc(0.88rem + 2px);
  `,
  admin__quotaList: `
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.85rem;

    @media (min-width: ${MD_BREAKPOINT}) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  `,
  admin__quotaItem: `
    border: 1px solid rgba(231, 90, 132, 0.14);
    border-radius: 1rem;
    background: rgba(255, 250, 252, 0.88);
    padding: 0.95rem;
  `,
  admin__quotaTopRow: `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  `,
  admin__quotaLabel: `
    color: #432f39;
    font-size: calc(0.96rem + 2px);
    font-weight: 700;
  `,
  admin__quotaStatusBadge: `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 1.7rem;
    padding: 0.2rem 0.55rem;
    border-radius: 9999px;
    font-size: calc(0.73rem + 2px);
    font-weight: 700;
    white-space: nowrap;
  `,
  admin__quotaStatusOk: `
    background: rgba(104, 173, 123, 0.16);
    color: #376b45;
  `,
  admin__quotaStatusWarning: `
    background: rgba(218, 147, 74, 0.16);
    color: #9a5e1f;
  `,
  admin__quotaStatusUnavailable: `
    background: rgba(143, 122, 136, 0.16);
    color: #7d6474;
  `,
  admin__quotaMetricList: `
    margin: 0.8rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  `,
  admin__quotaMetricRow: `
    display: grid;
    grid-template-columns: 4.7rem minmax(0, 1fr);
    gap: 0.6rem;

    dt {
      margin: 0;
      color: #8c6677;
      font-size: calc(0.84rem + 2px);
      font-weight: 700;
    }

    dd {
      margin: 0;
      color: #4d3742;
      font-size: calc(0.9rem + 2px);
      word-break: break-word;
    }
  `,
  admin__quotaNote: `
    margin: 0.8rem 0 0;
    color: #876876;
    font-size: calc(0.84rem + 2px);
    line-height: 1.5;
  `,
} as const);
// #endregion

export { guestbookStyles, adminStyles };
