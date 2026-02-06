<template>
  <div class="music-dock">
    <button
      type="button"
      class="music-dock__btn"
      @click="togglePlay"
      :title="isPlaying ? '음악 일시정지' : '음악 재생'"
      :aria-label="isPlaying ? '음악 일시정지' : '음악 재생'"
    >
      <svg
        v-if="isPlaying"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="h-4 w-4"
      >
        <path d="M8 6h3v12H8zm5 0h3v12h-3z" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="h-4 w-4"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>

    <!-- 볼륨 조절 영역 - 스피커 아이콘 + 슬라이더 -->
    <button
      type="button"
      class="music-dock__btn"
      @click="toggleMute"
      :title="isMuted ? '음소거 해제' : '음소거'"
      :aria-label="isMuted ? '음소거 해제' : '음소거'"
    >
      <!-- 음소거 아이콘 -->
      <svg
        v-if="isMuted || volume === 0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="h-4 w-4"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-6 6" />
        <path stroke-linecap="round" stroke-linejoin="round" d="m13 9 6 6" />
      </svg>
      <!-- 볼륨 아이콘 -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="h-4 w-4"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.5 8.5a5 5 0 0 1 0 7" />
      </svg>
    </button>

    <input
      type="range"
      class="music-dock__volume"
      min="0"
      max="1"
      step="0.01"
      :value="volume"
      @input="onVolumeInput"
      title="볼륨 조절"
      aria-label="볼륨 조절"
    />

    <span class="music-dock__label">BGM</span>

    <audio
      ref="audioPlayer"
      :src="currentSrc"
      preload="metadata"
      autoplay
      playsinline
      @ended="nextTrack"
    >
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script setup lang="ts">
import { useMusicPlayer } from '~/composables/useMusicPlayer'

const {
  audioPlayer,
  isPlaying,
  isMuted,
  volume,
  currentSrc,
  togglePlay,
  toggleMute,
  setVolume,
  nextTrack,
} = useMusicPlayer()

/** range input 이벤트 → composable 볼륨 반영 */
function onVolumeInput(event: Event) {
  const target = event.target as HTMLInputElement
  setVolume(Number(target.value))
}
</script>

<style scoped>
.music-dock {
  position: fixed;
  right: 0.9rem;
  bottom: max(0.9rem, env(safe-area-inset-bottom));
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border-radius: 9999px;
  border: 1px solid rgba(231, 90, 132, 0.28);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
  padding: 0.32rem 0.45rem 0.32rem 0.35rem;
  box-shadow: 0 10px 24px rgba(205, 87, 125, 0.22);
}

.music-dock__btn {
  display: inline-flex;
  width: 2.1rem;
  height: 2.1rem;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 9999px;
  background: rgba(255, 245, 249, 0.95);
  color: #be3f68;
  cursor: pointer;
}

/* 볼륨 슬라이더 - 웨딩 테마 핑크 계열 */
.music-dock__volume {
  width: 3.8rem;
  height: 0.25rem;
  appearance: none;
  -webkit-appearance: none;
  background: rgba(190, 63, 104, 0.2);
  border-radius: 9999px;
  outline: none;
  cursor: pointer;
}

.music-dock__volume::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 50%;
  background: #be3f68;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(190, 63, 104, 0.35);
  cursor: pointer;
}

.music-dock__volume::-moz-range-thumb {
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 50%;
  background: #be3f68;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(190, 63, 104, 0.35);
  cursor: pointer;
}

.music-dock__label {
  color: #8c5a70;
  font-family: "Gaegu", sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0 0.38rem 0 0.12rem;
}

@media (min-width: 640px) {
  .music-dock {
    right: 1.35rem;
    padding-right: 0.5rem;
  }
}
</style>
