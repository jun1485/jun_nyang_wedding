import { WEDDING_DATA } from "../data/wedding";

// 핵심 로직: 결혼식 일정 ICS 파일 동적 생성
export default defineEventHandler((event) => {
  const { weddingDateTime, venue, groom, bride } = WEDDING_DATA;

  // 날짜 포맷: YYYYMMDDTHHmmssZ (간단 처리: 현지시간을 UTC로 간주하지 않고 Z 제거)
  const dt = weddingDateTime.replace(/[-:]/g, "").replace(".000", "");

  const summary = `${groom.name} & ${bride.name} 결혼식`;
  const description = `장소: ${venue.name}\\n주소: ${venue.address}`;

  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Wedding Invite//KOR//EN\nBEGIN:VEVENT\nUID:${Date.now()}@wedding\nDTSTAMP:${dt}\nDTSTART:${dt}\nSUMMARY:${summary}\nLOCATION:${venue.name}\nDESCRIPTION:${description}\nEND:VEVENT\nEND:VCALENDAR`;

  setHeader(event, "Content-Type", "text/calendar; charset=utf-8");
  setHeader(event, "Content-Disposition", "attachment; filename=Wedding.ics");

  return ics;
});




