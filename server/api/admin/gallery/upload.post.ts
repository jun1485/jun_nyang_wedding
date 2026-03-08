import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import type { MultiPartData } from "h3";
import {
  createError,
  defineEventHandler,
  getHeader,
  readMultipartFormData,
} from "h3";
import { assertAdminAuthorized } from "~/server/utils/adminAuth";

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
  const providedUploadKey =
    getHeader(event, "x-admin-upload-key") ?? getHeader(event, "x-admin-key");
  assertAdminAuthorized(providedUploadKey);

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
