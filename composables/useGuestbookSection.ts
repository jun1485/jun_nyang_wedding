import { computed, onMounted, ref } from "vue";
import { useCommonDialog } from "~/composables/useCommonDialog";
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import type {
  GuestbookCreateParams,
  GuestbookCreateResponse,
  GuestbookDeleteByPasswordResponse,
  GuestbookEntry,
  GuestbookListResponse,
  GuestbookUpdateResponse,
} from "~/types/guestbook";

// #region 입력 제한 상수
const GUESTBOOK_AUTHOR_NAME_MAX_LENGTH = 20;
const GUESTBOOK_MESSAGE_MAX_LENGTH = 300;
const GUESTBOOK_PASSWORD_MAX_LENGTH = 20;
const GUESTBOOK_PAGE_BUTTON_WINDOW = 5;
// #endregion

// #region 프로세스 타입
type GuestbookProcess =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

interface GuestbookRequestError extends Error {
  statusCode?: number;
  statusMessage?: string;
  data?: {
    statusMessage?: string;
    message?: string;
  };
}

export function useGuestbookSection() {
  // #region 초기화
  const { sharedStyles, guestbookStyles } = useEmotionStyles();
  const { openDialog, openPromptDialog } = useCommonDialog();
  const authorName = ref("");
  const message = ref("");
  const password = ref("");
  const entries = ref<GuestbookEntry[]>([]);
  const isGuestbookEnabled = ref(true);
  const hasFetchedOnce = ref(false);
  const currentPage = ref(1);
  const totalCount = ref(0);
  const totalPages = ref(0);
  const editingEntryId = ref<number | null>(null);
  const editingMessage = ref("");
  const editingPassword = ref("");
  // #endregion

  // #region 프로세스 생성
  function createProcesses() {
    return {
      fetchList: ref<GuestbookProcess>({ status: "idle" }),
      createEntry: ref<GuestbookProcess>({ status: "idle" }),
      updateEntry: ref<GuestbookProcess>({ status: "idle" }),
      deleteEntry: ref<GuestbookProcess>({ status: "idle" }),
    };
  }

  const processes = createProcesses();
  // #endregion

  // #region API 생성
  function createFetches() {
    return {
      fetchList: (page: number) =>
        $fetch<GuestbookListResponse>("/api/comments", {
          query: { page },
        }),
      createEntry: (params: GuestbookCreateParams) =>
        $fetch<GuestbookCreateResponse>("/api/comments", {
          method: "POST",
          body: params,
        }),
      updateEntry: (commentId: number, params: { password: string; message: string }) =>
        $fetch<GuestbookUpdateResponse>(`/api/comments/${commentId}`, {
          method: "PUT",
          body: params,
        }),
      deleteEntry: (commentId: number, params: { password: string }) =>
        $fetch<GuestbookDeleteByPasswordResponse>(`/api/comments/${commentId}`, {
          method: "DELETE",
          body: params,
        }),
    };
  }
  // #endregion

  // #region 파라미터 생성
  function normalizeWhitespace(value: string): string {
    return value.replace(/\s+/g, " ").trim();
  }

  function normalizeMessage(value: string): string {
    return value
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function createApiParams(): GuestbookCreateParams {
    const normalizedAuthorName = normalizeWhitespace(authorName.value);
    const normalizedMessage = normalizeMessage(message.value);
    const trimmedPassword = password.value.trim();

    if (normalizedAuthorName.length === 0) {
      throw new Error("성함을 입력해 주세요.");
    }

    if (normalizedAuthorName.length > GUESTBOOK_AUTHOR_NAME_MAX_LENGTH) {
      throw new Error("성함은 20자 이하로 입력해 주세요.");
    }

    if (normalizedMessage.length === 0) {
      throw new Error("댓글 내용을 입력해 주세요.");
    }

    if (normalizedMessage.length > GUESTBOOK_MESSAGE_MAX_LENGTH) {
      throw new Error("댓글은 300자 이하로 입력해 주세요.");
    }

    const params: GuestbookCreateParams = {
      authorName: normalizedAuthorName,
      message: normalizedMessage,
    };

    if (trimmedPassword.length > 0) {
      params.password = trimmedPassword;
    }

    return params;
  }
  // #endregion

  // #region 계산값
  const isLoadingEntries = computed(
    () => processes.fetchList.value.status === "loading",
  );
  const isSubmittingEntry = computed(
    () => processes.createEntry.value.status === "loading",
  );
  const isUpdatingEntry = computed(
    () => processes.updateEntry.value.status === "loading",
  );
  const isDeletingEntry = computed(
    () => processes.deleteEntry.value.status === "loading",
  );
  const submitDisabled = computed(
    () => !isGuestbookEnabled.value || isSubmittingEntry.value,
  );
  const nameLengthText = computed(
    () => `${normalizeWhitespace(authorName.value).length}/${GUESTBOOK_AUTHOR_NAME_MAX_LENGTH}`,
  );
  const messageLengthText = computed(
    () => `${normalizeMessage(message.value).length}/${GUESTBOOK_MESSAGE_MAX_LENGTH}`,
  );
  const passwordLengthText = computed(
    () => `${password.value.trim().length}/${GUESTBOOK_PASSWORD_MAX_LENGTH}`,
  );
  const editingMessageLengthText = computed(
    () => `${normalizeMessage(editingMessage.value).length}/${GUESTBOOK_MESSAGE_MAX_LENGTH}`,
  );
  const hasPrevPage = computed(() => currentPage.value > 1);
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const isPaginationVisible = computed(() => totalPages.value > 1);
  const pageNumbers = computed(() => {
    if (totalPages.value === 0) {
      return [];
    }

    const halfWindow = Math.floor(GUESTBOOK_PAGE_BUTTON_WINDOW / 2);
    const maxPage = totalPages.value;
    let startPage = Math.max(1, currentPage.value - halfWindow);
    let endPage = Math.min(
      maxPage,
      startPage + GUESTBOOK_PAGE_BUTTON_WINDOW - 1,
    );

    startPage = Math.max(1, endPage - GUESTBOOK_PAGE_BUTTON_WINDOW + 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index,
    );
  });
  const paginationStatusText = computed(() => {
    if (totalCount.value === 0) {
      return "댓글 0개";
    }

    return `총 ${totalCount.value}개 · ${currentPage.value}/${totalPages.value} 페이지`;
  });
  // #endregion

  // #region 표시 유틸
  function formatCreatedAt(createdAt: string): string {
    return new Intl.DateTimeFormat("ko-KR", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(createdAt));
  }

  function isGuestbookRequestError(error: Error): error is GuestbookRequestError {
    return (
      "statusCode" in error ||
      "statusMessage" in error ||
      "data" in error
    );
  }

  function resolveErrorMessage(error: Error, fallbackMessage: string): string {
    if (!isGuestbookRequestError(error)) {
      return error.message || fallbackMessage;
    }

    return (
      error.data?.statusMessage ||
      error.data?.message ||
      error.statusMessage ||
      error.message ||
      fallbackMessage
    );
  }

  function resolveDialogTone(error: Error): "info" | "error" {
    if (!isGuestbookRequestError(error)) {
      return "error";
    }

    return error.statusCode === 429 ? "info" : "error";
  }

  // 수정 모드 여부 확인
  function isEditing(entryId: number): boolean {
    return editingEntryId.value === entryId;
  }
  // #endregion

  // #region 액션
  async function fetchEntries(page = currentPage.value) {
    const fetches = createFetches();
    processes.fetchList.value = { status: "loading" };

    try {
      const response = await fetches.fetchList(page);
      entries.value = response.entries;
      isGuestbookEnabled.value = response.enabled;
      currentPage.value = response.pagination.currentPage;
      totalCount.value = response.pagination.totalCount;
      totalPages.value = response.pagination.totalPages;
      hasFetchedOnce.value = true;
      processes.fetchList.value = { status: "idle" };
    } catch (error) {
      const messageText = error instanceof Error
        ? resolveErrorMessage(error, "댓글 목록을 불러오지 못했습니다.")
        : "댓글 목록을 불러오지 못했습니다.";
      hasFetchedOnce.value = true;
      processes.fetchList.value = {
        status: "error",
        message: messageText,
      };
    }
  }

  function resetForm() {
    authorName.value = "";
    message.value = "";
    password.value = "";
  }

  function goToPage(page: number) {
    if (isLoadingEntries.value || page === currentPage.value) {
      return;
    }

    if (page < 1 || page > totalPages.value) {
      return;
    }

    void fetchEntries(page);
  }

  function goToPrevPage() {
    if (!hasPrevPage.value) {
      return;
    }

    goToPage(currentPage.value - 1);
  }

  function goToNextPage() {
    if (!hasNextPage.value) {
      return;
    }

    goToPage(currentPage.value + 1);
  }

  async function handleSubmit() {
    const fetches = createFetches();
    processes.createEntry.value = { status: "loading" };

    try {
      const params = createApiParams();
      await fetches.createEntry(params);
      currentPage.value = 1;
      await fetchEntries(1);
      processes.createEntry.value = {
        status: "success",
        message: "댓글이 등록되었습니다.",
      };
      resetForm();
      openDialog({
        tone: "success",
        title: "댓글 등록 완료",
        message: "축하 메시지가 예쁘게 전달되었어요.",
      });
    } catch (error) {
      const messageText = error instanceof Error
        ? resolveErrorMessage(error, "댓글 등록에 실패했습니다.")
        : "댓글 등록에 실패했습니다.";
      processes.createEntry.value = {
        status: "error",
        message: messageText,
      };
      openDialog({
        tone: error instanceof Error ? resolveDialogTone(error) : "error",
        message: messageText,
      });
    }
  }

  // 수정 모드 진입 - 비밀번호 prompt 후 인라인 수정 활성화
  function handleEditEntry(entry: GuestbookEntry) {
    openPromptDialog({
      tone: "info",
      title: "댓글 수정",
      message: "댓글 작성 시 입력한 비밀번호를 입력해 주세요.",
      inputType: "password",
      inputPlaceholder: "비밀번호 입력",
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: (inputPassword: string) => {
        editingEntryId.value = entry.id;
        editingMessage.value = entry.message;
        editingPassword.value = inputPassword;
      },
    });
  }

  // 수정 저장 - 인라인 수정 완료 후 API 호출
  async function submitEditEntry() {
    const commentId = editingEntryId.value;
    if (commentId == null) return;

    const fetches = createFetches();
    processes.updateEntry.value = { status: "loading" };

    try {
      const normalizedMessage = normalizeMessage(editingMessage.value);

      if (normalizedMessage.length === 0) {
        throw new Error("댓글 내용을 입력해 주세요.");
      }

      if (normalizedMessage.length > GUESTBOOK_MESSAGE_MAX_LENGTH) {
        throw new Error("댓글은 300자 이하로 입력해 주세요.");
      }

      await fetches.updateEntry(commentId, {
        password: editingPassword.value,
        message: normalizedMessage,
      });
      editingEntryId.value = null;
      editingMessage.value = "";
      editingPassword.value = "";
      await fetchEntries();
      processes.updateEntry.value = {
        status: "success",
        message: "댓글이 수정되었습니다.",
      };
      openDialog({
        tone: "success",
        title: "댓글 수정 완료",
        message: "댓글이 수정되었어요.",
      });
    } catch (error) {
      const messageText = error instanceof Error
        ? resolveErrorMessage(error, "댓글 수정에 실패했습니다.")
        : "댓글 수정에 실패했습니다.";
      editingEntryId.value = null;
      editingMessage.value = "";
      editingPassword.value = "";
      processes.updateEntry.value = {
        status: "error",
        message: messageText,
      };
      openDialog({
        tone: error instanceof Error ? resolveDialogTone(error) : "error",
        message: messageText,
      });
    }
  }

  // 수정 모드 취소
  function cancelEditEntry() {
    editingEntryId.value = null;
    editingMessage.value = "";
    editingPassword.value = "";
  }

  // 삭제 - 비밀번호 prompt 후 삭제 API 호출
  function handleDeleteEntry(entry: GuestbookEntry) {
    openPromptDialog({
      tone: "error",
      title: "댓글 삭제",
      message: "삭제하면 복구할 수 없습니다.\n댓글 작성 시 입력한 비밀번호를 입력해 주세요.",
      inputType: "password",
      inputPlaceholder: "비밀번호 입력",
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: (inputPassword: string) => {
        void submitDeleteEntry(entry.id, inputPassword);
      },
    });
  }

  // 삭제 API 호출
  async function submitDeleteEntry(commentId: number, entryPassword: string) {
    const fetches = createFetches();
    processes.deleteEntry.value = { status: "loading" };

    try {
      await fetches.deleteEntry(commentId, { password: entryPassword });
      await fetchEntries();
      processes.deleteEntry.value = {
        status: "success",
        message: "댓글이 삭제되었습니다.",
      };
      openDialog({
        tone: "success",
        title: "댓글 삭제 완료",
        message: "댓글이 삭제되었어요.",
      });
    } catch (error) {
      const messageText = error instanceof Error
        ? resolveErrorMessage(error, "댓글 삭제에 실패했습니다.")
        : "댓글 삭제에 실패했습니다.";
      processes.deleteEntry.value = {
        status: "error",
        message: messageText,
      };
      openDialog({
        tone: error instanceof Error ? resolveDialogTone(error) : "error",
        message: messageText,
      });
    }
  }
  // #endregion

  // #region 라이프사이클
  onMounted(() => {
    if (hasFetchedOnce.value) return;
    void fetchEntries();
  });
  // #endregion

  return {
    sharedStyles,
    guestbookStyles,
    authorName,
    message,
    password,
    entries,
    isGuestbookEnabled,
    isLoadingEntries,
    isSubmittingEntry,
    isUpdatingEntry,
    isDeletingEntry,
    submitDisabled,
    currentPage,
    totalCount,
    totalPages,
    hasPrevPage,
    hasNextPage,
    isPaginationVisible,
    pageNumbers,
    paginationStatusText,
    nameLengthText,
    messageLengthText,
    passwordLengthText,
    editingEntryId,
    editingMessage,
    editingMessageLengthText,
    formatCreatedAt,
    isEditing,
    fetchEntries,
    goToPage,
    goToPrevPage,
    goToNextPage,
    handleSubmit,
    handleEditEntry,
    handleDeleteEntry,
    cancelEditEntry,
    submitEditEntry,
  };
}
