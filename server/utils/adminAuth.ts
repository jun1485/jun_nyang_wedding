import { createError } from "h3";

function assertAdminKey(value: string | undefined): asserts value is string {
  if (value) return;

  throw createError({
    statusCode: 500,
    statusMessage: "ADMIN_UPLOAD_KEY 환경변수 설정 필요",
  });
}

export function getAdminExpectedKey(): string {
  const adminKey = process.env.ADMIN_UPLOAD_KEY;
  assertAdminKey(adminKey);
  return adminKey;
}

export function assertAdminAuthorized(providedKey: string | undefined): void {
  if (providedKey === getAdminExpectedKey()) {
    return;
  }

  throw createError({
    statusCode: 401,
    statusMessage: "관리자 접근 권한 필요",
  });
}
