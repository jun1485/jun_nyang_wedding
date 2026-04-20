<template>
  <div :class="adminStyles.admin__page">
    <section :class="[sharedStyles.shared__sectionWrap, adminStyles.admin__section]">
      <div :class="adminStyles.admin__header">
        <span :class="sharedStyles.shared__floralChip">Admin</span>
        <h1 :class="[sharedStyles.shared__sectionTitle, adminStyles.admin__title]">운영 현황</h1>
        <p :class="[sharedStyles.shared__sectionSubtitle, adminStyles.admin__subtitle]">
          DB, 배포, 갤러리 사용량을 한 화면에서 확인
        </p>
      </div>

      <article :class="[sharedStyles.shared__sectionCard, adminStyles.admin__authCard]">
        <form :class="adminStyles.admin__authForm" @submit.prevent="handleSubmit">
          <label for="admin-key" :class="adminStyles.admin__label">관리자 키</label>
          <div :class="adminStyles.admin__authRow">
            <input
              id="admin-key"
              v-model="adminKey"
              type="password"
              autocomplete="current-password"
              placeholder="ADMIN_UPLOAD_KEY 입력"
              :class="adminStyles.admin__input"
            />
            <button
              type="submit"
              :disabled="isLoading"
              :class="[sharedStyles.shared__petalButton, adminStyles.admin__primaryButton]"
            >
              {{ isLoading ? "불러오는 중" : "현황 불러오기" }}
            </button>
            <button
              type="button"
              :class="adminStyles.admin__secondaryButton"
              @click="clearAdminSession"
            >
              초기화
            </button>
          </div>
          <p :class="adminStyles.admin__statusText">{{ statusMessage }}</p>
        </form>
      </article>

      <div v-if="overview" :class="adminStyles.admin__grid">
        <article :class="[sharedStyles.shared__sectionCard, adminStyles.admin__card]">
          <h2 :class="adminStyles.admin__cardTitle">배포</h2>
          <dl :class="adminStyles.admin__metricList">
            <div :class="adminStyles.admin__metricRow">
              <dt>프로젝트</dt>
              <dd>{{ overview.project.projectName ?? "-" }}</dd>
            </div>
            <div :class="adminStyles.admin__metricRow">
              <dt>환경</dt>
              <dd>{{ overview.project.environment }}</dd>
            </div>
            <div :class="adminStyles.admin__metricRow">
              <dt>현재 URL</dt>
              <dd>{{ overview.project.deploymentUrl ?? "-" }}</dd>
            </div>
            <div :class="adminStyles.admin__metricRow">
              <dt>프로덕션 URL</dt>
              <dd>{{ overview.project.productionUrl ?? "-" }}</dd>
            </div>
            <div :class="adminStyles.admin__metricRow">
              <dt>Vercel 런타임</dt>
              <dd>{{ overview.project.isVercelRuntime ? "예" : "아니오" }}</dd>
            </div>
          </dl>
        </article>

        <article :class="[sharedStyles.shared__sectionCard, adminStyles.admin__card]">
          <h2 :class="adminStyles.admin__cardTitle">댓글 DB</h2>
          <dl :class="adminStyles.admin__metricList">
            <div :class="adminStyles.admin__metricRow">
              <dt>연결 상태</dt>
              <dd>{{ overview.guestbook.enabled ? "연결됨" : "미연결" }}</dd>
            </div>
            <div :class="adminStyles.admin__metricRow">
              <dt>댓글 수</dt>
              <dd>{{ overview.guestbook.commentCount }}</dd>
            </div>
            <div :class="adminStyles.admin__metricRow">
              <dt>최근 댓글</dt>
              <dd>{{ formatDateTime(overview.guestbook.latestCommentAt) }}</dd>
            </div>
            <div :class="adminStyles.admin__metricRow">
              <dt>DB 크기</dt>
              <dd>
                {{
                  overview.guestbook.databaseSizeBytes == null
                    ? "-"
                    : formatBytes(overview.guestbook.databaseSizeBytes)
                }}
              </dd>
            </div>
          </dl>

          <div :class="adminStyles.admin__commentActions">
            <button
              type="button"
              :class="adminStyles.admin__secondaryButton"
              @click="toggleAllComments"
            >
              {{ selectedCommentCount === commentEntries.length ? "전체 해제" : "전체 선택" }}
            </button>
            <button
              type="button"
              :disabled="deleteDisabled"
              :class="[sharedStyles.shared__petalButton, adminStyles.admin__dangerButton]"
              @click="handleDeleteSelectedComments"
            >
              선택 댓글 삭제
            </button>
          </div>

          <ul
            v-if="commentEntries.length > 0"
            ref="commentListRef"
            :class="adminStyles.admin__commentList"
          >
            <li
              v-for="entry in commentEntries"
              :key="entry.id"
              :class="adminStyles.admin__commentItem"
            >
              <label :class="adminStyles.admin__commentLabel">
                <input
                  type="checkbox"
                  :checked="isCommentSelected(entry.id)"
                  :class="adminStyles.admin__commentCheckbox"
                  @change="toggleCommentSelection(entry.id)"
                />
                <span :class="adminStyles.admin__commentBody">
                  <span :class="adminStyles.admin__commentMeta">
                    <strong :class="adminStyles.admin__commentAuthor">{{ entry.authorName }}</strong>
                    <span :class="adminStyles.admin__commentDate">
                      {{ formatDateTime(entry.createdAt) }}
                    </span>
                  </span>
                  <span :class="adminStyles.admin__commentMessage">{{ entry.message }}</span>
                </span>
              </label>
            </li>
          </ul>
          <div v-else :class="adminStyles.admin__commentEmpty">
            댓글 없음
          </div>

          <div :class="adminStyles.admin__pagination">
            <div
              v-if="isPaginationVisible"
              :class="adminStyles.admin__pageButtonRow"
            >
              <button
                type="button"
                :disabled="!hasPrevPage || isLoading"
                :class="adminStyles.admin__pageButton"
                @click="goToPrevPage"
              >
                이전
              </button>

              <button
                v-for="page in pageNumbers"
                :key="`admin-page-${page}`"
                type="button"
                :class="[
                  adminStyles.admin__pageButton,
                  page === currentPage
                    ? adminStyles.admin__pageButtonActive
                    : '',
                ]"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>

              <button
                type="button"
                :disabled="!hasNextPage || isLoading"
                :class="adminStyles.admin__pageButton"
                @click="goToNextPage"
              >
                다음
              </button>
            </div>
            <span :class="adminStyles.admin__paginationStatus">{{ paginationStatusText }}</span>
          </div>
        </article>

        <article :class="[sharedStyles.shared__sectionCard, adminStyles.admin__card]">
          <h2 :class="adminStyles.admin__cardTitle">갤러리 이미지</h2>
          <dl :class="adminStyles.admin__metricList">
            <div :class="adminStyles.admin__metricRow">
              <dt>소스</dt>
              <dd>{{ overview.gallery.source }}</dd>
            </div>
            <div :class="adminStyles.admin__metricRow">
              <dt>이미지 수</dt>
              <dd>{{ overview.gallery.imageCount }}</dd>
            </div>
            <div :class="adminStyles.admin__metricRow">
              <dt>총 용량</dt>
              <dd>{{ formatBytes(overview.gallery.totalBytes) }}</dd>
            </div>
            <div :class="adminStyles.admin__metricRow">
              <dt>최근 업로드</dt>
              <dd>{{ formatDateTime(overview.gallery.latestUploadedAt) }}</dd>
            </div>
          </dl>
        </article>
      </div>

      <article
        v-if="overview"
        :class="[sharedStyles.shared__sectionCard, adminStyles.admin__quotaCard]"
      >
        <div :class="adminStyles.admin__quotaHeader">
          <h2 :class="adminStyles.admin__cardTitle">무료 한도 잔여</h2>
          <p :class="adminStyles.admin__quotaGuide">
            실시간 집계 가능 항목과 현재 사용량 기반 추정 항목을 함께 표시
          </p>
        </div>

        <ul :class="adminStyles.admin__quotaList">
          <li
            v-for="quota in overview.quotas"
            :key="quota.label"
            :class="adminStyles.admin__quotaItem"
          >
            <div :class="adminStyles.admin__quotaTopRow">
              <strong :class="adminStyles.admin__quotaLabel">{{ quota.label }}</strong>
              <span
                :class="[
                  adminStyles.admin__quotaStatusBadge,
                  quota.status === 'ok'
                    ? adminStyles.admin__quotaStatusOk
                    : quota.status === 'warning'
                      ? adminStyles.admin__quotaStatusWarning
                      : adminStyles.admin__quotaStatusUnavailable,
                ]"
              >
                {{ quota.status === "ok" ? "확인 가능" : quota.status === "warning" ? "주의" : "추가 설정 필요" }}
              </span>
            </div>

            <dl :class="adminStyles.admin__quotaMetricList">
              <div :class="adminStyles.admin__quotaMetricRow">
                <dt>무료 한도</dt>
                <dd>{{ quota.limitText }}</dd>
              </div>
              <div :class="adminStyles.admin__quotaMetricRow">
                <dt>사용량</dt>
                <dd>{{ quota.usedText }}</dd>
              </div>
              <div :class="adminStyles.admin__quotaMetricRow">
                <dt>남은 양</dt>
                <dd>{{ quota.remainingText }}</dd>
              </div>
            </dl>

            <p :class="adminStyles.admin__quotaNote">{{ quota.note }}</p>
          </li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAdminDashboardPage } from "~/composables/useAdminDashboardPage";

const {
  sharedStyles,
  adminStyles,
  adminKey,
  overview,
  commentEntries,
  currentPage,
  isLoading,
  statusMessage,
  formatBytes,
  formatDateTime,
  selectedCommentCount,
  deleteDisabled,
  hasPrevPage,
  hasNextPage,
  isPaginationVisible,
  pageNumbers,
  paginationStatusText,
  commentListRef,
  isCommentSelected,
  toggleCommentSelection,
  toggleAllComments,
  goToPage,
  goToPrevPage,
  goToNextPage,
  handleSubmit,
  handleDeleteSelectedComments,
  clearAdminSession,
} = useAdminDashboardPage();

useHead({
  title: "관리 대시보드",
});
</script>
