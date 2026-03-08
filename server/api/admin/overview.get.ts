import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { list } from "@vercel/blob";
import type { ListBlobResultBlob } from "@vercel/blob";
import { defineEventHandler, getHeader } from "h3";
import { assertAdminAuthorized } from "~/server/utils/adminAuth";
import { getGuestbookStats } from "~/server/utils/guestbookDb";
import type {
  AdminGallerySummary,
  AdminOverviewResponse,
  AdminProjectSummary,
  AdminQuotaMetric,
} from "~/types/admin";

interface VercelProjectFile {
  projectId: string;
  orgId: string;
  projectName: string;
}

interface NeonBranchCountResponse {
  branches_count: number;
}

interface VercelDeploymentsListResponse {
  deployments?: Array<{ uid: string; createdAt: number }>;
}

const KIBIBYTE = 1024;
const MEBIBYTE = KIBIBYTE * 1024;
const GIBIBYTE = MEBIBYTE * 1024;
const NEON_FREE_STORAGE_LIMIT_BYTES = 512 * MEBIBYTE;
const VERCEL_BLOB_FREE_STORAGE_LIMIT_BYTES = 1 * GIBIBYTE;
const NEON_FREE_BRANCH_LIMIT = 10;
const VERCEL_HOBBY_DAILY_DEPLOYMENT_LIMIT = 100;

function formatBytes(value: number | null): string {
  if (value == null) {
    return "-";
  }

  if (value < KIBIBYTE) {
    return `${value} B`;
  }

  const units = ["KB", "MB", "GB", "TB"] as const;
  let currentValue = value / KIBIBYTE;
  let unitIndex = 0;

  while (currentValue >= KIBIBYTE && unitIndex < units.length - 1) {
    currentValue /= KIBIBYTE;
    unitIndex += 1;
  }

  return `${currentValue.toFixed(1)} ${units[unitIndex]}`;
}

function createQuotaStatus(
  remainingValue: number | null,
  limitValue: number | null,
): AdminQuotaMetric["status"] {
  if (remainingValue == null || limitValue == null) {
    return "unavailable";
  }

  if (remainingValue <= limitValue * 0.1) {
    return "warning";
  }

  return "ok";
}

async function readLocalVercelProjectFile(): Promise<VercelProjectFile | null> {
  const projectFilePath = join(process.cwd(), ".vercel", "project.json");
  if (!existsSync(projectFilePath)) {
    return null;
  }

  const rawContent = await readFile(projectFilePath, "utf8");
  return JSON.parse(rawContent) as VercelProjectFile;
}

async function createProjectSummary(): Promise<AdminProjectSummary> {
  const localProjectFile = await readLocalVercelProjectFile();
  const deploymentHost = process.env.VERCEL_URL;
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  return {
    projectName: process.env.VERCEL_PROJECT_NAME ?? localProjectFile?.projectName ?? null,
    projectId: process.env.VERCEL_PROJECT_ID ?? localProjectFile?.projectId ?? null,
    orgId: process.env.VERCEL_ORG_ID ?? localProjectFile?.orgId ?? null,
    environment: process.env.VERCEL_ENV ?? "development",
    deploymentUrl: deploymentHost ? `https://${deploymentHost}` : null,
    productionUrl: productionHost ? `https://${productionHost}` : null,
    isVercelRuntime: process.env.VERCEL === "1",
  };
}

function getStartOfKoreaDay(): Date {
  const koreaOffsetMilliseconds = 9 * 60 * 60 * 1000;
  const now = new Date();
  const koreaNow = new Date(now.getTime() + koreaOffsetMilliseconds);

  koreaNow.setUTCHours(0, 0, 0, 0);

  return new Date(koreaNow.getTime() - koreaOffsetMilliseconds);
}

