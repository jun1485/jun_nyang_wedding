import { defineStore } from "pinia";
import type { WeddingData } from "~/types/wedding";

export const useWeddingStore = defineStore("wedding", () => {
  const weddingData = ref<WeddingData | null>(null);
  const error = ref<Error | null>(null);

  const fetchWeddingData = async () => {
    if (weddingData.value) return;

    const { data, error: fetchError } = await useFetch<WeddingData>(
      "/api/wedding"
    );

    if (fetchError.value) {
      error.value = fetchError.value;
    } else if (data.value) {
      weddingData.value = data.value;
    }
  };

  const groom = computed(() => weddingData.value?.groom);
  const bride = computed(() => weddingData.value?.bride);
  const date = computed(() => weddingData.value?.date);
  const time = computed(() => weddingData.value?.time);
  const venue = computed(() => weddingData.value?.venue);
  const invitationMessage = computed(
    () => weddingData.value?.invitationMessage
  );
  const galleryImages = computed(() => weddingData.value?.galleryImages);

  return {
    weddingData,
    fetchWeddingData,
    groom,
    bride,
    date,
    time,
    venue,
    invitationMessage,
    galleryImages,
    error,
  };
});
