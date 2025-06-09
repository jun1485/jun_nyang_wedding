<template>
  <div class="text-center">
    <p
      class="text-2xl md:text-3xl font-light mb-6"
      style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3)"
    >
      우리의 결혼식까지 남은 시간
    </p>
    <div class="grid grid-cols-4 gap-4">
      <div
        class="p-4 bg-white bg-opacity-25 rounded-lg shadow-lg text-gray-800"
      >
        <p class="text-4xl font-bold">{{ time.days }}</p>
        <p class="text-sm">Days</p>
      </div>
      <div
        class="p-4 bg-white bg-opacity-25 rounded-lg shadow-lg text-gray-800"
      >
        <p class="text-4xl font-bold">{{ time.hours }}</p>
        <p class="text-sm">Hours</p>
      </div>
      <div
        class="p-4 bg-white bg-opacity-25 rounded-lg shadow-lg text-gray-800"
      >
        <p class="text-4xl font-bold">{{ time.minutes }}</p>
        <p class="text-sm">Minutes</p>
      </div>
      <div
        class="p-4 bg-white bg-opacity-25 rounded-lg shadow-lg text-gray-800"
      >
        <p class="text-4xl font-bold">{{ time.seconds }}</p>
        <p class="text-sm">Seconds</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  targetDate: {
    type: String,
    required: true,
  },
});

const time = ref({
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
});

let interval: NodeJS.Timeout;

const updateCountdown = () => {
  const target = new Date(props.targetDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0) {
    if (interval) clearInterval(interval);
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  time.value = {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
};

onMounted(() => {
  updateCountdown();
  interval = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>