async function createVercelDeploymentQuotaMetric(
  project: AdminProjectSummary,
): Promise<AdminQuotaMetric> {
  const accessToken = process.env.VERCEL_ACCESS_TOKEN;

  if (!accessToken || !project.projectId || !project.orgId) {
    return {
      label: "Vercel 배포",
      limitText: "100회/일",
      usedText: "-",
      remainingText: "-",
      status: "unavailable",
      note: "VERCEL_ACCESS_TOKEN 필요, 오늘(KST) 기준 배포 횟수 계산",
    };
  }

  const since = getStartOfKoreaDay().getTime();
  const searchParams = new URLSearchParams({
    projectId: project.projectId,
    teamId: project.orgId,
    since: String(since),
    limit: "100",
  });
  const response = await fetch(
    `https://api.vercel.com/v6/deployments?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    return {
      label: "Vercel 배포",
      limitText: "100회/일",
      usedText: "-",
      remainingText: "-",
      status: "unavailable",
      note: "Vercel API 조회 실패, 토큰/권한 확인 필요",
    };
  }

  const data = await response.json() as VercelDeploymentsListResponse;
  const usedCount = data.deployments?.length ?? 0;
  const remainingCount = Math.max(VERCEL_HOBBY_DAILY_DEPLOYMENT_LIMIT - usedCount, 0);

  return {
    label: "Vercel 배포",
    limitText: "100회/일",
    usedText: `${usedCount}회`,
    remainingText: `${remainingCount}회`,
    status: createQuotaStatus(remainingCount, VERCEL_HOBBY_DAILY_DEPLOYMENT_LIMIT),
    note: "Vercel Hobby 일일 배포 한도 기준, 오늘(KST) 집계",
  };
}

async function listBlobGalleryStats(): Promise<AdminGallerySummary> {
  const blobs: ListBlobResultBlob[] = [];
  let cursor: string | undefined;

  do {
    const response = await list({
      prefix: "gallery/",
      limit: 1000,
      cursor,
    });

    blobs.push(...response.blobs);
    cursor = response.hasMore ? response.cursor : undefined;
  } while (cursor);

  const latestUploadedAt = blobs.reduce<string | null>((latestValue, blob) => {
    const currentValue = blob.uploadedAt.toISOString();
    if (!latestValue || currentValue > latestValue) {
      return currentValue;
    }

    return latestValue;
  }, null);

  return {
    source: "blob",
    imageCount: blobs.length,
    totalBytes: blobs.reduce((sum, blob) => sum + blob.size, 0),
    latestUploadedAt,
  };
}

async function listLocalGalleryStats(): Promise<AdminGallerySummary> {
  const galleryDirPath = join(process.cwd(), "public", "gallery");
  if (!existsSync(galleryDirPath)) {
    return {
      source: "unavailable",
      imageCount: 0,
      totalBytes: 0,
      latestUploadedAt: null,
    };
  }

  const files = await readdir(galleryDirPath);
  const imageNames = files.filter((fileName) => /\.(jpg|jpeg|png|webp|gif|avif)$/i.test(fileName));
  const stats = await Promise.all(
    imageNames.map(async (fileName) => {
      const filePath = join(galleryDirPath, fileName);
      return stat(filePath);
    }),
  );

  const latestUploadedAt = stats.reduce<string | null>((latestValue, fileStat) => {
    const currentValue = fileStat.mtime.toISOString();
    if (!latestValue || currentValue > latestValue) {
      return currentValue;
    }

    return latestValue;
  }, null);

  return {
    source: "local",
    imageCount: imageNames.length,
    totalBytes: stats.reduce((sum, fileStat) => sum + fileStat.size, 0),
    latestUploadedAt,
  };
}

async function createGallerySummary(): Promise<AdminGallerySummary> {
  try {
    return await listBlobGalleryStats();
  } catch {
    return listLocalGalleryStats();
  }
}

async function createNeonBranchQuotaMetric(): Promise<AdminQuotaMetric> {
  const apiKey = process.env.NEON_API_KEY;
  const projectId = process.env.NEON_PROJECT_ID;

  if (!apiKey || !projectId) {
    return {
      label: "Neon 브랜치",
      limitText: "10개/프로젝트",
      usedText: "-",
      remainingText: "-",
      status: "unavailable",
      note: "NEON_API_KEY, NEON_PROJECT_ID 필요",
    };
  }

  const response = await fetch(
    `https://console.neon.tech/api/v2/projects/${projectId}/branches/count`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    return {
      label: "Neon 브랜치",
      limitText: "10개/프로젝트",
      usedText: "-",
      remainingText: "-",
      status: "unavailable",
      note: "Neon API 조회 실패, 토큰/프로젝트 ID 확인 필요",
    };
  }

  const data = await response.json() as NeonBranchCountResponse;
  const usedCount = data.branches_count;
  const remainingCount = Math.max(NEON_FREE_BRANCH_LIMIT - usedCount, 0);

  return {
    label: "Neon 브랜치",
    limitText: "10개/프로젝트",
    usedText: `${usedCount}개`,
    remainingText: `${remainingCount}개`,
    status: createQuotaStatus(remainingCount, NEON_FREE_BRANCH_LIMIT),
    note: "Neon Free 브랜치 수 기준",
  };
}

