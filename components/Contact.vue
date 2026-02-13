<template>
  <section :class="[sharedStyles.sectionWrap, contactStyles.sectionOffset]">
    <div :class="contactStyles.header">
      <span :class="sharedStyles.floralChip">Contact</span>
      <h2 :class="[sharedStyles.sectionTitle, contactStyles.title]">마음 전하실 곳</h2>
      <p :class="[sharedStyles.sectionSubtitle, contactStyles.subtitle]">전화 버튼을 누르면 바로 연결돼요</p>
    </div>

    <div :class="contactStyles.cardGrid">
      <article :class="[sharedStyles.sectionCard, contactStyles.cardInner]">
        <h3 :class="contactStyles.sectionLabel">신랑 측</h3>
        <ul :class="contactStyles.contactList">
          <li
            v-for="person in groomContacts"
            :key="`groom-${person.label}`"
            :class="contactStyles.contactRow"
          >
            <div>
              <p :class="contactStyles.contactName">{{ person.label }}</p>
              <p :class="contactStyles.contactNumber">{{ person.tel }}</p>
            </div>
            <a
              :href="`tel:${person.tel}`"
              :class="contactStyles.callButton"
              :aria-label="`${person.label}에게 전화 걸기`"
              >전화</a
            >
          </li>
        </ul>
      </article>

      <article :class="[sharedStyles.sectionCard, contactStyles.cardInner]">
        <h3 :class="contactStyles.sectionLabel">신부 측</h3>
        <ul :class="contactStyles.contactList">
          <li
            v-for="person in brideContacts"
            :key="`bride-${person.label}`"
            :class="contactStyles.contactRow"
          >
            <div>
              <p :class="contactStyles.contactName">{{ person.label }}</p>
              <p :class="contactStyles.contactNumber">{{ person.tel }}</p>
            </div>
            <a
              :href="`tel:${person.tel}`"
              :class="contactStyles.callButton"
              :aria-label="`${person.label}에게 전화 걸기`"
              >전화</a
            >
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import { useWeddingStore } from "~/stores/wedding";

const store = useWeddingStore();
const { sharedStyles, contactStyles } = useEmotionStyles();

type ContactEntry = { label: string; tel: string };

const groomContacts = computed<ContactEntry[]>(() => {
  const parents =
    store.groom?.parents.map((parent) => ({
      label: parent.name ? `${parent.role} ${parent.name}` : parent.role,
      tel: parent.tel,
    })) ?? [];

  return [{ label: `신랑 ${store.groom?.name ?? ""}`, tel: store.groom?.tel ?? "" }, ...parents].filter(
    (item) => item.tel
  );
});

const brideContacts = computed<ContactEntry[]>(() => {
  const parents =
    store.bride?.parents.map((parent) => ({
      label: parent.name ? `${parent.role} ${parent.name}` : parent.role,
      tel: parent.tel,
    })) ?? [];

  return [{ label: `신부 ${store.bride?.name ?? ""}`, tel: store.bride?.tel ?? "" }, ...parents].filter(
    (item) => item.tel
  );
});
</script>
