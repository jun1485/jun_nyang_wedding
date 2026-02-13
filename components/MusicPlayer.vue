<template>
  <div :class="musicPlayerStyles.dock">
    <button
      type="button"
      :class="musicPlayerStyles.button"
      @click="togglePlay"
      :title="isPlaying ? '음악 일시정지' : '음악 재생'"
      :aria-label="isPlaying ? '음악 일시정지' : '음악 재생'"
    >
      <svg
        v-if="isPlaying"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        :class="musicPlayerStyles.icon"
      >
        <path d="M8 6h3v12H8zm5 0h3v12h-3z" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        :class="musicPlayerStyles.icon"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>

    <button
      type="button"
      :class="musicPlayerStyles.button"
      @click="toggleMute"
      :title="isMuted ? '음소거 해제' : '음소거'"
      :aria-label="isMuted ? '음소거 해제' : '음소거'"
    >
      <svg
        v-if="isMuted || volume === 0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        :class="musicPlayerStyles.icon"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-6 6" />
        <path stroke-linecap="round" stroke-linejoin="round" d="m13 9 6 6" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        :class="musicPlayerStyles.icon"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.5 8.5a5 5 0 0 1 0 7" />
      </svg>
    </button>

    <input
      type="range"
      :class="musicPlayerStyles.volume"
      min="0"
      max="1"
      step="0.01"
      :value="volume"
      @input="onVolumeInput"
      title="볼륨 조절"
      aria-label="볼륨 조절"
    />

    <span :class="musicPlayerStyles.label">BGM</span>

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
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import { useMusicPlayer } from "~/composables/useMusicPlayer";

const { musicPlayerStyles } = useEmotionStyles();
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
} = useMusicPlayer();

function onVolumeInput(event: Event) {
  const target = event.target as HTMLInputElement;
  setVolume(Number(target.value));
}
</script>
