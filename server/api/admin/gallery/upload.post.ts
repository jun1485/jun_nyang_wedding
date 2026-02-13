import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import type { MultiPartData } from "h3";
import {
  createError,
  defineEventHandler,
  getHeader,
  readMultipartFormData,
} from "h3";

const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;
const FILE_NAME_SANITIZE_REGEXP = /[^a-zA-Z0-9._-]/g;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
type MultipartImagePart = MultiPartData & {
  data: Uint8Array;
  type: string;
  filename?: string;
};

function assertAdminUploadKey(value: string | undefined): asserts value is string {
  if (!value) {
    throw createError({
      statusCode: 500,
      statusMessage: "ADMIN_UPLOAD_KEY 환경변수 설정 필요",
    });
  }
}

function assertAdminAuthorized(
  provided: string | undefined,
  expected: string
): asserts provided is string {
  if (provided !== expected) {
    throw createError({
      statusCode: 401,
      statusMessage: "관리자 업로드 권한 필요",
    });
  }
}

function assertImagePart(
  value: MultiPartData | undefined
): asserts value is MultipartImagePart {
  if (!value || !value.data || value.data.byteLength === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "업로드 이미지 파일 누락",
    });
  }

  if (!value.type || !ALLOWED_MIME_TYPES.has(value.type)) {
    throw createError({
      statusCode: 400,
      statusMessage: "지원하지 않는 이미지 형식",
    });
  }

  if (value.data.byteLength > MAX_IMAGE_SIZE_BYTES) {
    throw createError({
      statusCode: 400,
      statusMessage: "이미지 크기 4MB 이하 제한",
    });
  }
}

function createSafeFileName(originalName: string): string {
  const normalizedName = originalName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(FILE_NAME_SANITIZE_REGEXP, "");

  return normalizedName.length > 0 ? normalizedName : "image.jpg";
}

export default defineEventHandler(async (event) => {
  const adminUploadKey = process.env.ADMIN_UPLOAD_KEY;
  assertAdminUploadKey(adminUploadKey);
  assertAdminAuthorized(getHeader(event, "x-admin-key"), adminUploadKey);

  const multipart = await readMultipartFormData(event);
  const filePart = multipart?.find((part) => part.name === "file");
  assertImagePart(filePart);

  const safeFileName = createSafeFileName(filePart.filename ?? "image.jpg");
  const pathname = `gallery/${Date.now()}-${randomUUID()}-${safeFileName}`;

  const blob = await put(pathname, filePart.data, {
    access: "public",
    addRandomSuffix: false,
    contentType: filePart.type,
  });

  return {
    src: blob.url,
    pathname: blob.pathname,
    // 업로드 직후 프론트 표시 데이터 일관성 유지 목적, alt 생성값 반환 방식 사용
    alt: safeFileName.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").trim(),
  };
});
