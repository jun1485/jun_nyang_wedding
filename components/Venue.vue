<template>
  <section class="section-wrap">
    <div class="section-card px-5 py-8 sm:px-10 sm:py-11">
      <div class="text-center">
        <span class="floral-chip">Venue</span>
        <h2 class="section-title mt-4 text-3xl sm:text-4xl">오시는 길</h2>
      </div>

      <div class="mt-6 text-center">
        <p class="text-lg font-semibold sm:text-2xl">{{ store.venue?.name }}</p>
        <p class="mt-2 text-sm text-[#71535f] sm:text-base">{{ store.venue?.address }}</p>
      </div>

      <div
        class="relative mt-6 overflow-hidden rounded-2xl border border-rose-100 bg-white/75 shadow-lg"
      >
        <iframe
          class="h-[300px] w-full sm:h-80"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          :src="mapEmbedSrc"
          title="결혼식장 지도"
        ></iframe>
        <div class="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
          <a
            :href="kakaoMapUri"
            target="_blank"
            rel="noopener noreferrer"
            class="map-chip"
            >카카오맵</a
          >
          <a
            :href="naverMapUri"
            target="_blank"
            rel="noopener noreferrer"
            class="map-chip"
            >네이버지도</a
          >
          <a
            :href="googleMapUri"
            target="_blank"
            rel="noopener noreferrer"
            class="map-chip"
            >구글지도</a
          >
        </div>
      </div>

      <div class="mt-7">
        <h3 class="text-lg font-semibold text-[#432f39] sm:text-xl">교통편 안내</h3>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <div
            v-for="(transport, index) in store.venue?.transportations"
            :key="index"
            class="rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-3"
          >
            <p class="text-sm font-semibold text-[#5f4552]">{{ transport.type }}</p>
            <p class="mt-1 text-sm text-[#6f5864]">{{ transport.details }}</p>
          </div>
        </div>
      </div>

      <div class="mt-7 flex flex-wrap justify-center gap-2 sm:gap-3">
        <a :href="calendarIcsUri" class="petal-button">캘린더 추가</a>
        <button type="button" class="petal-button" @click="shareInvitation">
          청첩장 공유
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useWeddingStore } from "~/stores/wedding";

const store = useWeddingStore();
const encodedAddress = computed(() =>
  encodeURIComponent(store.venue?.address || "")
);
const encodedName = computed(() => encodeURIComponent(store.venue?.name || ""));

const mapQuery = computed(() => encodedName.value || encodedAddress.value);
const mapEmbedSrc = computed(
  () => `https://maps.google.com/maps?q=${mapQuery.value}&z=16&output=embed`
);
const kakaoMapUri = computed(
  () => `https://map.kakao.com/link/search/${mapQuery.value}`
);
const naverMapUri = computed(
  () => `https://map.naver.com/v5/search/${mapQuery.value}`
);
const googleMapUri = computed(
  () => `https://www.google.com/maps/search/?api=1&query=${mapQuery.value}`
);
const calendarIcsUri = "/api/calendar.ics";

async function shareInvitation() {
  if (typeof window === "undefined") return;

  const shareUrl = window.location.href;
  const shareData = {
    title: `${store.groom?.name} ♥ ${store.bride?.name} 결혼식 초대장`,
    text: `${store.date} ${store.time} ${store.venue?.name}`,
    url: shareUrl,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
  } catch (_) {
    // 공유 취소는 무시하고 다음 fallback으로 진행
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      window.alert("초대장 링크를 복사했어요.");
      return;
    }
  } catch (_) {
    // 일부 모바일 브라우저 권한 이슈 시 prompt fallback 사용
  }

  window.prompt("아래 링크를 복사해 공유해주세요.", shareUrl);
}
</script>

<style scoped>
.map-chip {
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background-color: rgba(255, 255, 255, 0.92);
  color: #563f4b;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
  padding: 0.42rem 0.7rem;
}
</style>
