<template>
  <section :class="[sharedStyles.shared__sectionWrap, contactStyles.contact__sectionOffset]">
    <div :class="contactStyles.contact__header">
      <span :class="contactStyles.contact__floralChip">Contact</span>
      <h2 :class="[sharedStyles.shared__sectionTitle, contactStyles.contact__title]">마음 전하실 곳</h2>
      <p :class="[sharedStyles.shared__sectionSubtitle, contactStyles.contact__subtitle]">은행명과 계좌번호를 확인해 주세요</p>
    </div>

    <div :class="contactStyles.contact__cardGrid">
      <article :class="[sharedStyles.shared__sectionCard, contactStyles.contact__cardInner]">
        <h3 :class="contactStyles.contact__sectionLabel">신랑 측</h3>
        <ul :class="contactStyles.contact__contactList">
          <li
            v-for="account in groomAccounts"
            :key="`groom-${account.label}`"
            :class="contactStyles.contact__contactRow"
          >
            <div :class="contactStyles.contact__contactContent">
              <p :class="contactStyles.contact__contactName">{{ account.label }}</p>
              <p :class="contactStyles.contact__contactNumber">{{ account.accountText }}</p>
            </div>
            <button
              type="button"
              :class="[
                contactStyles.contact__copyButton,
                isCopiedAccount(account.accountNumber) ? contactStyles.contact__copyButtonActive : '',
              ]"
              @click="handleCopyAccount(account.accountNumber)"
            >
              {{ getCopyButtonText(account.accountNumber) }}
            </button>
          </li>
        </ul>
      </article>

      <article :class="[sharedStyles.shared__sectionCard, contactStyles.contact__cardInner]">
        <h3 :class="contactStyles.contact__sectionLabel">신부 측</h3>
        <ul :class="contactStyles.contact__contactList">
          <li
            v-for="account in brideAccounts"
            :key="`bride-${account.label}`"
            :class="contactStyles.contact__contactRow"
          >
            <div :class="contactStyles.contact__contactContent">
              <p :class="contactStyles.contact__contactName">{{ account.label }}</p>
              <p :class="contactStyles.contact__contactNumber">{{ account.accountText }}</p>
            </div>
            <button
              type="button"
              :class="[
                contactStyles.contact__copyButton,
                isCopiedAccount(account.accountNumber) ? contactStyles.contact__copyButtonActive : '',
              ]"
              @click="handleCopyAccount(account.accountNumber)"
            >
              {{ getCopyButtonText(account.accountNumber) }}
            </button>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useContactAccounts } from "~/composables/useContactAccounts";

const {
  sharedStyles,
  contactStyles,
  groomAccounts,
  brideAccounts,
  isCopiedAccount,
  getCopyButtonText,
  handleCopyAccount,
} =
  useContactAccounts();
</script>
