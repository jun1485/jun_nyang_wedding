import { createError, readBody } from "h3";
import { verifyPassword, DEFAULT_COMMENT_PASSWORD, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from "../../utils/passwordHash";
import {
  getGuestbookEntryPasswordHash,
  isGuestbookEnabled,
  updateGuestbookEntryMessage,
} from "../../utils/guestbookDb";
import type { GuestbookUpdateParams, GuestbookUpdateResponse } from "~/types/guestbook";

// #region 댓글 수정 규칙
const GUESTBOOK_MESSAGE_MAX_LENGTH = 300;
// #endregion

// #region 입력 정규화
function normalizeMessage(value: string): string {
  return value
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// 요청 파라미터 검증 및 정규화
function createApiParams(
  body: Partial<GuestbookUpdateParams> | null,
): { password: string; message: string } {
  const password = typeof body?.password === "string" ? body.password.trim() : "";
  const message = normalizeMessage(body?.message ?? "");

  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    throw createError({
      statusCode: 400,
      statusMessage: "비밀번호를 올바르게 입력해 주세요.",
    });
  }

  if (message.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "댓글 내용을 입력해 주세요.",
    });
  }

  if (message.length > GUESTBOOK_MESSAGE_MAX_LENGTH) {
    throw createError({
      statusCode: 400,
      statusMessage: "댓글은 300자 이하로 입력해 주세요.",
    });
  }

  return { password, message };
}
// #endregion

export default defineEventHandler(async (event): Promise<GuestbookUpdateResponse> => {
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

  const requestBody = await readBody<Partial<GuestbookUpdateParams> | null>(event);
  const { password, message } = createApiParams(requestBody);

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

  const entry = await updateGuestbookEntryMessage(commentId, message);

  return { entry };
});
