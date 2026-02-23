import { computed } from "vue";
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import { useWeddingStore } from "~/stores/wedding";
import type { RemittanceAccount } from "~/types/wedding";

interface ContactAccountEntry {
  label: string;
  bank: string;
  accountNumber: string;
  accountText: string;
}

function createContactAccountEntry(
  account: RemittanceAccount
): ContactAccountEntry {
  return {
    label: account.label,
    bank: account.bank,
    accountNumber: account.accountNumber,
    accountText: `${account.bank} ${account.accountNumber}`,
  };
}

export function useContactAccounts() {
  const store = useWeddingStore();
  const { sharedStyles, contactStyles } = useEmotionStyles();

  // #region 계좌 목록
  const groomAccounts = computed<ContactAccountEntry[]>(() =>
    (store.remittanceAccounts?.groom ?? []).map(createContactAccountEntry)
  );
  const brideAccounts = computed<ContactAccountEntry[]>(() =>
    (store.remittanceAccounts?.bride ?? []).map(createContactAccountEntry)
  );
  // #endregion

  return {
    sharedStyles,
    contactStyles,
    groomAccounts,
    brideAccounts,
  };
}
