import { computed, ref } from "vue";
import type { CommonDialogState, CommonDialogTone } from "~/types/dialog";

interface OpenCommonDialogParams {
  tone?: CommonDialogTone;
  title?: string;
  message: string;
  detailText?: string;
  confirmText?: string;
}

interface OpenPromptDialogParams {
  tone?: CommonDialogTone;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  inputType?: "password" | "text";
  inputPlaceholder?: string;
  onConfirm: (value: string) => void;
  onCancel?: () => void;
}

export function useCommonDialog() {
  const dialogState = useState<CommonDialogState>(
    "common-dialog-state",
    () => ({ status: "closed" }),
  );
  const promptInputValue = ref("");

  const isOpen = computed(() => dialogState.value.status === "open");
  const isPrompt = computed(() => dialogState.value.status === "prompt");
  const isVisible = computed(() => isOpen.value || isPrompt.value);
  const title = computed(() => {
    const state = dialogState.value;
    if (state.status === "open") return state.title;
    if (state.status === "prompt") return state.title;
    return "";
  });
  const message = computed(() => {
    const state = dialogState.value;
    if (state.status === "open") return state.message;
    if (state.status === "prompt") return state.message;
    return "";
  });
  const detailText = computed(() =>
    dialogState.value.status === "open" ? dialogState.value.detailText : "",
  );
  const confirmText = computed(() => {
    const state = dialogState.value;
    if (state.status === "open") return state.confirmText;
    if (state.status === "prompt") return state.confirmText;
    return "확인";
  });
  const cancelText = computed(() =>
    dialogState.value.status === "prompt" ? dialogState.value.cancelText : "취소",
  );
  const promptInputType = computed(() =>
    dialogState.value.status === "prompt" ? dialogState.value.inputType : "text",
  );
  const promptInputPlaceholder = computed(() =>
    dialogState.value.status === "prompt" ? dialogState.value.inputPlaceholder : "",
  );
  const tone = computed<CommonDialogTone>(() => {
    const state = dialogState.value;
    if (state.status === "open") return state.tone;
    if (state.status === "prompt") return state.tone;
    return "info";
  });
  const toneLabel = computed(() => {
    if (tone.value === "success") return "Blessing";
    if (tone.value === "error") return "Notice";
    return "Guide";
  });

  function openDialog(params: OpenCommonDialogParams) {
    dialogState.value = {
      status: "open",
      tone: params.tone ?? "info",
      title: params.title ?? "",
      message: params.message,
      detailText: params.detailText ?? "",
      confirmText: params.confirmText ?? "확인",
    };
  }

  // prompt 다이얼로그 열기 - 입력값 확인/취소 콜백 연결
  function openPromptDialog(params: OpenPromptDialogParams) {
    promptInputValue.value = "";
    dialogState.value = {
      status: "prompt",
      tone: params.tone ?? "info",
      title: params.title ?? "",
      message: params.message,
      confirmText: params.confirmText ?? "확인",
      cancelText: params.cancelText ?? "취소",
      inputType: params.inputType ?? "password",
      inputPlaceholder: params.inputPlaceholder ?? "",
      onConfirm: params.onConfirm,
      onCancel: params.onCancel ?? (() => {}),
    };
  }

  function closeDialog() {
    dialogState.value = { status: "closed" };
    promptInputValue.value = "";
  }

  // prompt 확인 - 입력값 전달 후 닫기
  function confirmPrompt() {
    const state = dialogState.value;
    if (state.status !== "prompt") return;

    const value = promptInputValue.value;
    state.onConfirm(value);
    closeDialog();
  }

  // prompt 취소 - 콜백 호출 후 닫기
  function cancelPrompt() {
    const state = dialogState.value;
    if (state.status !== "prompt") return;

    state.onCancel();
    closeDialog();
  }

  return {
    isOpen,
    isPrompt,
    isVisible,
    title,
    message,
    detailText,
    confirmText,
    cancelText,
    promptInputType,
    promptInputPlaceholder,
    promptInputValue,
    tone,
    toneLabel,
    openDialog,
    openPromptDialog,
    closeDialog,
    confirmPrompt,
    cancelPrompt,
  };
}
