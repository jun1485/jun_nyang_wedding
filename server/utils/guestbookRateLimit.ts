import { createError, type H3Event } from "h3";

interface GuestbookRateLimitEntry {
  submittedAtMsList: number[];
}

interface GuestbookRateLimitGlobalState {
  __guestbookRateLimitMap?: Map<string, GuestbookRateLimitEntry>;
}

const GUESTBOOK_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const GUESTBOOK_RATE_LIMIT_MAX_SUBMISSIONS = 3;
const GUESTBOOK_RATE_LIMIT_MIN_INTERVAL_MS = 30 * 1000;
const LOCALHOST_HOSTNAME_LIST = ["localhost", "127.0.0.1"];

function getGuestbookRateLimitGlobalState(): typeof globalThis & GuestbookRateLimitGlobalState {
  return globalThis as typeof globalThis & GuestbookRateLimitGlobalState;
}

function getGuestbookRateLimitMap(): Map<string, GuestbookRateLimitEntry> {
  const globalState = getGuestbookRateLimitGlobalState();

  if (!globalState.__guestbookRateLimitMap) {
    globalState.__guestbookRateLimitMap = new Map<string, GuestbookRateLimitEntry>();
  }

  return globalState.__guestbookRateLimitMap;
}

function resolveGuestbookClientIp(event: H3Event): string {
  const forwardedForHeader = event.node.req.headers["x-forwarded-for"];
  if (typeof forwardedForHeader === "string" && forwardedForHeader.trim()) {
    return forwardedForHeader.split(",")[0]?.trim() ?? "unknown";
  }

  return event.node.req.socket.remoteAddress ?? "unknown";
}

function isGuestbookRateLimitDisabled(event: H3Event): boolean {
  if (process.env.GUESTBOOK_RATE_LIMIT_DISABLED === "true") {
    return true;
  }

  const hostHeader = event.node.req.headers.host;
  if (typeof hostHeader !== "string" || hostHeader.trim().length === 0) {
    return false;
  }

  const hostname = hostHeader.split(":")[0]?.trim().toLowerCase();
  return hostname != null && LOCALHOST_HOSTNAME_LIST.includes(hostname);
}

export function assertGuestbookSubmissionAllowed(event: H3Event): void {
  if (isGuestbookRateLimitDisabled(event)) {
    return;
  }

  const clientIp = resolveGuestbookClientIp(event);
  const rateLimitMap = getGuestbookRateLimitMap();
  const nowMs = Date.now();
  const currentEntry = rateLimitMap.get(clientIp) ?? {
    submittedAtMsList: [],
  };
  const recentSubmittedAtMsList = currentEntry.submittedAtMsList.filter(
    (submittedAtMs) => nowMs - submittedAtMs <= GUESTBOOK_RATE_LIMIT_WINDOW_MS,
  );
  const latestSubmittedAtMs = recentSubmittedAtMsList.at(-1);

  if (
    latestSubmittedAtMs != null &&
    nowMs - latestSubmittedAtMs < GUESTBOOK_RATE_LIMIT_MIN_INTERVAL_MS
  ) {
    const retryAfterSeconds = Math.ceil(
      (GUESTBOOK_RATE_LIMIT_MIN_INTERVAL_MS - (nowMs - latestSubmittedAtMs)) / 1000,
    );
    throw createError({
      statusCode: 429,
      statusMessage: `댓글 등록 간격이 너무 빨라요. ${retryAfterSeconds}초 후 다시 시도해 주세요.`,
    });
  }

  if (recentSubmittedAtMsList.length >= GUESTBOOK_RATE_LIMIT_MAX_SUBMISSIONS) {
    throw createError({
      statusCode: 429,
      statusMessage: "댓글 등록 횟수가 잠시 제한되었습니다. 10분 후 다시 시도해 주세요.",
    });
  }

  recentSubmittedAtMsList.push(nowMs);
  rateLimitMap.set(clientIp, {
    submittedAtMsList: recentSubmittedAtMsList,
  });
}
