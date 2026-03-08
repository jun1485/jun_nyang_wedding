import { createError, readBody } from "h3";
import { assertGuestbookSubmissionAllowed } from "../utils/guestbookRateLimit";
import { hashPassword, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../utils/passwordHash";
import type {
  GuestbookCreateParams,
  GuestbookCreateResponse,
} from "~/types/guestbook";
import { insertGuestbookEntry, isGuestbookEnabled } from "../utils/guestbookDb";

// #region 댓글 생성 규칙
const GUESTBOOK_AUTHOR_NAME_MAX_LENGTH = 20;
const GUESTBOOK_MESSAGE_MAX_LENGTH = 300;
// #endregion

// #region 입력 정규화
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

// 요청 본문 검증 및 정규화
function createApiParams(
  body: Partial<GuestbookCreateParams> | null,
): { params: GuestbookCreateParams; passwordHash: string | undefined } {
  const authorName = normalizeWhitespace(body?.authorName ?? "");
  const message = normalizeMessage(body?.message ?? "");
  const rawPassword = typeof body?.password === "string" ? body.password.trim() : "";

  if (authorName.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "성함을 입력해 주세요.",
    });
  }

  if (authorName.length > GUESTBOOK_AUTHOR_NAME_MAX_LENGTH) {
    throw createError({
      statusCode: 400,
      statusMessage: "성함은 20자 이하로 입력해 주세요.",
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

  let passwordHash: string | undefined;

  if (rawPassword.length > 0) {
    if (rawPassword.length < PASSWORD_MIN_LENGTH) {
      throw createError({
        statusCode: 400,
        statusMessage: `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상 입력해 주세요.`,
      });
    }

    if (rawPassword.length > PASSWORD_MAX_LENGTH) {
      throw createError({
        statusCode: 400,
        statusMessage: `비밀번호는 ${PASSWORD_MAX_LENGTH}자 이하로 입력해 주세요.`,
      });
    }

    passwordHash = hashPassword(rawPassword);
  }

  return {
    params: { authorName, message },
    passwordHash,
  };
}
// #endregion

export default defineEventHandler(async (event): Promise<GuestbookCreateResponse> => {
  if (!isGuestbookEnabled()) {
    throw createError({
      statusCode: 503,
      statusMessage: "댓글 DB 연결 정보 필요",
    });
  }

  assertGuestbookSubmissionAllowed(event);

  const requestBody = await readBody<Partial<GuestbookCreateParams> | null>(event);
  const { params, passwordHash } = createApiParams(requestBody);
  const entry = await insertGuestbookEntry(params, passwordHash);

  return { entry };
});
