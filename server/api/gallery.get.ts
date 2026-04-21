import { existsSync } from "node:fs";
import { join } from "node:path";
import { list } from "@vercel/blob";
import type { ListBlobResultBlob } from "@vercel/blob";
import { defineEventHandler, type H3Event, getRequestURL } from "h3";
import type { GalleryImage } from "~/types/wedding";

interface LocalGalleryItems {
  items: GalleryImage[];
  orderKeys: string[];
}

const GALLERY_ORDER_COLLATOR = new Intl.Collator("ko", {
  numeric: true,
  sensitivity: "base",
});

function createAltText(pathname: string): string {
  const fileName = pathname.split("/").pop() ?? pathname;
  return fileName.replace(/[-_]/g, " ").replace(/\.[^.]+$/, "").trim();
}

function createItemKey(pathname: string): string {
  const normalizedPath = pathname.split("?")[0].split("#")[0];
  const fileName = normalizedPath.split("/").pop() ?? normalizedPath;
  return decodeURIComponent(fileName).toLowerCase();
}

function createOrderMap(orderKeys: string[]): Map<string, number> {
  return new Map(
    orderKeys.map((name, index) => [createItemKey(name), index] as const),
  );
}

function sortGalleryItems(items: GalleryImage[], orderKeys: string[]): GalleryImage[] {
  const orderMap = createOrderMap(orderKeys);

  return [...items].sort((a, b) => {
    const aKey = createItemKey(a.fullSrc);
    const bKey = createItemKey(b.fullSrc);
    const aOrder = orderMap.get(aKey);
    const bOrder = orderMap.get(bKey);

    if (aOrder != null && bOrder != null) {
      return aOrder - bOrder;
    }

    if (aOrder != null) {
      return -1;
    }

    if (bOrder != null) {
      return 1;
    }

    return GALLERY_ORDER_COLLATOR.compare(aKey, bKey);
  });
}

function createLocalThumbSrc(name: string): string {
  const localThumbPath = join(process.cwd(), "public", "gallery", "thumbs", name);
  if (!existsSync(localThumbPath)) {
    return `/gallery/${name}`;
  }

  return `/gallery/thumbs/${name}`;
}

function isLocalOrigin(origin: string): boolean {
  return /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(origin);
}

// Blob 업로드 시각 기반 캐시버스터 URL 생성
function createVersionedBlobUrl(sourceUrl: string, uploadedAt: Date): string {
  const version = uploadedAt.getTime();
  const separator = sourceUrl.includes("?") ? "&" : "?";
  return `${sourceUrl}${separator}v=${version}`;
}

function createOptimizedRemoteThumbSrc(
  event: H3Event,
  sourceUrl: string,
  uploadedAt: Date,
): string {
  const origin = getRequestURL(event).origin;
  const versionedUrl = createVersionedBlobUrl(sourceUrl, uploadedAt);
  if (isLocalOrigin(origin)) {
    return versionedUrl;
  }

  const encodedSourceUrl = encodeURIComponent(versionedUrl);
  return `/_vercel/image?url=${encodedSourceUrl}&w=480&q=75`;
}

async function fetchLocalItems(event: H3Event): Promise<LocalGalleryItems> {
  const files = await fetchLocalManifestItems(event);
  const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
  const filteredFiles = files.filter((name) => {
    const lowerName = name.toLowerCase();
    return Array.from(allowedExtensions).some((extension) =>
      lowerName.endsWith(extension),
    );
  });

  return {
    orderKeys: filteredFiles,
    items: filteredFiles.map((name) => ({
      thumbSrc: createLocalThumbSrc(name),
      fullSrc: `/gallery/${name}`,
      alt: createAltText(name),
    })),
  };
}

async function fetchLocalManifestItems(event: H3Event): Promise<string[]> {
  const origin = getRequestURL(event).origin;
  const manifestUrl = `${origin}/gallery/manifest.json`;
  const response = await fetch(manifestUrl).catch(() => null);

  if (!response || !response.ok) {
    return [];
  }

  const data = await response.json().catch(() => []);
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter((item): item is string => typeof item === "string");
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

export default defineEventHandler(async (event): Promise<GalleryImage[]> => {
  try {
    const items = await fetchBlobItems();
    if (items.length > 0) {
      return items
        .sort((a, b) =>
          GALLERY_ORDER_COLLATOR.compare(
            createItemKey(a.pathname),
            createItemKey(b.pathname),
          ),
        )
        .map((item) => ({
          thumbSrc: createOptimizedRemoteThumbSrc(event, item.url, item.uploadedAt),
          fullSrc: createVersionedBlobUrl(item.url, item.uploadedAt),
          alt: createAltText(item.pathname),
        }));
    }
  } catch {
    // Blob 조회 실패 시 로컬 갤러리 fallback 경로 유지
  }

  const localGallery = await fetchLocalItems(event);
  if (localGallery.items.length > 0) {
    return sortGalleryItems(localGallery.items, localGallery.orderKeys);
  }

  return [];
});
