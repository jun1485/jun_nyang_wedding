import { list } from "@vercel/blob";
import type { ListBlobResultBlob } from "@vercel/blob";
import { defineEventHandler } from "h3";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

interface GalleryItem {
  src: string;
  alt: string;
}

function createAltText(pathname: string): string {
  const fileName = pathname.split("/").pop() ?? pathname;
  return fileName.replace(/[-_]/g, " ").replace(/\.[^.]+$/, "").trim();
}

async function fetchLocalItems(): Promise<GalleryItem[]> {
  const galleryDir = join(process.cwd(), "public", "gallery");
  const files = await readdir(galleryDir).catch(() => []);
  const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

  return files
    .filter((name) => {
      const lowerName = name.toLowerCase();
      return Array.from(allowedExtensions).some((extension) =>
        lowerName.endsWith(extension)
      );
    })
    .sort((a, b) => a.localeCompare(b, "ko"))
    .map((name) => ({
      src: `/gallery/${name}`,
      alt: createAltText(name),
    }));
}

async function fetchBlobItems(): Promise<ListBlobResultBlob[]> {
  const items: ListBlobResultBlob[] = [];
  let cursor: string | undefined;

  do {
    const response = await list({
      prefix: "gallery/",
      limit: 1000,
      cursor,
    });

    items.push(...response.blobs);
    cursor = response.hasMore ? response.cursor : undefined;
  } while (cursor);

  return items;
}

export default defineEventHandler(async (): Promise<GalleryItem[]> => {
  try {
    const items = await fetchBlobItems();
    if (items.length > 0) {
      return items
        .sort((a, b) => a.pathname.localeCompare(b.pathname, "ko"))
        .map((item) => ({
          src: item.url,
          alt: createAltText(item.pathname),
        }));
    }
  } catch {
    return fetchLocalItems();
  }

  return fetchLocalItems();
});