function createGalleryStorageQuotaMetric(
  gallery: AdminGallerySummary,
): AdminQuotaMetric {
  const remainingBytes = Math.max(
    VERCEL_BLOB_FREE_STORAGE_LIMIT_BYTES - gallery.totalBytes,
    0,
  );

  return {
    label: "Blob 이미지 저장량",
    limitText: formatBytes(VERCEL_BLOB_FREE_STORAGE_LIMIT_BYTES),
    usedText: formatBytes(gallery.totalBytes),
    remainingText: formatBytes(remainingBytes),
    status: createQuotaStatus(remainingBytes, VERCEL_BLOB_FREE_STORAGE_LIMIT_BYTES),
    note: "현재 저장 용량 기준 추정, 월 평균 저장량/전송량은 별도 미집계",
  };
}

function createGuestbookStorageQuotaMetric(
  databaseSizeBytes: number | null,
): AdminQuotaMetric {
  const remainingBytes = databaseSizeBytes == null
    ? null
    : Math.max(NEON_FREE_STORAGE_LIMIT_BYTES - databaseSizeBytes, 0);

  return {
    label: "Neon DB 저장량",
    limitText: formatBytes(NEON_FREE_STORAGE_LIMIT_BYTES),
    usedText: formatBytes(databaseSizeBytes),
    remainingText: formatBytes(remainingBytes),
    status: createQuotaStatus(remainingBytes, NEON_FREE_STORAGE_LIMIT_BYTES),
    note: "pg_database_size 현재 DB 크기 기준 추정",
  };
}

async function createQuotaMetrics(
  project: AdminProjectSummary,
  guestbookDatabaseSizeBytes: number | null,
  gallery: AdminGallerySummary,
): Promise<AdminQuotaMetric[]> {
  const [vercelDeploymentQuota, neonBranchQuota] = await Promise.all([
    createVercelDeploymentQuotaMetric(project),
    createNeonBranchQuotaMetric(),
  ]);

  return [
    createGuestbookStorageQuotaMetric(guestbookDatabaseSizeBytes),
    createGalleryStorageQuotaMetric(gallery),
    vercelDeploymentQuota,
    neonBranchQuota,
  ];
}

export default defineEventHandler(async (event): Promise<AdminOverviewResponse> => {
  const providedAdminKey = getHeader(event, "x-admin-key");
  assertAdminAuthorized(providedAdminKey);

  const [project, guestbook, gallery] = await Promise.all([
    createProjectSummary(),
    getGuestbookStats(),
    createGallerySummary(),
  ]);
  const quotas = await createQuotaMetrics(
    project,
    guestbook.databaseSizeBytes,
    gallery,
  );

  return {
    project,
    guestbook,
    gallery,
    quotas,
  };
});
