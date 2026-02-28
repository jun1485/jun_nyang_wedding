<template>
  <section :class="[sharedStyles.sectionWrap, contactStyles.sectionOffset]">
    <div :class="contactStyles.header">
      <span :class="contactStyles.floralChip">Contact</span>
      <h2 :class="[sharedStyles.sectionTitle, contactStyles.title]">마음 전하실 곳</h2>
      <p :class="[sharedStyles.sectionSubtitle, contactStyles.subtitle]">은행명과 계좌번호를 확인해 주세요</p>
    </div>

    <div :class="contactStyles.cardGrid">
      <article :class="[sharedStyles.sectionCard, contactStyles.cardInner]">
        <h3 :class="contactStyles.sectionLabel">신랑 측</h3>
        <ul :class="contactStyles.contactList">
          <li
            v-for="account in groomAccounts"
            :key="`groom-${account.label}`"
            :class="contactStyles.contactRow"
          >
            <div>
              <p :class="contactStyles.contactName">{{ account.label }}</p>
              <p :class="contactStyles.contactNumber">{{ account.accountText }}</p>
            </div>
          </li>
        </ul>
      </article>

      <article :class="[sharedStyles.sectionCard, contactStyles.cardInner]">
        <h3 :class="contactStyles.sectionLabel">신부 측</h3>
        <ul :class="contactStyles.contactList">
          <li
            v-for="account in brideAccounts"
            :key="`bride-${account.label}`"
            :class="contactStyles.contactRow"
          >
            <div>
              <p :class="contactStyles.contactName">{{ account.label }}</p>
              <p :class="contactStyles.contactNumber">{{ account.accountText }}</p>
            </div>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useContactAccounts } from "~/composables/useContactAccounts";

const { sharedStyles, contactStyles, groomAccounts, brideAccounts } =
  useContactAccounts();
</script>
