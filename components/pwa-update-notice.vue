<template>
  <div
    v-if="isUpdateReady"
    :class="pwaNoticeStyles.wrap"
    role="status"
    aria-live="polite"
  >
    <div :class="pwaNoticeStyles.panel">
      <p :class="pwaNoticeStyles.title">새 버전이 준비됐어요</p>
      <p :class="pwaNoticeStyles.description">지금 새로고침하면 최신 화면으로 바뀝니다</p>
      <div :class="pwaNoticeStyles.actionRow">
        <button
          type="button"
          :class="[pwaNoticeStyles.button, pwaNoticeStyles.buttonGhost]"
          @click="dismissUpdateNotice"
        >
          나중에
        </button>
        <button
          type="button"
          :class="[pwaNoticeStyles.button, pwaNoticeStyles.buttonPrimary]"
          @click="applyUpdate"
        >
          지금 업데이트
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePwaUpdateNotice } from "~/composables/usePwaUpdateNotice";

const {
  pwaNoticeStyles,
  isUpdateReady,
  applyUpdate,
  dismissUpdateNotice,
} = usePwaUpdateNotice();
</script>
