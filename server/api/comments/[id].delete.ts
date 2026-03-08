import { createError, readBody } from "h3";
import { verifyPassword, DEFAULT_COMMENT_PASSWORD, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from "../../utils/passwordHash";
import {
  deleteGuestbookEntry,
  getGuestbookEntryPasswordHash,
  isGuestbookEnabled,
} from "../../utils/guestbookDb";
import type {
  GuestbookDeleteByPasswordParams,
  GuestbookDeleteByPasswordResponse,
} from "~/types/guestbook";

// 비밀번호 검증
function validatePassword(body: Partial<GuestbookDeleteByPasswordParams> | null): string {
  const password = typeof body?.password === "string" ? body.password.trim() : "";

  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    throw createError({
      statusCode: 400,
      statusMessage: "비밀번호를 올바르게 입력해 주세요.",
    });
  }

  return password;
}

export default defineEventHandler(async (event): Promise<GuestbookDeleteByPasswordResponse> => {
  if (!isGuestbookEnabled()) {
    throw createError({
      statusCode: 503,
      statusMessage: "댓글 DB 연결 정보 필요",
    });
  }

  const commentId = Number(event.context.params?.id);

  if (!Number.isInteger(commentId) || commentId <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "잘못된 댓글 ID입니다.",
    });
  }

  const requestBody = await readBody<Partial<GuestbookDeleteByPasswordParams> | null>(event);
  const password = validatePassword(requestBody);

  const storedHash = await getGuestbookEntryPasswordHash(commentId);

  // 비밀번호 미설정 댓글은 디폴트 비밀번호로 검증
  const isPasswordValid = storedHash
    ? verifyPassword(password, storedHash)
    : password === DEFAULT_COMMENT_PASSWORD;

  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "비밀번호가 일치하지 않습니다.",
    });
  }

  const deleted = await deleteGuestbookEntry(commentId);

  return { deleted };
});
