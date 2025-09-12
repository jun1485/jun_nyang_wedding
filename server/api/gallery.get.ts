import { defineEventHandler } from "h3";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

interface GalleryItem {
  src: string;
  alt: string;
}

export default defineEventHandler(async () => {
  try {
    const publicDir = join(process.cwd(), "public", "gallery");
    const files = await readdir(publicDir).catch(() => []);

    const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

    const items: GalleryItem[] = files
      .filter((name) => {
        const lower = name.toLowerCase();
        return Array.from(allowed).some((ext) => lower.endsWith(ext));
      })
      .sort((a, b) => a.localeCompare(b, "ko"))
      .map((name) => ({
        src: `/gallery/${name}`,
        alt: name
          .replace(/[-_]/g, " ")
          .replace(/\.[^.]+$/, "")
          .trim(),
      }));

    return items;
  } catch {
    // 문제 발생 시 빈 배열 반환하여 클라이언트에서 fallback 사용
    return [] as GalleryItem[];
  }
});
