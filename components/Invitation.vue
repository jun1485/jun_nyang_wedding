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
          v-for="(line, index) in invitationMessageLines"
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
        <div
          v-for="familyNameLine in familyNameLines"
          :key="familyNameLine.relation"
          :class="invitationStyles.invitation__namesRow"
        >
          <p :class="invitationStyles.invitation__parentsText">
            {{ familyNameLine.parentsText }}의
          </p>
          <p :class="invitationStyles.invitation__relationText">
            {{ familyNameLine.relation }}
          </p>
          <p :class="invitationStyles.invitation__nameText">
            {{ familyNameLine.name }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useInvitationSection } from "~/composables/useInvitationSection";

const {
  sharedStyles,
  invitationStyles,
  invitationMessageLines,
  familyNameLines,
  isMessageSectionBreak,
} = useInvitationSection();
</script>
