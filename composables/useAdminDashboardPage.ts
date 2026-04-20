import { computed, onMounted, ref } from "vue";
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import type {
  AdminDeleteCommentsParams,
  AdminDeleteCommentsResponse,
  AdminOverviewResponse,
} from "~/types/admin";
import type { GuestbookEntry, GuestbookListResponse } from "~/types/guestbook";

const ADMIN_STORAGE_KEY = "jun-nyang-wedding-admin-key";
const ADMIN_PAGE_BUTTON_WINDOW = 5;

type AdminDashboardProcess =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function useAdminDashboardPage() {
  const { sharedStyles, adminStyles } = useEmotionStyles();
  const adminKey = ref("");
  const overview = ref<AdminOverviewResponse | null>(null);
  const commentEntries = ref<GuestbookEntry[]>([]);
  const currentPage = ref(1);
  const totalCount = ref(0);
  const totalPages = ref(0);
  // 댓글 목록 스크롤 참조
  const commentListRef = ref<HTMLElement | null>(null);

  function createProcesses() {
    return {
      fetchOverview: ref<AdminDashboardProcess>({ status: "idle" }),
      deleteComments: ref<AdminDashboardProcess>({ status: "idle" }),
    };
  }

  const processes = createProcesses();

  function createFetches() {
    return {
      fetchOverview: (providedAdminKey: string) =>
        $fetch<AdminOverviewResponse>("/api/admin/overview", {
          headers: {
            "x-admin-key": providedAdminKey,
          },
        }),
      // 댓글 페이지네이션 조회
      fetchComments: (page: number) =>
        $fetch<GuestbookListResponse>("/api/comments", {
          query: { page },
        }),
      deleteComments: (
        providedAdminKey: string,
        params: AdminDeleteCommentsParams,
      ) =>
        $fetch<AdminDeleteCommentsResponse>("/api/admin/comments", {
          method: "DELETE",
          headers: {
            "x-admin-key": providedAdminKey,
          },
          body: params,
        }),
    };
  }

  function createApiParams(): string {
    const normalizedAdminKey = adminKey.value.trim();

    if (!normalizedAdminKey) {
      throw new Error("관리자 키 입력 필요");
    }

    return normalizedAdminKey;
  }

  const isLoading = computed(
    () =>
      processes.fetchOverview.value.status === "loading"
      || processes.deleteComments.value.status === "loading",
  );
  const selectedCommentIds = ref<number[]>([]);
  const selectedCommentCount = computed(() => selectedCommentIds.value.length);
  const deleteDisabled = computed(
    () => selectedCommentCount.value === 0 || processes.deleteComments.value.status === "loading",
  );

  // #region 페이지네이션 계산값
  const hasPrevPage = computed(() => currentPage.value > 1);
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const isPaginationVisible = computed(() => totalPages.value > 1);
  const pageNumbers = computed(() => {
    if (totalPages.value === 0) {
      return [];
    }

    const halfWindow = Math.floor(ADMIN_PAGE_BUTTON_WINDOW / 2);
    const maxPage = totalPages.value;
    let startPage = Math.max(1, currentPage.value - halfWindow);
    const endPage = Math.min(
      maxPage,
      startPage + ADMIN_PAGE_BUTTON_WINDOW - 1,
    );

    startPage = Math.max(1, endPage - ADMIN_PAGE_BUTTON_WINDOW + 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index,
    );
  });
  const paginationStatusText = computed(() => {
    if (totalCount.value === 0) {
      return "댓글 0개";
    }

    if (totalPages.value <= 1) {
      return `총 ${totalCount.value}개`;
    }

    return `총 ${totalCount.value}개 · ${currentPage.value}/${totalPages.value} 페이지`;
  });
  // #endregion

  const statusMessage = computed(() => {
    const currentProcess = processes.fetchOverview.value;
    const deleteProcess = processes.deleteComments.value;

    if (deleteProcess.status === "error" || deleteProcess.status === "success") {
      return deleteProcess.message;
    }

    if (currentProcess.status === "error" || currentProcess.status === "success") {
      return currentProcess.message;
    }

    return "관리자 키 입력 후 현황 확인 가능";
  });

  function formatBytes(value: number): string {
    if (value < 1024) {
      return `${value} B`;
    }

    const units = ["KB", "MB", "GB", "TB"] as const;
    let currentValue = value / 1024;
    let unitIndex = 0;

    while (currentValue >= 1024 && unitIndex < units.length - 1) {
      currentValue /= 1024;
      unitIndex += 1;
    }

    return `${currentValue.toFixed(1)} ${units[unitIndex]}`;
  }

  function formatDateTime(value: string | null): string {
    if (!value) {
      return "없음";
    }

    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  // 댓글 목록 페이지네이션 조회
  async function fetchComments(page = currentPage.value) {
    const fetches = createFetches();

    try {
      const response = await fetches.fetchComments(page);
      commentEntries.value = response.entries;
      currentPage.value = response.pagination.currentPage;
      totalCount.value = response.pagination.totalCount;
      totalPages.value = response.pagination.totalPages;
    } catch {
      commentEntries.value = [];
    }
  }

  // 페이지 이동 후 댓글 목록 최상단 스크롤
  async function goToPage(page: number) {
    if (isLoading.value || page === currentPage.value) {
      return;
    }

    if (page < 1 || page > totalPages.value) {
      return;
    }

    selectedCommentIds.value = [];
    await fetchComments(page);
    commentListRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  async function fetchOverview(providedAdminKey: string) {
    const fetches = createFetches();
    processes.fetchOverview.value = { status: "loading" };

    try {
      const response = await fetches.fetchOverview(providedAdminKey);
      overview.value = response;
      selectedCommentIds.value = [];
      processes.fetchOverview.value = {
        status: "success",
        message: "대시보드 데이터 갱신 완료",
      };
      await fetchComments(1);

      if (import.meta.client) {
        window.sessionStorage.setItem(ADMIN_STORAGE_KEY, providedAdminKey);
      }
    } catch (error) {
      overview.value = null;
      processes.fetchOverview.value = {
        status: "error",
        message: error instanceof Error ? error.message : "대시보드 조회 실패",
      };
    }
  }

  async function handleSubmit() {
    try {
      const adminApiKey = createApiParams();
      processes.deleteComments.value = { status: "idle" };
      await fetchOverview(adminApiKey);
    } catch (error) {
      overview.value = null;
      processes.fetchOverview.value = {
        status: "error",
        message: error instanceof Error ? error.message : "관리자 키 처리 실패",
      };
    }
  }

  function toggleCommentSelection(commentId: number) {
    if (selectedCommentIds.value.includes(commentId)) {
      selectedCommentIds.value = selectedCommentIds.value.filter((id) => id !== commentId);
      return;
    }

    selectedCommentIds.value = [...selectedCommentIds.value, commentId];
  }

  function toggleAllComments() {
    if (commentEntries.value.length === 0) {
      selectedCommentIds.value = [];
      return;
    }

    if (selectedCommentIds.value.length === commentEntries.value.length) {
      selectedCommentIds.value = [];
      return;
    }

    selectedCommentIds.value = commentEntries.value.map((entry) => entry.id);
  }

  function isCommentSelected(commentId: number): boolean {
    return selectedCommentIds.value.includes(commentId);
  }

  async function handleDeleteSelectedComments() {
    try {
      const providedAdminKey = createApiParams();
      const commentIds = [...selectedCommentIds.value];

      if (commentIds.length === 0) {
        throw new Error("삭제할 댓글 선택 필요");
      }

      const fetches = createFetches();
      processes.deleteComments.value = { status: "loading" };
      const response = await fetches.deleteComments(providedAdminKey, { commentIds });
      selectedCommentIds.value = [];
      await fetchComments(currentPage.value);
      processes.deleteComments.value = {
        status: "success",
        message: `${response.deletedCount}개 댓글 삭제 완료`,
      };
    } catch (error) {
      processes.deleteComments.value = {
        status: "error",
        message: error instanceof Error ? error.message : "댓글 삭제 실패",
      };
    }
  }

  function clearAdminSession() {
    adminKey.value = "";
    overview.value = null;
    selectedCommentIds.value = [];
    processes.fetchOverview.value = { status: "idle" };
    processes.deleteComments.value = { status: "idle" };

    if (import.meta.client) {
      window.sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  }

  onMounted(() => {
    if (!import.meta.client) {
      return;
    }

    const savedAdminKey = window.sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (!savedAdminKey) {
      return;
    }

    adminKey.value = savedAdminKey;
    void fetchOverview(savedAdminKey);
  });

  return {
    sharedStyles,
    adminStyles,
    adminKey,
    overview,
    commentEntries,
    currentPage,
    isLoading,
    statusMessage,
    formatBytes,
    formatDateTime,
    selectedCommentCount,
    deleteDisabled,
    hasPrevPage,
    hasNextPage,
    isPaginationVisible,
    pageNumbers,
    paginationStatusText,
    commentListRef,
    isCommentSelected,
    toggleCommentSelection,
    toggleAllComments,
    goToPage,
    goToPrevPage,
    goToNextPage,
    handleSubmit,
    handleDeleteSelectedComments,
    clearAdminSession,
  };
}
