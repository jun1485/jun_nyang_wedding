<script setup lang="ts">
import { useAppShell } from "~/composables/useAppShell";

const { appStyles, AsyncFlowerPetals } = await useAppShell();
</script>

<template>
  <div :class="appStyles.container">
    <NuxtPwaManifest />
    <client-only>
      <AsyncFlowerPetals />
      <PwaUpdateNotice />
    </client-only>
    <main :class="appStyles.contentWrapper">
      <NuxtPage />
    </main>
  </div>
</template>
