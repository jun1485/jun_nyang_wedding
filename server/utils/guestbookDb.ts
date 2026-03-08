import { createError } from "h3";
import { Pool } from "pg";
import type { GuestbookCreateParams, GuestbookEntry } from "~/types/guestbook";
import type { AdminGuestbookSummary } from "~/types/admin";

// #region DB 행 타입
interface GuestbookRow {
  id: number;
  author_name: string;
  message: string;
  created_at: string;
  has_password: boolean;
}

interface GuestbookPasswordRow {
  password_hash: string | null;
}

interface GuestbookGlobalState {
  __guestbookPool?: Pool;
  __guestbookSchemaPromise?: Promise<void>;
}

interface GuestbookStatsRow {
  comment_count: string;
  latest_comment_at: string | null;
  database_size_bytes: string;
}

interface GuestbookCountRow {
  count: string;
}

interface GuestbookPageParams {
  page: number;
  limit: number;
}

interface GuestbookPageResult {
  entries: GuestbookEntry[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
// #endregion

// #region DB 유틸
const GUESTBOOK_TABLE_NAME = "guestbook_comments";
const GUESTBOOK_LIST_LIMIT = 30;

function getGuestbookGlobalState(): typeof globalThis & GuestbookGlobalState {
  return globalThis as typeof globalThis & GuestbookGlobalState;
}

function assertDatabaseUrl(value: string | undefined): asserts value is string {
  if (value) return;

  throw createError({
    statusCode: 503,
    statusMessage: "댓글 DB 연결 정보 필요",
  });
}

function resolveDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL
    ?? process.env.POSTGRES_URL
    ?? process.env.DATABASE_URL_UNPOOLED
    ?? process.env.POSTGRES_URL_NON_POOLING
    ?? process.env.POSTGRES_PRISMA_URL
  );
}

function isLocalDatabaseHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function resolvePoolSslOption(connectionString: string): false | { rejectUnauthorized: false } {
  const databaseUrl = new URL(connectionString);
  return isLocalDatabaseHost(databaseUrl.hostname)
    ? false
    : { rejectUnauthorized: false };
}

function createPool(): Pool {
  const connectionString = resolveDatabaseUrl();
  assertDatabaseUrl(connectionString);

  return new Pool({
    connectionString,
    ssl: resolvePoolSslOption(connectionString),
    max: 3,
  });
}

function getPool(): Pool {
  const globalState = getGuestbookGlobalState();

  if (!globalState.__guestbookPool) {
    globalState.__guestbookPool = createPool();
  }

  return globalState.__guestbookPool;
}

function mapGuestbookRow(row: GuestbookRow): GuestbookEntry {
  return {
    id: row.id,
    authorName: row.author_name,
    message: row.message,
    createdAt: row.created_at,
    hasPassword: row.has_password,
  };
}

export function isGuestbookEnabled(): boolean {
  return Boolean(resolveDatabaseUrl());
}

function normalizePaginationValue(value: number, fallbackValue: number): number {
  return Number.isInteger(value) && value > 0 ? value : fallbackValue;
}

// guestbook_comments 스키마 1회 보장 초기화 사용
export async function ensureGuestbookSchema(): Promise<void> {
  if (!isGuestbookEnabled()) return;

  const globalState = getGuestbookGlobalState();

  if (!globalState.__guestbookSchemaPromise) {
    const pool = getPool();
    globalState.__guestbookSchemaPromise = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS ${GUESTBOOK_TABLE_NAME} (
          id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          author_name VARCHAR(20) NOT NULL,
          message VARCHAR(300) NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await pool.query(`
        ALTER TABLE ${GUESTBOOK_TABLE_NAME}
        ADD COLUMN IF NOT EXISTS password_hash VARCHAR(128);
      `);

      await pool.query(`
        CREATE INDEX IF NOT EXISTS ${GUESTBOOK_TABLE_NAME}_created_at_idx
        ON ${GUESTBOOK_TABLE_NAME} (created_at DESC);
      `);
    })();
  }

  try {
    await globalState.__guestbookSchemaPromise;
  } catch (error) {
    globalState.__guestbookSchemaPromise = undefined;
    throw error;
  }
}

async function getGuestbookEntryCount(pool: Pool): Promise<number> {
  const { rows } = await pool.query<GuestbookCountRow>(
    `
      SELECT COUNT(*)::text AS count
      FROM ${GUESTBOOK_TABLE_NAME}
    `,
  );
  const countRow = rows[0];

  if (!countRow) {
    throw createError({
      statusCode: 500,
      statusMessage: "댓글 개수 조회 결과 없음",
    });
  }

  return Number.parseInt(countRow.count, 10);
}

export async function listGuestbookEntriesPage(
  params: GuestbookPageParams,
): Promise<GuestbookPageResult> {
  await ensureGuestbookSchema();

  const pool = getPool();
  const safeLimit = normalizePaginationValue(params.limit, GUESTBOOK_LIST_LIMIT);
  const requestedPage = normalizePaginationValue(params.page, 1);
  const totalCount = await getGuestbookEntryCount(pool);
  const totalPages =
    totalCount === 0 ? 0 : Math.ceil(totalCount / safeLimit);
  const currentPage =
    totalPages === 0 ? 1 : Math.min(requestedPage, totalPages);

  if (totalPages === 0) {
    return {
      entries: [],
      totalCount,
      currentPage,
      totalPages,
    };
  }

  const offset = (currentPage - 1) * safeLimit;
  const { rows } = await pool.query<GuestbookRow>(
    `
      SELECT
        id,
        author_name,
        message,
        to_char(
          created_at AT TIME ZONE 'UTC',
          'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
        ) AS created_at,
        (password_hash IS NOT NULL) AS has_password
      FROM ${GUESTBOOK_TABLE_NAME}
      ORDER BY created_at DESC
      LIMIT $1
      OFFSET $2
    `,
    [safeLimit, offset],
  );

  return {
    entries: rows.map(mapGuestbookRow),
    totalCount,
    currentPage,
    totalPages,
  };
}

