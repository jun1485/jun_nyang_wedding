// 전역 핀치/더블탭 줌 차단 처리 - iOS gesture 이벤트와 multi-touch 이동 이벤트 동시 차단 사용
export default defineNuxtPlugin(() => {
  let lastTouchEndAt = 0;

  const listenerOptions: AddEventListenerOptions = { passive: false };

  const handleGesture = (event: Event) => {
    event.preventDefault();
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const now = Date.now();
    const isDoubleTap = now - lastTouchEndAt <= 280;
    if (isDoubleTap) {
      event.preventDefault();
    }
    lastTouchEndAt = now;
  };

  document.addEventListener("gesturestart", handleGesture, listenerOptions);
  document.addEventListener("gesturechange", handleGesture, listenerOptions);
  document.addEventListener("gestureend", handleGesture, listenerOptions);
  document.addEventListener("touchmove", handleTouchMove, listenerOptions);
  document.addEventListener("touchend", handleTouchEnd, listenerOptions);
});
