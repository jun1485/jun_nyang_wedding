export type FontPresetKey =
  | "gaegu"
  | "gowunBatang"
  | "nanumPenScript"
  | "notoSansKr"
  | "doHyeon";

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
  nanumPenScript: {
    label: "Nanum Pen Script",
    fontFamily: "'Nanum Pen Script'",
  },
  notoSansKr: {
    label: "Noto Sans KR",
    fontFamily: "'Noto Sans KR'",
  },
  doHyeon: {
    label: "Do Hyeon",
    fontFamily: "'Do Hyeon'",
  },
};

export const GOOGLE_FONT_STYLESHEET_URL =
  "https://fonts.googleapis.com/css2?family=Do+Hyeon&family=Gaegu:wght@400;700&family=Gowun+Batang:wght@400;700&family=Nanum+Pen+Script&family=Noto+Sans+KR:wght@400;500;700&display=swap";

// 활성 폰트 프리셋 단일 변경 지점 유지
export const ACTIVE_FONT_PRESET: FontPresetKey = "gaegu";

export function getActiveFontFamily(): string {
  return FONT_PRESETS[ACTIVE_FONT_PRESET].fontFamily;
}
