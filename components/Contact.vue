<template>
  <section class="section-wrap pt-2 sm:pt-4">
    <div class="text-center">
      <span class="floral-chip">Contact</span>
      <h2 class="section-title mt-4 text-3xl sm:text-4xl">마음 전하실 곳</h2>
      <p class="section-subtitle mt-2">전화 버튼을 누르면 바로 연결돼요</p>
    </div>

    <div class="mt-7 grid gap-4 sm:mt-8 sm:grid-cols-2">
      <article class="section-card px-4 py-5 sm:px-6 sm:py-7">
        <h3 class="contact-title">신랑 측</h3>
        <ul class="mt-4 space-y-3">
          <li
            v-for="person in groomContacts"
            :key="`groom-${person.label}`"
            class="contact-row"
          >
            <div>
              <p class="contact-name">{{ person.label }}</p>
              <p class="contact-number">{{ person.tel }}</p>
            </div>
            <a
              :href="`tel:${person.tel}`"
              class="call-btn"
              :aria-label="`${person.label}에게 전화 걸기`"
              >전화</a
            >
          </li>
        </ul>
      </article>

      <article class="section-card px-4 py-5 sm:px-6 sm:py-7">
        <h3 class="contact-title">신부 측</h3>
        <ul class="mt-4 space-y-3">
          <li
            v-for="person in brideContacts"
            :key="`bride-${person.label}`"
            class="contact-row"
          >
            <div>
              <p class="contact-name">{{ person.label }}</p>
              <p class="contact-number">{{ person.tel }}</p>
            </div>
            <a
              :href="`tel:${person.tel}`"
              class="call-btn"
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
import { useWeddingStore } from "~/stores/wedding";

const store = useWeddingStore();

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

<style scoped>
.contact-title {
  margin: 0;
  color: #422f39;
  font-size: 1.2rem;
  font-weight: 700;
}

.contact-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border: 1px solid rgba(231, 90, 132, 0.15);
  background: rgba(255, 255, 255, 0.78);
  border-radius: 0.9rem;
  padding: 0.75rem;
}

.contact-name {
  margin: 0;
  color: #4c3540;
  font-size: 0.95rem;
  font-weight: 700;
}

.contact-number {
  margin: 0.18rem 0 0;
  color: #7f6470;
  font-size: 0.82rem;
}

.call-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.5rem;
  border-radius: 9999px;
  border: 1px solid rgba(231, 90, 132, 0.3);
  background: #fff3f7;
  color: #c73e6a;
  font-size: 0.84rem;
  font-weight: 700;
  text-decoration: none;
  padding: 0.45rem 0.75rem;
}
</style>
