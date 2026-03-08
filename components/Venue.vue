<template>
  <section :class="sharedStyles.shared__sectionWrap">
    <div :class="[sharedStyles.shared__sectionCard, venueStyles.venue__card]">
      <div :class="venueStyles.venue__header">
        <span :class="venueStyles.venue__floralChip">Venue</span>
        <h2
          :class="[sharedStyles.shared__sectionTitle, venueStyles.venue__title]"
        >
          오시는 길
        </h2>
      </div>

      <div :class="venueStyles.venue__venueInfo">
        <p :class="venueStyles.venue__venueName">{{ store.venue?.name }}</p>
        <p :class="venueStyles.venue__venueAddress">
          {{ store.venue?.address }}
        </p>
      </div>

      <div :class="venueStyles.venue__mapWrap">
        <iframe
          :class="venueStyles.venue__mapFrame"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          :src="mapEmbedSrc"
          title="결혼식장 지도"
        ></iframe>
        <div :class="venueStyles.venue__mapChipWrap">
          <a
            :href="kakaoMapUri"
            target="_blank"
            rel="noopener noreferrer"
            :class="venueStyles.venue__mapChip"
            >카카오맵</a
          >
          <a
            :href="naverMapUri"
            target="_blank"
            rel="noopener noreferrer"
            :class="venueStyles.venue__mapChip"
            >네이버지도</a
          >
          <a
            :href="googleMapUri"
            target="_blank"
            rel="noopener noreferrer"
            :class="venueStyles.venue__mapChip"
            >구글지도</a
          >
        </div>
      </div>

      <div :class="venueStyles.venue__transportSection">
        <h3 :class="venueStyles.venue__transportTitle">교통편 안내</h3>
        <div :class="venueStyles.venue__transportGrid">
          <div
            v-for="(transport, index) in store.venue?.transportations"
            :key="index"
            :class="venueStyles.venue__transportCard"
          >
            <p :class="venueStyles.venue__transportType">
              {{ transport.type }}
            </p>
            <p :class="venueStyles.venue__transportDetails">
              {{ transport.details }}
            </p>
          </div>
        </div>
      </div>

      <div :class="venueStyles.venue__actionRow">
        <button
          type="button"
          :class="[
            sharedStyles.shared__petalButton,
            venueStyles.venue__actionButton,
          ]"
          @click="shareInvitation"
        >
          청첩장 공유
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCommonDialog } from "~/composables/useCommonDialog";
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import { useWeddingStore } from "~/stores/wedding";

const store = useWeddingStore();
const { sharedStyles, venueStyles } = useEmotionStyles();
const { openDialog } = useCommonDialog();
const encodedAddress = computed(() =>
  encodeURIComponent(store.venue?.address || ""),
);
const encodedName = computed(() => encodeURIComponent(store.venue?.name || ""));

const mapQuery = computed(() => encodedName.value || encodedAddress.value);
const mapEmbedSrc = computed(
  () => `https://maps.google.com/maps?q=${mapQuery.value}&z=16&output=embed`,
);
const kakaoMapUri = computed(
  () => `https://map.kakao.com/link/search/${mapQuery.value}`,
);
const naverMapUri = computed(
  () => `https://map.naver.com/v5/search/${mapQuery.value}`,
);
const googleMapUri = computed(
  () => `https://www.google.com/maps/search/?api=1&query=${mapQuery.value}`,
);

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
      openDialog({
        tone: "success",
        message: "초대장 링크를 복사했어요.",
      });
      return;
    }
  } catch (_) {
    // 클립보드 권한 실패 시 다이얼로그 fallback 분기 유지
  }

  openDialog({
    tone: "info",
    title: "초대장 링크 복사",
    message: "아래 링크를 길게 눌러 복사해 공유해 주세요.",
    detailText: shareUrl,
  });
}
</script>
