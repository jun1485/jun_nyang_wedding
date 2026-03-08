import { injectGlobal } from "@emotion/css";

// #region 브레이크포인트
export const SM_BREAKPOINT = "640px";
export const MD_BREAKPOINT = "768px";
// #endregion

// #region Emotion 라벨링
export function withEmotionLabels<T extends Record<string, string>>(
  scope: string,
  styles: T,
): T {
  const entries = Object.entries(styles).map(([key, styleText]) => {
    const labelClassName = key;
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
