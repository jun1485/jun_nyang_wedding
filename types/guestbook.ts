export interface GuestbookEntry {
  id: number;
  authorName: string;
  message: string;
  createdAt: string;
  hasPassword: boolean;
}

export interface GuestbookPagination {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface GuestbookListResponse {
  enabled: boolean;
  entries: GuestbookEntry[];
  pagination: GuestbookPagination;
}

export interface GuestbookCreateParams {
  authorName: string;
  message: string;
  password?: string;
}

export interface GuestbookCreateResponse {
  entry: GuestbookEntry;
}

export interface GuestbookUpdateParams {
  password: string;
  message: string;
}

export interface GuestbookUpdateResponse {
  entry: GuestbookEntry;
}

export interface GuestbookDeleteByPasswordParams {
  password: string;
}

export interface GuestbookDeleteByPasswordResponse {
  deleted: boolean;
}
