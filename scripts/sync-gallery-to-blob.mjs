// 로컬 갤러리 이미지를 Vercel Blob 스토리지에 동기화
import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

// .env.local 파일에서 환경변수 로드
async function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  const content = await readFile(envPath, "utf8").catch(() => "");

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

await loadEnvLocal();
import { del, list, put } from "@vercel/blob";

const GALLERY_DIR = join(process.cwd(), "public", "gallery");
const BLOB_PREFIX = "gallery/";
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const MIME_MAP = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

function isImageFile(fileName) {
  return Array.from(ALLOWED_EXTENSIONS).some((ext) =>
    fileName.toLowerCase().endsWith(ext),
  );
}

// Blob 기존 항목 전체 조회
async function fetchAllBlobs() {
  const items = [];
  let cursor;

  do {
    const response = await list({ prefix: BLOB_PREFIX, limit: 1000, cursor });
    items.push(...response.blobs);
    cursor = response.hasMore ? response.cursor : undefined;
  } while (cursor);

  return items;
}

// 파일 확장자 기반 MIME 타입 반환
function getMimeType(fileName) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  return MIME_MAP[ext] ?? "image/jpeg";
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[동기화] BLOB_READ_WRITE_TOKEN 환경변수 필요");
    console.error("  사용법: BLOB_READ_WRITE_TOKEN=vercel_blob_... node scripts/sync-gallery-to-blob.mjs");
    process.exit(1);
  }

  const localFiles = (await readdir(GALLERY_DIR)).filter(isImageFile);
  console.log(`[동기화] 로컬 이미지 ${localFiles.length}개 감지`);

  const existingBlobs = await fetchAllBlobs();
  console.log(`[동기화] 기존 Blob 이미지 ${existingBlobs.length}개 감지`);

  if (existingBlobs.length > 0) {
    console.log("[동기화] 기존 Blob 이미지 삭제 중...");
    await del(existingBlobs.map((blob) => blob.url));
    console.log("[동기화] 기존 Blob 이미지 삭제 완료");
  }

  console.log("[동기화] 로컬 이미지 Blob 업로드 시작...");

  for (const fileName of localFiles) {
    const filePath = join(GALLERY_DIR, fileName);
    const fileData = await readFile(filePath);

    await put(`${BLOB_PREFIX}${fileName}`, fileData, {
      access: "public",
      addRandomSuffix: false,
      contentType: getMimeType(fileName),
    });

    console.log(`  ✓ ${fileName}`);
  }

  console.log(`[동기화] 완료: ${localFiles.length}개 이미지 Blob 업로드`);
}

main().catch((error) => {
  console.error("[동기화] 실패:", error);
  process.exit(1);
});
