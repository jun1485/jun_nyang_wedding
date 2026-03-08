<script setup lang="ts">
import CommonDialog from "~/components/CommonDialog.vue";
import { useAppShell } from "~/composables/useAppShell";

const { appStyles, AsyncFlowerPetals } = await useAppShell();
</script>

<template>
  <div :class="appStyles.app__container">
    <NuxtPwaManifest />
    <client-only>
      <AsyncFlowerPetals />
    </client-only>
    <main :class="appStyles.app__contentWrapper">
      <NuxtPage />
    </main>
    <CommonDialog />
  </div>
</template>
