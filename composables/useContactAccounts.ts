import { computed, ref } from "vue";
import { useCommonDialog } from "~/composables/useCommonDialog";
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
  const { openDialog } = useCommonDialog();
  const copiedAccountNumber = ref<string | null>(null);
  const copiedResetTimerId = ref<number | null>(null);

  // #region 계좌 목록
  const groomAccounts = computed<ContactAccountEntry[]>(() =>
    (store.remittanceAccounts?.groom ?? []).map(createContactAccountEntry)
  );
  const brideAccounts = computed<ContactAccountEntry[]>(() =>
    (store.remittanceAccounts?.bride ?? []).map(createContactAccountEntry)
  );
  // #endregion

  // #region 계좌 복사
  function clearCopiedAccountState() {
    copiedAccountNumber.value = null;

    if (!import.meta.client || copiedResetTimerId.value == null) {
      return;
    }

    window.clearTimeout(copiedResetTimerId.value);
    copiedResetTimerId.value = null;
  }

  function isCopiedAccount(accountNumber: string): boolean {
    return copiedAccountNumber.value === accountNumber;
  }

  function getCopyButtonText(accountNumber: string): string {
    return isCopiedAccount(accountNumber) ? "복사됨" : "복사";
  }

  async function handleCopyAccount(accountNumber: string) {
    if (!import.meta.client) {
      return;
    }

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("clipboard-unavailable");
      }

      await navigator.clipboard.writeText(accountNumber);
      copiedAccountNumber.value = accountNumber;

      if (copiedResetTimerId.value != null) {
        window.clearTimeout(copiedResetTimerId.value);
      }

      copiedResetTimerId.value = window.setTimeout(() => {
        clearCopiedAccountState();
      }, 1800);
    } catch {
      openDialog({
        tone: "info",
        title: "계좌번호 복사",
        message: "아래 계좌번호를 길게 눌러 복사해 주세요.",
        detailText: accountNumber,
      });
    }
  }
  // #endregion

  return {
    sharedStyles,
    contactStyles,
    groomAccounts,
    brideAccounts,
    isCopiedAccount,
    getCopyButtonText,
    handleCopyAccount,
  };
}