export async function listGuestbookEntries(
  limit = GUESTBOOK_LIST_LIMIT,
): Promise<GuestbookEntry[]> {
  const pageResult = await listGuestbookEntriesPage({
    page: 1,
    limit,
  });

  return pageResult.entries;
}

// 댓글 생성 - passwordHash 선택 저장
export async function insertGuestbookEntry(
  params: GuestbookCreateParams,
  passwordHash?: string,
): Promise<GuestbookEntry> {
  await ensureGuestbookSchema();

  const pool = getPool();
  const { rows } = await pool.query<GuestbookRow>(
    `
      INSERT INTO ${GUESTBOOK_TABLE_NAME} (
        author_name,
        message,
        password_hash
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        author_name,
        message,
        to_char(
          created_at AT TIME ZONE 'UTC',
          'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
        ) AS created_at,
        (password_hash IS NOT NULL) AS has_password
    `,
    [params.authorName, params.message, passwordHash ?? null],
  );

  const createdEntry = rows[0];

  if (!createdEntry) {
    throw createError({
      statusCode: 500,
      statusMessage: "댓글 저장 결과 없음",
    });
  }

  return mapGuestbookRow(createdEntry);
}

export async function getGuestbookStats(): Promise<AdminGuestbookSummary> {
  if (!isGuestbookEnabled()) {
    return {
      enabled: false,
      commentCount: 0,
      latestCommentAt: null,
      databaseSizeBytes: null,
      recentEntries: [],
    };
  }

  await ensureGuestbookSchema();

  const pool = getPool();
  const [statsResult, recentEntries] = await Promise.all([
    pool.query<GuestbookStatsRow>(`
      SELECT
        COUNT(*)::text AS comment_count,
        to_char(
          MAX(created_at) AT TIME ZONE 'UTC',
          'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
        ) AS latest_comment_at,
        pg_database_size(current_database())::text AS database_size_bytes
      FROM ${GUESTBOOK_TABLE_NAME}
    `),
    listGuestbookEntries(),
  ]);
  const statsRow = statsResult.rows[0];

  if (!statsRow) {
    throw createError({
      statusCode: 500,
      statusMessage: "댓글 통계 조회 결과 없음",
    });
  }

  return {
    enabled: true,
    commentCount: Number.parseInt(statsRow.comment_count, 10),
    latestCommentAt: statsRow.latest_comment_at,
    databaseSizeBytes: Number.parseInt(statsRow.database_size_bytes, 10),
    recentEntries,
  };
}

export async function deleteGuestbookEntries(commentIds: readonly number[]): Promise<number> {
  if (commentIds.length === 0) {
    return 0;
  }

  await ensureGuestbookSchema();

  const pool = getPool();
  const { rowCount } = await pool.query(
    `
      DELETE FROM ${GUESTBOOK_TABLE_NAME}
      WHERE id = ANY($1::int[])
    `,
    [commentIds],
  );

  return rowCount ?? 0;
}

// 특정 댓글의 비밀번호 해시 조회
export async function getGuestbookEntryPasswordHash(
  commentId: number,
): Promise<string | null> {
  await ensureGuestbookSchema();

  const pool = getPool();
  const { rows } = await pool.query<GuestbookPasswordRow>(
    `
      SELECT password_hash
      FROM ${GUESTBOOK_TABLE_NAME}
      WHERE id = $1
    `,
    [commentId],
  );

  const row = rows[0];

  if (!row) {
    throw createError({
      statusCode: 404,
      statusMessage: "댓글을 찾을 수 없습니다.",
    });
  }

  return row.password_hash;
}

// 댓글 메시지 수정
export async function updateGuestbookEntryMessage(
  commentId: number,
  message: string,
): Promise<GuestbookEntry> {
  await ensureGuestbookSchema();

  const pool = getPool();
  const { rows } = await pool.query<GuestbookRow>(
    `
      UPDATE ${GUESTBOOK_TABLE_NAME}
      SET message = $2
      WHERE id = $1
      RETURNING
        id,
        author_name,
        message,
        to_char(
          created_at AT TIME ZONE 'UTC',
          'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
        ) AS created_at,
        (password_hash IS NOT NULL) AS has_password
    `,
    [commentId, message],
  );

  const updatedEntry = rows[0];

  if (!updatedEntry) {
    throw createError({
      statusCode: 404,
      statusMessage: "댓글을 찾을 수 없습니다.",
    });
  }

  return mapGuestbookRow(updatedEntry);
}

// 단일 댓글 삭제
export async function deleteGuestbookEntry(
  commentId: number,
): Promise<boolean> {
  await ensureGuestbookSchema();

  const pool = getPool();
  const { rowCount } = await pool.query(
    `
      DELETE FROM ${GUESTBOOK_TABLE_NAME}
      WHERE id = $1
    `,
    [commentId],
  );

  return (rowCount ?? 0) > 0;
}
// #endregion
