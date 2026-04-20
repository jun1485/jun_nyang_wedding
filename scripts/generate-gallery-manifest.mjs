import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const GALLERY_ORDER_COLLATOR = new Intl.Collator("ko", {
  numeric: true,
  sensitivity: "base",
});

function isAllowedImageFile(fileName) {
  const normalizedName = fileName.toLowerCase();
  return Array.from(ALLOWED_EXTENSIONS).some((extension) =>
    normalizedName.endsWith(extension)
  );
}

async function readExistingManifest(manifestPath) {
  const manifestText = await readFile(manifestPath, { encoding: "utf8" }).catch(
    () => null,
  );

  if (!manifestText) {
    return [];
  }

  try {
    const parsed = JSON.parse(manifestText);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((fileName) => typeof fileName === "string");
  } catch {
    return [];
  }
}

// 신규 파일 자연정렬 위치 삽입
function createOrderedManifest(files, existingOrder) {
  const currentSet = new Set(files);
  const preservedOrder = existingOrder.filter((fileName) => currentSet.has(fileName));
  const preservedSet = new Set(preservedOrder);
  const newFiles = files.filter((fileName) => !preservedSet.has(fileName));

  const result = [...preservedOrder];
  for (const newFile of newFiles) {
    const insertIndex = result.findIndex(
      (existing) => GALLERY_ORDER_COLLATOR.compare(existing, newFile) > 0,
    );
    if (insertIndex === -1) {
      result.push(newFile);
    } else {
      result.splice(insertIndex, 0, newFile);
    }
  }
  return result;
}

async function main() {
  const galleryDir = join(process.cwd(), "public", "gallery");
  const manifestPath = join(galleryDir, "manifest.json");
  const files = await readdir(galleryDir).catch(() => []);
  const existingManifest = await readExistingManifest(manifestPath);
  const imageFiles = files
    .filter((fileName) => isAllowedImageFile(fileName))
    .sort((a, b) => GALLERY_ORDER_COLLATOR.compare(a, b));
  const orderedManifest = createOrderedManifest(imageFiles, existingManifest);

  await writeFile(manifestPath, `${JSON.stringify(orderedManifest, null, 2)}\n`, {
    encoding: "utf8",
  });

  console.log(`[갤러리] manifest 생성 완료: ${orderedManifest.length}개`);
}

main().catch((error) => {
  console.error("[갤러리] manifest 생성 실패:", error);
  process.exit(1);
});
