<template>
  <div :class="countdownStyles.countdown__root">
    <div :class="countdownStyles.countdown__calendarPaper" aria-label="예식 달력">
      <div :class="countdownStyles.countdown__calendarHead">
        <p :class="countdownStyles.countdown__calendarMonthNumber">
          {{ monthlyCalendar.monthNumber }}
        </p>
        <p :class="countdownStyles.countdown__calendarMonthLabel">
          {{ monthlyCalendar.monthLabel }}
        </p>
      </div>
      <div :class="countdownStyles.countdown__calendarGuide" aria-hidden="true"></div>
      <div :class="countdownStyles.countdown__calendarGrid">
        <span
          v-for="cell in monthlyCalendar.cells"
          :key="cell.key"
          :class="[
            countdownStyles.countdown__calendarCell,
            cell.isEmpty ? countdownStyles.countdown__calendarCellEmpty : '',
            cell.isSunday ? countdownStyles.countdown__calendarCellSunday : '',
            cell.isSaturday ? countdownStyles.countdown__calendarCellSaturday : '',
            cell.isTargetDay ? countdownStyles.countdown__calendarCellTarget : '',
          ]"
        >
          {{ cell.label }}
        </span>
      </div>
    </div>
    <p :class="countdownStyles.countdown__title">결혼식이 피어나는 순간까지</p>
    <div :class="countdownStyles.countdown__grid">
      <div :class="countdownStyles.countdown__card">
        <p :class="countdownStyles.countdown__value">{{ time.days }}</p>
        <p :class="countdownStyles.countdown__label">Days</p>
      </div>
      <div :class="countdownStyles.countdown__card">
        <p :class="countdownStyles.countdown__value">{{ time.hours }}</p>
        <p :class="countdownStyles.countdown__label">Hours</p>
      </div>
      <div :class="countdownStyles.countdown__card">
        <p :class="countdownStyles.countdown__value">{{ time.minutes }}</p>
        <p :class="countdownStyles.countdown__label">Minutes</p>
      </div>
      <div :class="countdownStyles.countdown__card">
        <p :class="countdownStyles.countdown__value">{{ time.seconds }}</p>
        <p :class="countdownStyles.countdown__label">Seconds</p>
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
