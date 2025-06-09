export interface Person {
  titleName: string;
  name: string;
  tel: string;
}

export interface Parent {
  role: "아버지" | "어머니";
  name: string;
  tel: string;
}

export interface WeddingData {
  groom: Person & { parents: Parent[] };
  bride: Person & { parents: Parent[] };
  date: string;
  time: string;
  weddingDateTime: string;
  venue: {
    name: string;
    address: string;
    transportations: {
      type: "지하철" | "버스" | "주차 안내";
      details: string;
    }[];
  };
  invitationMessage: string[];
  galleryImages: { src: string; alt: string }[];
}
