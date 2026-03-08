<template>
  <section :class="sharedStyles.shared__sectionWrap">
    <div
      :class="[
        sharedStyles.shared__sectionCard,
        invitationStyles.invitation__card,
      ]"
    >
      <div
        :class="[
          invitationStyles.invitation__deco,
          invitationStyles.invitation__decoLeft,
        ]"
        aria-hidden="true"
      ></div>
      <div
        :class="[
          invitationStyles.invitation__deco,
          invitationStyles.invitation__decoRight,
        ]"
        aria-hidden="true"
      ></div>

      <span :class="sharedStyles.shared__floralChip">Invitation</span>
      <h2
        :class="[
          sharedStyles.shared__sectionTitle,
          invitationStyles.invitation__title,
        ]"
      >
        초대합니다
      </h2>

      <p :class="invitationStyles.invitation__body">
        <span
          v-for="(line, index) in store.invitationMessage ?? []"
          :key="index"
          :class="[
            invitationStyles.invitation__messageLine,
            isMessageSectionBreak(line)
              ? invitationStyles.invitation__messageLineSectionGap
              : '',
          ]"
        >
          {{ line }}
        </span>
      </p>

      <div :class="invitationStyles.invitation__namesWrap">
        <div :class="invitationStyles.invitation__namesRow">
          <p :class="invitationStyles.invitation__nameText">
            {{ store.groom?.name }}
          </p>
          <p :class="invitationStyles.invitation__heart"></p>
          <p :class="invitationStyles.invitation__nameText">
            {{ store.bride?.name }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import { useWeddingStore } from "~/stores/wedding";

const store = useWeddingStore();
const { sharedStyles, invitationStyles } = useEmotionStyles();

const MESSAGE_SECTION_BREAK_LINE = "이제 평생을 약속하려 합니다.";

function isMessageSectionBreak(line: string): boolean {
  return line === MESSAGE_SECTION_BREAK_LINE;
}
</script>
