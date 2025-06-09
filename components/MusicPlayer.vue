<template>
  <div class="fixed bottom-5 right-5 z-50">
    <button
      @click="togglePlay"
      class="w-14 h-14 rounded-full bg-white bg-opacity-30 backdrop-blur-sm shadow-lg flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-white"
    >
      <span v-if="isPlaying">❚❚</span>
      <span v-else>▶</span>
    </button>
    <audio ref="audioPlayer" loop>
      <source
        src="https://www.chosic.com/wp-content/uploads/2021/07/Warm-Memories-Emotional-Inspiring-Piano.mp3"
        type="audio/mpeg"
      />
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const audioPlayer = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);

const togglePlay = () => {
  if (audioPlayer.value) {
    if (isPlaying.value) {
      audioPlayer.value.pause();
    } else {
      audioPlayer.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
};
</script>
