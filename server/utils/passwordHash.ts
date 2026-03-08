import { randomBytes, scryptSync } from "node:crypto";

// #region 비밀번호 해시 설정
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;
const HASH_SEPARATOR = ":";
export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_MAX_LENGTH = 20;
export const DEFAULT_COMMENT_PASSWORD = "쭌냥결혼0516";
// #endregion

// 평문 비밀번호를 salt:hash 형태로 해시 생성
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return `${salt}${HASH_SEPARATOR}${hash}`;
}

// 입력 비밀번호와 저장된 salt:hash 일치 여부 검증
export function verifyPassword(password: string, storedHash: string): boolean {
  const separatorIndex = storedHash.indexOf(HASH_SEPARATOR);

  if (separatorIndex < 0) {
    return false;
  }

  const salt = storedHash.slice(0, separatorIndex);
  const originalHash = storedHash.slice(separatorIndex + 1);
  const candidateHash = scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return candidateHash === originalHash;
}
