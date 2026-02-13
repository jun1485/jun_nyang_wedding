<template>
  <section :class="sharedStyles.sectionWrap">
    <div :class="[sharedStyles.sectionCard, invitationStyles.card]">
      <div :class="[invitationStyles.deco, invitationStyles.decoLeft]" aria-hidden="true"></div>
      <div :class="[invitationStyles.deco, invitationStyles.decoRight]" aria-hidden="true"></div>

      <span :class="sharedStyles.floralChip">Invitation</span>
      <h2 :class="[sharedStyles.sectionTitle, invitationStyles.title]">초대합니다</h2>

      <p :class="invitationStyles.body">
        <span
          v-for="(line, index) in store.invitationMessage ?? []"
          :key="index"
          :class="invitationStyles.messageLine"
        >
          {{ line }}
        </span>
      </p>

      <div :class="invitationStyles.namesWrap">
        <div :class="invitationStyles.namesRow">
          <p :class="invitationStyles.nameText">{{ store.groom?.name }}</p>
          <p :class="invitationStyles.heart">♥</p>
          <p :class="invitationStyles.nameText">{{ store.bride?.name }}</p>
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
</script>
