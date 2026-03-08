import { getQuery } from "h3";
import type { GuestbookListResponse } from "~/types/guestbook";
import { isGuestbookEnabled, listGuestbookEntriesPage } from "../utils/guestbookDb";

// #region 댓글 페이지네이션 규칙
const GUESTBOOK_PAGE_SIZE = 5;
// #endregion

function resolvePageQueryValue(
  pageValue: string | string[] | null | undefined,
): number {
  const normalizedPageValue = Array.isArray(pageValue)
    ? pageValue[0]
    : pageValue;
  const parsedPage = Number.parseInt(normalizedPageValue ?? "1", 10);

  if (Number.isNaN(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return parsedPage;
}

export default defineEventHandler(async (event): Promise<GuestbookListResponse> => {
  const query = getQuery(event);
  const requestedPage = resolvePageQueryValue(query.page);

  if (!isGuestbookEnabled()) {
    return {
      enabled: false,
      entries: [],
      pagination: {
        currentPage: 1,
        pageSize: GUESTBOOK_PAGE_SIZE,
        totalCount: 0,
        totalPages: 0,
      },
    };
  }

  const pageResult = await listGuestbookEntriesPage({
    page: requestedPage,
    limit: GUESTBOOK_PAGE_SIZE,
  });

  return {
    enabled: true,
    entries: pageResult.entries,
    pagination: {
      currentPage: pageResult.currentPage,
      pageSize: GUESTBOOK_PAGE_SIZE,
      totalCount: pageResult.totalCount,
      totalPages: pageResult.totalPages,
    },
  };
});
