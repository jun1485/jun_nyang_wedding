<template>
  <div :class="homeStyles.root">
    <MusicPlayer />
    <section :class="homeStyles.heroSection">
      <div :class="homeStyles.heroInner">
        <div :class="[sharedStyles.sectionCard, homeStyles.heroCard]">
          <div :class="[homeStyles.heroBlush, homeStyles.heroBlushLeft]" aria-hidden="true"></div>
          <div :class="[homeStyles.heroBlush, homeStyles.heroBlushRight]" aria-hidden="true"></div>

          <div :class="homeStyles.heroContent">
            <span :class="sharedStyles.floralChip">Blooming Day</span>
            <h1 :class="homeStyles.heroTitle">
              <span>{{ store.groom?.titleName }}</span>
              <span :class="homeStyles.ampersand">&</span>
              <span>{{ store.bride?.titleName }}</span>
            </h1>
            <p :class="homeStyles.heroSubtitle">Our Wedding</p>

            <div :class="homeStyles.namesGrid">
              <div :class="homeStyles.nameCard">
                <p :class="homeStyles.nameValue">
                  {{ store.groom?.name }}
                </p>
                <p :class="homeStyles.nameRole">Groom</p>
              </div>
              <div :class="homeStyles.nameCard">
                <p :class="homeStyles.nameValue">
                  {{ store.bride?.name }}
                </p>
                <p :class="homeStyles.nameRole">Bride</p>
              </div>
            </div>

            <div :class="homeStyles.countdownWrap">
              <Countdown
                v-if="store.weddingData?.weddingDateTime"
                :target-date="store.weddingData.weddingDateTime"
              />
            </div>

            <div :class="homeStyles.dateCard">
              <p :class="homeStyles.dateText">{{ store.date }} · {{ store.time }}</p>
              <p :class="homeStyles.venueText">{{ store.venue?.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Invitation />
    <Gallery />
    <Venue />
    <Contact />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import { useWeddingStore } from "~/stores/wedding";

const store = useWeddingStore();
const { sharedStyles, homeStyles } = useEmotionStyles();
const seoTitle = computed(
  () => `${store.groom?.name} & ${store.bride?.name}의 결혼식에 초대합니다`
);
const seoDescription = computed(
  () =>
    `${store.date} ${store.venue?.name}에서 열리는 저희의 결혼식에 오셔서 자리를 빛내주시길 바랍니다.`
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
      { property: "og:image", content: "/og-image.jpg" },
    ],
  };
});
</script>
