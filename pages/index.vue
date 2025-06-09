<template>
  <div class="bg-gray-100 font-sans">
    <MusicPlayer />
    <div
      class="min-h-screen flex flex-col items-center justify-center bg-cover bg-center text-white"
      :style="{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1522673607524-6a67d7595a78)',
      }"
    >
      <div
        class="bg-black bg-opacity-50 min-h-screen w-full flex flex-col items-center justify-center"
      >
        <div class="text-center p-8 max-w-2xl mx-auto">
          <h1
            class="text-5xl md:text-7xl font-display mb-4"
            style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)"
          >
            {{ store.groom?.titleName }} & {{ store.bride?.titleName }}
          </h1>
          <p
            class="text-2xl md:text-4xl text-gray-200 mb-8 font-display"
            style="text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5)"
          >
            Our Wedding
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
            <div class="text-center">
              <p class="text-3xl md:text-4xl font-semibold">
                {{ store.groom?.name }}
              </p>
              <p class="text-gray-300 mt-2">Groom</p>
            </div>
            <div class="text-center">
              <p class="text-3xl md:text-4xl font-semibold">
                {{ store.bride?.name }}
              </p>
              <p class="text-gray-300 mt-2">Bride</p>
            </div>
          </div>

          <div class="mb-12">
            <Countdown
              v-if="store.weddingData?.weddingDateTime"
              :target-date="store.weddingData.weddingDateTime"
            />
          </div>

          <div
            class="bg-white bg-opacity-20 p-8 rounded-lg shadow-lg backdrop-blur-sm text-gray-800"
          >
            <p class="text-3xl md:text-4xl font-light mb-4">{{ store.date }}</p>
            <p class="text-2xl md:text-3xl">{{ store.venue?.name }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sections -->
    <Invitation />
    <Gallery />
    <Venue />
    <Contact />
  </div>
</template>

<script setup lang="ts">
import { useWeddingStore } from "~/stores/wedding";

const store = useWeddingStore();

// SEO 및 메타 태그 설정
useHead({
  title: `${store.groom?.name} & ${store.bride?.name}의 결혼식에 초대합니다`,
  meta: [
    {
      name: "description",
      content: `${store.date} ${store.venue?.name}에서 열리는 저희의 결혼식에 오셔서 자리를 빛내주시길 바랍니다.`,
    },
    {
      property: "og:title",
      content: `${store.groom?.name} & ${store.bride?.name}의 결혼식`,
    },
    {
      property: "og:description",
      content: "저희의 새로운 시작을 함께 축복해주세요.",
    },
    { property: "og:image", content: "/og-image.jpg" }, // 나중에 대표 이미지를 public 폴더에 추가하면 좋습니다.
  ],
});
</script>

<style scoped>
/* Using font-display from tailwind.config.js */
.font-display {
  font-family: "Dancing Script", cursive;
}
</style>
