<template>
  <div class="text-center">
    <p class="count-title text-sm sm:text-base">결혼식이 피어나는 순간까지</p>
    <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      <div class="count-card">
        <p class="count-value">{{ time.days }}</p>
        <p class="count-label">Days</p>
      </div>
      <div class="count-card">
        <p class="count-value">{{ time.hours }}</p>
        <p class="count-label">Hours</p>
      </div>
      <div class="count-card">
        <p class="count-value">{{ time.minutes }}</p>
        <p class="count-label">Minutes</p>
      </div>
      <div class="count-card">
        <p class="count-value">{{ time.seconds }}</p>
        <p class="count-label">Seconds</p>
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

<style scoped>
.count-title {
  margin: 0;
  color: #6f5360;
  font-family: "Gaegu", sans-serif;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.count-card {
  border-radius: 0.9rem;
  border: 1px solid rgba(231, 90, 132, 0.22);
  background: rgba(255, 255, 255, 0.84);
  padding: 0.7rem 0.45rem;
}

.count-value {
  margin: 0;
  color: #422f39;
  font-size: clamp(1.35rem, 5vw, 2.05rem);
  font-weight: 700;
  line-height: 1.1;
}

.count-label {
  margin: 0.2rem 0 0;
  color: #8d6f7d;
  font-size: 0.72rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}
</style>
