import { list } from "@vercel/blob";
import type { ListBlobResultBlob } from "@vercel/blob";
import { defineEventHandler, type H3Event, getRequestURL } from "h3";

interface GalleryItem {
  src: string;
  alt: string;
}

interface LocalGalleryItems {
  items: GalleryItem[];
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

function sortGalleryItems(items: GalleryItem[], orderKeys: string[]): GalleryItem[] {
  const orderMap = createOrderMap(orderKeys);

  return [...items].sort((a, b) => {
    const aKey = createItemKey(a.src);
    const bKey = createItemKey(b.src);
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
      src: `/gallery/${name}`,
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

export default defineEventHandler(async (event): Promise<GalleryItem[]> => {
  const localGallery = await fetchLocalItems(event);
  if (localGallery.items.length > 0) {
    return sortGalleryItems(localGallery.items, localGallery.orderKeys);
  }

  try {
    const items = await fetchBlobItems();
    return items
      .sort((a, b) =>
        GALLERY_ORDER_COLLATOR.compare(
          createItemKey(a.pathname),
          createItemKey(b.pathname),
        ),
      )
      .map((item) => ({
        src: item.url,
        alt: createAltText(item.pathname),
      }));
  } catch {
    return [];
  }
});
