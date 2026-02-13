<template>
  <div :class="countdownStyles.root">
    <p :class="countdownStyles.title">결혼식이 피어나는 순간까지</p>
    <div :class="countdownStyles.grid">
      <div :class="countdownStyles.card">
        <p :class="countdownStyles.value">{{ time.days }}</p>
        <p :class="countdownStyles.label">Days</p>
      </div>
      <div :class="countdownStyles.card">
        <p :class="countdownStyles.value">{{ time.hours }}</p>
        <p :class="countdownStyles.label">Hours</p>
      </div>
      <div :class="countdownStyles.card">
        <p :class="countdownStyles.value">{{ time.minutes }}</p>
        <p :class="countdownStyles.label">Minutes</p>
      </div>
      <div :class="countdownStyles.card">
        <p :class="countdownStyles.value">{{ time.seconds }}</p>
        <p :class="countdownStyles.label">Seconds</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useEmotionStyles } from "~/composables/useEmotionStyles";

const props = defineProps({
  targetDate: {
    type: String,
    required: true,
  },
});

const { countdownStyles } = useEmotionStyles();
const time = ref({
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
});

let interval: ReturnType<typeof setInterval> | null = null;

const updateCountdown = () => {
  const target = new Date(props.targetDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0) {
    time.value = {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    };
    if (interval !== null) clearInterval(interval);
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
  if (interval !== null) clearInterval(interval);
});
</script>
