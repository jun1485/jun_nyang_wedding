<template>
  <div class="font-sans text-[var(--text-main)]">
    <MusicPlayer />
    <section
      class="relative flex min-h-[100svh] items-center justify-center px-4 py-10 sm:px-6 sm:py-16"
    >
      <div class="w-full max-w-4xl">
        <div class="section-card relative overflow-hidden px-5 py-8 sm:px-10 sm:py-12">
          <div class="hero-blush hero-blush-left" aria-hidden="true"></div>
          <div class="hero-blush hero-blush-right" aria-hidden="true"></div>

          <div class="relative z-[1] text-center">
            <span class="floral-chip mb-5">Blooming Day</span>
            <h1 class="hero-title text-4xl sm:text-5xl md:text-7xl">
              <span class="md:inline">{{ store.groom?.titleName }}</span>
              <span class="ampersand block md:inline mx-2">&</span>
              <span class="md:inline">{{ store.bride?.titleName }}</span>
            </h1>
            <p class="hero-subtitle mt-2 text-2xl sm:text-3xl md:text-4xl">
              Our Wedding
            </p>

            <div class="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              <div class="name-card">
                <p class="text-xl font-semibold sm:text-3xl">
                  {{ store.groom?.name }}
                </p>
                <p class="mt-1 text-xs uppercase tracking-[0.2em] text-[#8c6d7c]">
                  Groom
                </p>
              </div>
              <div class="name-card">
                <p class="text-xl font-semibold sm:text-3xl">
                  {{ store.bride?.name }}
                </p>
                <p class="mt-1 text-xs uppercase tracking-[0.2em] text-[#8c6d7c]">
                  Bride
                </p>
              </div>
            </div>

            <div class="mt-8 rounded-2xl bg-white/65 px-3 py-4 sm:px-4 sm:py-5">
              <Countdown
                v-if="store.weddingData?.weddingDateTime"
                :target-date="store.weddingData.weddingDateTime"
              />
            </div>

            <div class="mt-8 rounded-2xl border border-rose-200/60 bg-white/78 px-4 py-4 sm:px-6">
              <p class="text-base font-semibold text-[#624652] sm:text-2xl">
                {{ store.date }} · {{ store.time }}
              </p>
              <p class="mt-1 text-sm text-[#7a5b68] sm:text-lg">
                {{ store.venue?.name }}
              </p>
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
import { useWeddingStore } from "~/stores/wedding";

const store = useWeddingStore();
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

<style scoped>
.hero-title,
.hero-subtitle {
  font-family: "Gaegu", sans-serif;
}

.hero-title {
  margin: 0;
  color: #432f3a;
  line-height: 1.05;
  text-wrap: balance;
}

.hero-subtitle {
  color: #5f4552;
}

.ampersand {
  font-size: clamp(2.2rem, 9vw, 4.3rem);
  color: #d64e75;
}

.name-card {
  border-radius: 1rem;
  border: 1px solid rgba(231, 90, 132, 0.18);
  background: rgba(255, 255, 255, 0.82);
  padding: 0.95rem 0.75rem;
}

.hero-blush {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 9999px;
  pointer-events: none;
  opacity: 0.75;
}

.hero-blush-left {
  top: -110px;
  left: -90px;
  background: radial-gradient(
    circle,
    rgba(255, 205, 219, 0.55) 0%,
    rgba(255, 205, 219, 0) 72%
  );
}

.hero-blush-right {
  right: -90px;
  bottom: -110px;
  background: radial-gradient(
    circle,
    rgba(255, 229, 188, 0.55) 0%,
    rgba(255, 229, 188, 0) 72%
  );
}
</style>
