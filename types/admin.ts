import type { GuestbookEntry } from "~/types/guestbook";

export interface AdminQuotaMetric {
  label: string;
  limitText: string;
  usedText: string;
  remainingText: string;
  status: "ok" | "warning" | "unavailable";
  note: string;
}

export interface AdminProjectSummary {
  projectName: string | null;
  projectId: string | null;
  orgId: string | null;
  environment: string;
  deploymentUrl: string | null;
  productionUrl: string | null;
  isVercelRuntime: boolean;
}

export interface AdminGuestbookSummary {
  enabled: boolean;
  commentCount: number;
  latestCommentAt: string | null;
  databaseSizeBytes: number | null;
  recentEntries: GuestbookEntry[];
}

export interface AdminGallerySummary {
  source: "blob" | "local" | "unavailable";
  imageCount: number;
  totalBytes: number;
  latestUploadedAt: string | null;
}

export interface AdminOverviewResponse {
  project: AdminProjectSummary;
  guestbook: AdminGuestbookSummary;
  gallery: AdminGallerySummary;
  quotas: AdminQuotaMetric[];
}

export interface AdminDeleteCommentsParams {
  commentIds: number[];
}

export interface AdminDeleteCommentsResponse {
  deletedCount: number;
}
