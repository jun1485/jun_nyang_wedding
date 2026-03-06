import { computed } from "vue";

export function usePwaUpdateNotice() {
  const { pwaNoticeStyles } = useEmotionStyles();
  const pwa = usePWA();
  const isUpdateReady = computed(() => pwa?.needRefresh ?? false);

  async function applyUpdate() {
    if (!pwa) return;
    await pwa.updateServiceWorker(true);
  }

  async function dismissUpdateNotice() {
    if (!pwa) return;
    await pwa.cancelPrompt();
  }

  return {
    pwaNoticeStyles,
    isUpdateReady,
    applyUpdate,
    dismissUpdateNotice,
  };
}
