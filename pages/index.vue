<template>
  <div :class="homeStyles.home__root">
    <MusicPlayer />
    <section :class="homeStyles.home__heroSection">
      <div :class="homeStyles.home__heroInner">
        <div :class="[sharedStyles.shared__sectionCard, homeStyles.home__heroCard]">
          <div
            :class="[homeStyles.home__heroBlush, homeStyles.home__heroBlushLeft]"
            aria-hidden="true"
          ></div>
          <div
            :class="[homeStyles.home__heroBlush, homeStyles.home__heroBlushRight]"
            aria-hidden="true"
          ></div>

          <div :class="homeStyles.home__heroContent">
            <span :class="sharedStyles.shared__floralChip">Blooming Day</span>
            <h1 :class="homeStyles.home__heroTitle">
              <span>{{ store.groom?.titleName }}</span>
              <span :class="homeStyles.home__ampersand">&</span>
              <span>{{ store.bride?.titleName }}</span>
            </h1>
            <p :class="homeStyles.home__heroSubtitle">Our Wedding</p>

            <div :class="homeStyles.home__namesGrid">
              <div :class="homeStyles.home__nameCard">
                <p :class="homeStyles.home__nameValue">
                  {{ store.groom?.name }}
                </p>
                <p :class="homeStyles.home__nameRole">Groom</p>
              </div>
              <div :class="homeStyles.home__nameCard">
                <p :class="homeStyles.home__nameValue">
                  {{ store.bride?.name }}
                </p>
                <p :class="homeStyles.home__nameRole">Bride</p>
              </div>
            </div>

            <div :class="homeStyles.home__countdownWrap">
              <Countdown
                v-if="store.weddingData?.weddingDateTime"
                :target-date="store.weddingData.weddingDateTime"
              />
            </div>

            <div :class="homeStyles.home__dateCard">
              <p :class="homeStyles.home__dateText">
                {{ store.date }} {{ store.time }}
              </p>
              <p :class="homeStyles.home__venueText">{{ store.venue?.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <LazyInvitation />
    <LazyGallery />
    <LazyVenue />
    <LazyGuestbook />
    <LazyContact />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import { useWeddingStore } from "~/stores/wedding";

const store = useWeddingStore();
const { sharedStyles, homeStyles } = useEmotionStyles();
const SEO_SITE_URL = "https://junnyangwedding.vercel.app";
const SEO_IMAGE_URL = `${SEO_SITE_URL}/og-image.jpg`;
const seoTitle = computed(
  () => `${store.groom?.name} & ${store.bride?.name}의 결혼식에 초대합니다`,
);
const seoDescription = computed(
  () =>
    `${store.date} ${store.venue?.name}에서 열리는 저희의 결혼식에 오셔서 자리를 빛내주시길 바랍니다.`,
);

// SEO 및 메타 태그 설정
useHead(() => {
  return {
    title: seoTitle.value,
    meta: [
      {
        name: "description",
        content: seoDescription.value,
      },
      {
        property: "og:title",
        content: `${store.groom?.name} & ${store.bride?.name}의 결혼식`,
      },
      {
        property: "og:description",
        content: "저희의 새로운 시작을 함께 축복해주세요.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SEO_SITE_URL },
      { property: "og:image", content: SEO_IMAGE_URL },
      { property: "og:image:secure_url", content: SEO_IMAGE_URL },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "3648" },
      { property: "og:image:height", content: "5472" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: seoTitle.value },
      { name: "twitter:description", content: seoDescription.value },
      { name: "twitter:image", content: SEO_IMAGE_URL },
    ],
  };
});
</script>
