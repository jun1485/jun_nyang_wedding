export type FontPresetKey =
  | "gaegu"
  | "gowunBatang"
  | "ongleipParkDahyeon"
  | "fontTwo"
  | "griunGellyroll"
  | "griunMongtori"
  | "memomentKkukkukk";

interface FontPreset {
  label: string;
  fontFamily: string;
}

export const FONT_PRESETS: Record<FontPresetKey, FontPreset> = {
  gaegu: {
    label: "Gaegu",
    fontFamily: "'Gaegu'",
  },
  gowunBatang: {
    label: "Gowun Batang",
    fontFamily: "'Gowun Batang'",
  },
  ongleipParkDahyeon: {
    label: "온글잎 박다현체",
    fontFamily: "'Ongleip ParkDahyeon'",
  },
  fontTwo: {
    label: "Font 2",
    fontFamily: "'Font Two'",
  },
  griunGellyroll: {
    label: "Griun Gellyroll",
    fontFamily: "'Griun Gellyroll'",
  },
  griunMongtori: {
    label: "Griun Mongtori",
    fontFamily: "'Griun Mongtori'",
  },
  memomentKkukkukk: {
    label: "Memoment Kkukkukk",
    fontFamily: "'Memoment Kkukkukk'",
  },
};

export const GOOGLE_FONT_STYLESHEET_URL =
  "https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Gowun+Batang:wght@400;700&display=swap";

// 활성 폰트 프리셋 단일 변경 지점 유지
export const ACTIVE_FONT_PRESET: FontPresetKey = "ongleipParkDahyeon";

export function getActiveFontFamily(): string {
  return FONT_PRESETS[ACTIVE_FONT_PRESET].fontFamily;
}
