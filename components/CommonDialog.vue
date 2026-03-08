<template>
  <div
    v-if="isVisible"
    :class="dialogStyles.dialog__layer"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="title ? 'common-dialog-title' : undefined"
    :aria-label="title ? undefined : '안내 대화상자'"
    @click.self="isPrompt ? cancelPrompt() : closeDialog()"
  >
    <div :class="dialogStyles.dialog__panel">
      <span
        :class="[
          dialogStyles.dialog__chip,
          tone === 'success'
            ? dialogStyles.dialog__chipSuccess
            : tone === 'error'
              ? dialogStyles.dialog__chipError
              : dialogStyles.dialog__chipInfo,
        ]"
      >
        {{ toneLabel }}
      </span>
      <h3
        v-if="title"
        id="common-dialog-title"
        :class="dialogStyles.dialog__title"
      >
        {{ title }}
      </h3>
      <p :class="dialogStyles.dialog__message">
        {{ message }}
      </p>

      <template v-if="isOpen">
        <div v-if="detailText" :class="dialogStyles.dialog__detailBox">
          {{ detailText }}
        </div>
        <div :class="dialogStyles.dialog__actionRow">
          <button
            type="button"
            :class="[sharedStyles.shared__petalButton, dialogStyles.dialog__button]"
            @click="closeDialog"
          >
            {{ confirmText }}
          </button>
        </div>
      </template>

      <template v-if="isPrompt">
        <form @submit.prevent="confirmPrompt">
          <input
            v-model="promptInputValue"
            :type="promptInputType"
            :placeholder="promptInputPlaceholder"
            :class="dialogStyles.dialog__promptInput"
            autocomplete="off"
          />
          <div :class="dialogStyles.dialog__promptActionRow">
            <button
              type="button"
              :class="dialogStyles.dialog__promptCancelButton"
              @click="cancelPrompt"
            >
              {{ cancelText }}
            </button>
            <button
              type="submit"
              :class="[sharedStyles.shared__petalButton, dialogStyles.dialog__button]"
            >
              {{ confirmText }}
            </button>
          </div>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommonDialog } from "~/composables/useCommonDialog";
import { useDialogStyles } from "~/composables/useDialogStyles";
import { useEmotionStyles } from "~/composables/useEmotionStyles";

const { sharedStyles } = useEmotionStyles();
const { dialogStyles } = useDialogStyles();
const {
  isOpen,
  isPrompt,
  isVisible,
  title,
  message,
  detailText,
  confirmText,
  cancelText,
  promptInputType,
  promptInputPlaceholder,
  promptInputValue,
  tone,
  toneLabel,
  closeDialog,
  confirmPrompt,
  cancelPrompt,
} = useCommonDialog();
</script>
