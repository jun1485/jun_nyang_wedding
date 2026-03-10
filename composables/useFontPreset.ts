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
  fontAssetPath?: string;
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
    fontAssetPath: "/fonts/ongleip-parkdahyeon.ttf",
  },
  fontTwo: {
    label: "Font 2",
    fontFamily: "'Font Two'",
    fontAssetPath: "/fonts/font-2.ttf",
  },
  griunGellyroll: {
    label: "Griun Gellyroll",
    fontFamily: "'Griun Gellyroll'",
    fontAssetPath: "/fonts/griun-gellyroll-rg.ttf",
  },
  griunMongtori: {
    label: "Griun Mongtori",
    fontFamily: "'Griun Mongtori'",
    fontAssetPath: "/fonts/griun-mongtori-rg.ttf",
  },
  memomentKkukkukk: {
    label: "Memoment Kkukkukk",
    fontFamily: "'Memoment Kkukkukk'",
    fontAssetPath: "/fonts/memoment-kkukkukk.ttf",
  },
};

export const GOOGLE_FONT_STYLESHEET_URL =
  "https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Gowun+Batang:wght@400;700&display=swap";

// 활성 폰트 프리셋 단일 변경 지점 유지
export const ACTIVE_FONT_PRESET: FontPresetKey = "ongleipParkDahyeon";
export const ACTIVE_FONT_FAMILY = FONT_PRESETS[ACTIVE_FONT_PRESET].fontFamily;
export const ACTIVE_FONT_ASSET_PATH =
  FONT_PRESETS[ACTIVE_FONT_PRESET].fontAssetPath ?? null;

export function getActiveFontFamily(): string {
  return ACTIVE_FONT_FAMILY;
}
