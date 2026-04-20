// Chrome DevTools .well-known 요청의 Vue Router 경고 방지용 서버 핸들러
export default defineEventHandler((event) => {
  setResponseStatus(event, 204);
  return null;
});
