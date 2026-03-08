import { injectGlobal } from "@emotion/css";

function withDialogLabels<T extends Record<string, string>>(styles: T): T {
  const entries = Object.entries(styles).map(([key, styleText]) => {
    injectGlobal`
      .${key} {
        ${styleText}
      }
    `;

    return [key, key];
  });

  return Object.fromEntries(entries) as T;
}

const dialogStyles = withDialogLabels({
  dialog__layer: `
    position: fixed;
    inset: 0;
    z-index: 180;
    display: grid;
    place-items: center;
    padding: 1.25rem;
    background: rgba(74, 43, 56, 0.34);
    backdrop-filter: blur(10px);
    animation: dialog-fade-in 180ms ease-out both;

    @keyframes dialog-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  dialog__panel: `
    width: min(100%, 22rem);
    border: 1px solid rgba(231, 90, 132, 0.2);
    border-radius: 1.5rem;
    background:
      radial-gradient(circle at top, rgba(255, 255, 255, 0.96), rgba(255, 246, 250, 0.94)),
      linear-gradient(180deg, rgba(255, 245, 248, 0.96), rgba(255, 255, 255, 0.98));
    box-shadow:
      0 24px 60px rgba(120, 63, 85, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.84);
    text-align: center;
    padding: 1.25rem 1.15rem 1.1rem;
    animation: dialog-panel-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;

    @keyframes dialog-panel-in {
      from {
        opacity: 0;
        transform: translateY(14px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `,
  dialog__chip: `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 1.85rem;
    padding: 0.25rem 0.72rem;
    border-radius: 9999px;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  `,
  dialog__chipSuccess: `
    background: rgba(222, 112, 149, 0.14);
    color: #b1446a;
  `,
  dialog__chipError: `
    background: rgba(152, 120, 133, 0.14);
    color: #7a5464;
  `,
  dialog__chipInfo: `
    background: rgba(139, 148, 194, 0.15);
    color: #5f6ea8;
  `,
  dialog__title: `
    margin: 0.9rem 0 0;
    color: #3f2b35;
    font-size: 1.15rem;
    font-weight: 800;
    line-height: 1.4;
  `,
  dialog__message: `
    margin: 0.55rem 0 0;
    color: #6a5060;
    font-size: 0.93rem;
    line-height: 1.65;
    white-space: pre-line;
    word-break: break-word;
  `,
  dialog__detailBox: `
    margin: 0.8rem 0 0;
    border: 1px dashed rgba(231, 90, 132, 0.2);
    border-radius: 1rem;
    background: rgba(255, 249, 251, 0.86);
    color: #6a5060;
    font-size: 0.88rem;
    font-weight: 700;
    line-height: 1.6;
    word-break: break-all;
    padding: 0.8rem 0.9rem;
    user-select: text;
  `,
  dialog__actionRow: `
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  `,
  dialog__button: `
    min-width: 8.8rem;
  `,
  dialog__promptInput: `
    display: block;
    width: 100%;
    margin: 0.8rem 0 0;
    border: 1px solid rgba(231, 90, 132, 0.22);
    border-radius: 0.75rem;
    background: rgba(255, 252, 253, 0.92);
    color: #3f2b35;
    font-size: 0.93rem;
    line-height: 1.5;
    padding: 0.65rem 0.8rem;
    outline: none;
    transition: border-color 160ms ease;

    &::placeholder {
      color: #b8a0ab;
    }

    &:focus {
      border-color: rgba(231, 90, 132, 0.48);
    }
  `,
  dialog__promptActionRow: `
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  `,
  dialog__promptCancelButton: `
    min-width: 5.5rem;
    border: 1px solid rgba(231, 90, 132, 0.22);
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.9);
    color: #7a5464;
    font-size: 0.88rem;
    font-weight: 700;
    line-height: 1;
    padding: 0.62rem 1rem;
    cursor: pointer;
    transition: background 160ms ease, border-color 160ms ease;

    &:hover {
      background: rgba(255, 246, 250, 1);
      border-color: rgba(231, 90, 132, 0.36);
    }
  `,
} as const);

export function useDialogStyles() {
  return {
    dialogStyles,
  };
}
