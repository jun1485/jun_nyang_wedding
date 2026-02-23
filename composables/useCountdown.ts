import { computed, onMounted, onUnmounted, ref, type Ref } from "vue";

// #region 타입 정의
interface CountdownTimeState {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

interface MonthlyCalendarCell {
  key: string;
  label: string;
  isEmpty: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  isTargetDay: boolean;
}

interface MonthlyCalendarState {
  monthNumber: string;
  monthLabel: string;
  cells: MonthlyCalendarCell[];
}
// #endregion

// #region 상수
const DEFAULT_TIME_STATE: CountdownTimeState = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
};

const MONTH_DAYS_PER_WEEK = 7;
const MINIMUM_CALENDAR_ROWS = 5;
const DEFAULT_CALENDAR_STATE: MonthlyCalendarState = {
  monthNumber: "--",
  monthLabel: "MONTH ----",
  cells: [],
};
// #endregion

// #region 포맷 유틸
const monthLabelFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
});

function createEmptyCalendarCell(index: number): MonthlyCalendarCell {
  return {
    key: `empty-${index}`,
    label: "",
    isEmpty: true,
    isSunday: false,
    isSaturday: false,
    isTargetDay: false,
  };
}

function createEmptyCalendarState(): MonthlyCalendarState {
  const emptyCellCount = MINIMUM_CALENDAR_ROWS * MONTH_DAYS_PER_WEEK;
  return {
    ...DEFAULT_CALENDAR_STATE,
    cells: Array.from({ length: emptyCellCount }, (_, index) =>
      createEmptyCalendarCell(index)
    ),
  };
}

function createMonthlyCalendar(dateValue: Date): MonthlyCalendarState {
  const year = dateValue.getFullYear();
  const monthIndex = dateValue.getMonth();
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const requiredCellCount = firstDayOfWeek + daysInMonth;
  const minimumCellCount = MINIMUM_CALENDAR_ROWS * MONTH_DAYS_PER_WEEK;
  const totalCellCount = Math.max(
    minimumCellCount,
    Math.ceil(requiredCellCount / MONTH_DAYS_PER_WEEK) * MONTH_DAYS_PER_WEEK
  );
  const targetDay = dateValue.getDate();

  const cells = Array.from({ length: totalCellCount }, (_, index) => {
    const day = index - firstDayOfWeek + 1;
    if (day < 1 || day > daysInMonth) {
      return createEmptyCalendarCell(index);
    }

    const dayOfWeek = index % MONTH_DAYS_PER_WEEK;
    return {
      key: `${year}-${monthIndex + 1}-${day}`,
      label: String(day),
      isEmpty: false,
      isSunday: dayOfWeek === 0,
      isSaturday: dayOfWeek === MONTH_DAYS_PER_WEEK - 1,
      isTargetDay: day === targetDay,
    };
  });

  return {
    monthNumber: String(monthIndex + 1),
    monthLabel: `${monthLabelFormatter.format(dateValue).toUpperCase()} ${year}`,
    cells,
  };
}
// #endregion

/**
 * 카운트다운 시간/월간 달력 정보 계산 제공 - 타깃 날짜 기반 숫자/셀 데이터 동기화 유지
 */
export function useCountdown(targetDate: Ref<string>) {
  // #region 상태
  const time = ref<CountdownTimeState>({ ...DEFAULT_TIME_STATE });
  const targetDateValue = computed(() => new Date(targetDate.value));
  const targetTimestamp = computed(() => targetDateValue.value.getTime());
  const hasValidTargetDate = computed(
    () => !Number.isNaN(targetTimestamp.value)
  );
  // #endregion

  // #region 캘린더
  const monthlyCalendar = computed<MonthlyCalendarState>(() => {
    if (!hasValidTargetDate.value) {
      return createEmptyCalendarState();
    }

    return createMonthlyCalendar(targetDateValue.value);
  });
  // #endregion

  // #region 카운트다운 계산
  let interval: ReturnType<typeof setInterval> | null = null;

  function resetCountdown() {
    time.value = { ...DEFAULT_TIME_STATE };
  }

  function updateCountdown() {
    if (!hasValidTargetDate.value) {
      resetCountdown();
      return;
    }

    const now = Date.now();
    const difference = targetTimestamp.value - now;

    if (difference <= 0) {
      resetCountdown();
      if (interval !== null) {
        clearInterval(interval);
        interval = null;
      }
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
  }
  // #endregion

  // #region 라이프사이클
  onMounted(() => {
    updateCountdown();
    interval = setInterval(updateCountdown, 1000);
  });

  onUnmounted(() => {
    if (interval !== null) {
      clearInterval(interval);
    }
  });
  // #endregion

  return {
    time,
    monthlyCalendar,
  };
}
