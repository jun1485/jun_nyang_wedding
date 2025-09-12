import type { WeddingData } from "~/types/wedding";

export const WEDDING_DATA: WeddingData = {
  groom: {
    name: "주정준",
    titleName: "Jeong Jun",
    tel: "010-1234-5678",
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
      { role: "아버지", name: "", tel: "010-0000-0003" },
      { role: "어머니", name: "정지연", tel: "010-0000-0004" },
    ],
  },
  date: "2026년 5월 16일",
  time: "오후 2시",
  weddingDateTime: "2026-05-16T14:00:00",
  venue: {
    // 최신 공식 명칭 반영
    name: "더링크서울 트리뷰트 포트폴리오 호텔 웨딩",
    address: "서울특별시 구로구 경인로 610",
    transportations: [
      { type: "지하철", details: "2호선 신도림역" },
      {
        type: "셔틀",
        details: "신도림역 1번 출구 셔틀 운행(예식 전후 20분 간격)",
      },
      { type: "버스", details: "더링크호텔 가든홀 인근 정류장 이용" },
      { type: "주차 안내", details: "호텔 내 주차장 이용 (2시간 무료)" },
    ],
  },
  invitationMessage: [
    "서로가 마주보며 다져온 사랑을",
    "이제 함께 한 곳을 바라보며 걸어갈 수 있는",
    "큰 사랑으로 키우고자 합니다.",
    "저희 두 사람이 사랑의 이름으로 지켜나갈 수 있도록",
    "가까이에서 축복해주시면 더없는 기쁨이겠습니다.",
  ],
  galleryImages: Array.from({ length: 6 }, (_, i) => ({
    src: `https://source.unsplash.com/random/500x500?wedding,couple&sig=${
      i + 1
    }`,
    alt: `웨딩 사진 ${i + 1}`,
  })),
};
