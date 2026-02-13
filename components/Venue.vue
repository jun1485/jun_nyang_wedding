<template>
  <section :class="sharedStyles.sectionWrap">
    <div :class="[sharedStyles.sectionCard, venueStyles.card]">
      <div :class="venueStyles.header">
        <span :class="sharedStyles.floralChip">Venue</span>
        <h2 :class="[sharedStyles.sectionTitle, venueStyles.title]">오시는 길</h2>
      </div>

      <div :class="venueStyles.venueInfo">
        <p :class="venueStyles.venueName">{{ store.venue?.name }}</p>
        <p :class="venueStyles.venueAddress">{{ store.venue?.address }}</p>
      </div>

      <div :class="venueStyles.mapWrap">
        <iframe
          :class="venueStyles.mapFrame"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          :src="mapEmbedSrc"
          title="결혼식장 지도"
        ></iframe>
        <div :class="venueStyles.mapChipWrap">
          <a
            :href="kakaoMapUri"
            target="_blank"
            rel="noopener noreferrer"
            :class="venueStyles.mapChip"
            >카카오맵</a
          >
          <a
            :href="naverMapUri"
            target="_blank"
            rel="noopener noreferrer"
            :class="venueStyles.mapChip"
            >네이버지도</a
          >
          <a
            :href="googleMapUri"
            target="_blank"
            rel="noopener noreferrer"
            :class="venueStyles.mapChip"
            >구글지도</a
          >
        </div>
      </div>

      <div :class="venueStyles.transportSection">
        <h3 :class="venueStyles.transportTitle">교통편 안내</h3>
        <div :class="venueStyles.transportGrid">
          <div
            v-for="(transport, index) in store.venue?.transportations"
            :key="index"
            :class="venueStyles.transportCard"
          >
            <p :class="venueStyles.transportType">{{ transport.type }}</p>
            <p :class="venueStyles.transportDetails">{{ transport.details }}</p>
          </div>
        </div>
      </div>

      <div :class="venueStyles.actionRow">
        <a :href="calendarIcsUri" :class="sharedStyles.petalButton">캘린더 추가</a>
        <button type="button" :class="sharedStyles.petalButton" @click="shareInvitation">
          청첩장 공유
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import { useWeddingStore } from "~/stores/wedding";

const store = useWeddingStore();
const { sharedStyles, venueStyles } = useEmotionStyles();
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
    // 공유 취소 시 복사 fallback 분기 유지
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      window.alert("초대장 링크를 복사했어요.");
      return;
    }
  } catch (_) {
    // 클립보드 권한 실패 시 prompt fallback 분기 유지
  }

  window.prompt("아래 링크를 복사해 공유해주세요.", shareUrl);
}
</script>
