import { defineStore } from "pinia";
import type { WeddingData } from "~/types/wedding";

export const useWeddingStore = defineStore("wedding", () => {
  const weddingData = ref<WeddingData | null>(null);
  const error = ref<Error | null>(null);
  const gallery = ref<{ src: string; alt: string }[] | null>(null);

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

  const fetchGallery = async () => {
    if (gallery.value) return;
    const { data } = await useFetch<{ src: string; alt: string }[]>(
      "/api/gallery"
    );
    if (data.value && data.value.length > 0) {
      gallery.value = data.value;
    } else {
      // 서버에 이미지가 없는 경우 weddingData.galleryImages로 fallback
      gallery.value = weddingData.value?.galleryImages ?? [];
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
  const galleryImages = computed(
    () => gallery.value ?? weddingData.value?.galleryImages ?? []
  );

  return {
    weddingData,
    fetchWeddingData,
    fetchGallery,
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
