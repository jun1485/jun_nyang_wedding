import { defineAsyncComponent } from "vue";
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import { useWeddingStore } from "~/stores/wedding";

export async function useAppShell() {
  const { appStyles } = useEmotionStyles();
  const weddingStore = useWeddingStore();
  const AsyncFlowerPetals = defineAsyncComponent(
    () => import("~/components/WebGL/FlowerPetals.vue"),
  );

  await weddingStore.fetchWeddingData();

  return {
    appStyles,
    AsyncFlowerPetals,
  };
}
