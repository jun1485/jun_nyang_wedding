import { createError, defineEventHandler, getHeader, readBody } from "h3";
import { assertAdminAuthorized } from "~/server/utils/adminAuth";
import { deleteGuestbookEntries, isGuestbookEnabled } from "~/server/utils/guestbookDb";
import type {
  AdminDeleteCommentsParams,
  AdminDeleteCommentsResponse,
} from "~/types/admin";

function createApiParams(
  body: Partial<AdminDeleteCommentsParams> | null,
): AdminDeleteCommentsParams {
  const commentIds = Array.from(
    new Set(
      (body?.commentIds ?? []).filter((value): value is number =>
        Number.isInteger(value) && value > 0,
      ),
    ),
  );

  if (commentIds.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "삭제할 댓글 선택 필요",
    });
  }

  return { commentIds };
}

export default defineEventHandler(async (event): Promise<AdminDeleteCommentsResponse> => {
  const providedAdminKey = getHeader(event, "x-admin-key");
  assertAdminAuthorized(providedAdminKey);

  if (!isGuestbookEnabled()) {
    throw createError({
      statusCode: 503,
      statusMessage: "댓글 DB 연결 정보 필요",
    });
  }

  const requestBody = await readBody<Partial<AdminDeleteCommentsParams> | null>(event);
  const params = createApiParams(requestBody);
  const deletedCount = await deleteGuestbookEntries(params.commentIds);

  return {
    deletedCount,
  };
});
