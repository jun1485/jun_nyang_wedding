import type { RemittanceAccount, WeddingData } from "~/types/wedding";

const GROOM_REMITTANCE_ACCOUNTS: RemittanceAccount[] = [
  {
    label: "신랑 주정준",
    bank: "국민은행",
    accountNumber: "000000-00-000000",
  },
  {
    label: "신랑 아버지 주진표",
    bank: "신한은행",
    accountNumber: "000-000-000000",
  },
  {
    label: "신랑 어머니 장성애",
    bank: "하나은행",
    accountNumber: "000-000000-00000",
  },
];

const BRIDE_REMITTANCE_ACCOUNTS: RemittanceAccount[] = [
  {
    label: "신부 이인영",
    bank: "우리은행",
    accountNumber: "000-0000-000000",
  },
  {
    label: "신부 아버지 이덕수",
    bank: "농협은행",
    accountNumber: "000-00-000000",
  },
  {
    label: "신부 어머니 정지연",
    bank: "카카오뱅크",
    accountNumber: "0000-00-0000000",
  },
];

export const WEDDING_DATA: WeddingData = {
  groom: {
    name: "주정준",
    titleName: "Jeong Jun",
    tel: "010-6307-1485",
    parents: [
      { role: "아버지", name: "주진표", tel: "010-0000-0001" },
      { role: "어머니", name: "장성애", tel: "010-0000-0002" },
    ],
  },
  bride: {
    name: "이인영",
    titleName: "In Young",
    tel: "010-9876-5432",
    parents: [
      { role: "아버지", name: "이덕수", tel: "010-0000-0003" },
      { role: "어머니", name: "정지연", tel: "010-0000-0004" },
    ],
  },
  date: "2026년 5월 16일",
  time: "오후 3시",
  weddingDateTime: "2026-05-16T15:00:00",
  venue: {
    // venue 표기 일관성 유지 및 예식홀 정보 병기 반영
    name: "더링크서울 호텔 웨딩 (5층 가든홀)",
    address: "서울특별시 구로구 경인로 610",
    transportations: [
      {
        type: "지하철",
        details:
          "2호선 신도림역 1번 출구 도보 약 7분\n1호선 구로역 3번 출구 도보 약 6분",
      },
      {
        type: "셔틀",
        details: "신도림역 1번 출구 셔틀 운행 (5분 간격)",
      },
      { type: "버스", details: "더링크서울 호텔 인근 정류장 이용" },
      {
        type: "주차 안내",
        details:
          "호텔 지하 주차장(B1~B6) 및 외부 주차장 \n 1시간 30분 무료 주차/ 초과 15분당 1,000원 주차비 발생",
      },
    ],
  },
  invitationMessage: [
    "우연처럼 시작된 인연이",
    "저희를 여기까지 이끌어주었습니다.",
    "",
    "서로의 하루를",
    "가장 먼저 나누고 싶은 사람이 되어",
    "이제 평생을 약속하려 합니다.",
    "해피엔딩이 아닌",
    "가장 설레는 시작이 될 그날,",
    "함께 축복해 주세요.",
  ],
  remittanceAccounts: {
    groom: GROOM_REMITTANCE_ACCOUNTS,
    bride: BRIDE_REMITTANCE_ACCOUNTS,
  },
  galleryImages: Array.from({ length: 6 }, (_, i) => ({
    src: `https://source.unsplash.com/random/500x500?wedding,couple&sig=${
      i + 1
    }`,
    alt: `웨딩 사진 ${i + 1}`,
  })),
};
