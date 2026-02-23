<template>
  <div :class="countdownStyles.root">
    <div :class="countdownStyles.calendarPaper" aria-label="예식 달력">
      <div :class="countdownStyles.calendarHead">
        <p :class="countdownStyles.calendarMonthNumber">
          {{ monthlyCalendar.monthNumber }}
        </p>
        <p :class="countdownStyles.calendarMonthLabel">
          {{ monthlyCalendar.monthLabel }}
        </p>
      </div>
      <div :class="countdownStyles.calendarGuide" aria-hidden="true"></div>
      <div :class="countdownStyles.calendarGrid">
        <span
          v-for="cell in monthlyCalendar.cells"
          :key="cell.key"
          :class="[
            countdownStyles.calendarCell,
            cell.isEmpty ? countdownStyles.calendarCellEmpty : '',
            cell.isSunday ? countdownStyles.calendarCellSunday : '',
            cell.isSaturday ? countdownStyles.calendarCellSaturday : '',
            cell.isTargetDay ? countdownStyles.calendarCellTarget : '',
          ]"
        >
          {{ cell.label }}
        </span>
      </div>
    </div>
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
import { toRef } from "vue";
import { useCountdown } from "~/composables/useCountdown";
import { useEmotionStyles } from "~/composables/useEmotionStyles";

const props = defineProps<{
  targetDate: string;
}>();

const { countdownStyles } = useEmotionStyles();
const { time, monthlyCalendar } = useCountdown(toRef(props, "targetDate"));
</script>
