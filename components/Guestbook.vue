<template>
  <section :class="[sharedStyles.shared__sectionWrap, guestbookStyles.guestbook__sectionOffset]">
    <div :class="guestbookStyles.guestbook__header">
      <span :class="sharedStyles.shared__floralChip">Guestbook</span>
      <h2 :class="[sharedStyles.shared__sectionTitle, guestbookStyles.guestbook__title]">축하 댓글</h2>
      <p :class="[sharedStyles.shared__sectionSubtitle, guestbookStyles.guestbook__subtitle]">
        마음을 담아 짧은 축하 인사를 남겨 주세요
      </p>
    </div>

    <div :class="guestbookStyles.guestbook__grid">
      <article :class="[sharedStyles.shared__sectionCard, guestbookStyles.guestbook__formCard]">
        <form :class="guestbookStyles.guestbook__form" @submit.prevent="handleSubmit">
          <div :class="guestbookStyles.guestbook__fieldGroup">
            <div :class="guestbookStyles.guestbook__fieldLabelRow">
              <label for="guestbook-author-name" :class="guestbookStyles.guestbook__fieldLabel">성함</label>
              <span :class="guestbookStyles.guestbook__fieldCount">{{ nameLengthText }}</span>
            </div>
            <input
              id="guestbook-author-name"
              v-model="authorName"
              type="text"
              maxlength="20"
              autocomplete="name"
              placeholder="성함 또는 닉네임"
              :class="guestbookStyles.guestbook__input"
            />
          </div>

          <div :class="guestbookStyles.guestbook__fieldGroup">
            <div :class="guestbookStyles.guestbook__fieldLabelRow">
              <label for="guestbook-message" :class="guestbookStyles.guestbook__fieldLabel">댓글</label>
              <span :class="guestbookStyles.guestbook__fieldCount">{{ messageLengthText }}</span>
            </div>
            <textarea
              id="guestbook-message"
              v-model="message"
              rows="5"
              maxlength="300"
              placeholder="두 분의 앞날을 축복하는 메시지를 남겨 주세요"
              :class="guestbookStyles.guestbook__textarea"
            />
          </div>

          <div :class="guestbookStyles.guestbook__fieldGroup">
            <div :class="guestbookStyles.guestbook__fieldLabelRow">
              <label for="guestbook-password" :class="guestbookStyles.guestbook__fieldLabel">비밀번호</label>
              <span :class="guestbookStyles.guestbook__fieldCount">{{ passwordLengthText }}</span>
            </div>
            <input
              id="guestbook-password"
              v-model="password"
              type="password"
              maxlength="20"
              autocomplete="off"
              placeholder="수정/삭제 시 필요 (선택)"
              :class="guestbookStyles.guestbook__input"
            />
          </div>

          <div :class="guestbookStyles.guestbook__actionRow">
            <button
              type="submit"
              :disabled="submitDisabled"
              :class="[sharedStyles.shared__petalButton, guestbookStyles.guestbook__submitButton]"
            >
              {{ isSubmittingEntry ? "등록 중" : "댓글 남기기" }}
            </button>
          </div>
        </form>
      </article>

      <article ref="listCardRef" :class="[sharedStyles.shared__sectionCard, guestbookStyles.guestbook__listCard]">
        <div :class="guestbookStyles.guestbook__listHeader">
          <h3 :class="guestbookStyles.guestbook__listTitle">최근 댓글</h3>
          <button
            type="button"
            :disabled="isLoadingEntries"
            :class="guestbookStyles.guestbook__refreshButton"
            @click="fetchEntries()"
          >
            {{ isLoadingEntries ? "불러오는 중" : "새로고침" }}
          </button>
        </div>

        <div v-if="entries.length === 0" :class="guestbookStyles.guestbook__emptyState">
          {{ isGuestbookEnabled ? "첫 댓글을 남겨 주세요." : "DB 연결 후 댓글 기능 사용 가능" }}
        </div>

        <template v-else>
          <ul :class="guestbookStyles.guestbook__commentList">
            <li
              v-for="entry in entries"
              :key="entry.id"
              :class="guestbookStyles.guestbook__commentItem"
            >
              <div :class="guestbookStyles.guestbook__commentMeta">
                <strong :class="guestbookStyles.guestbook__commentAuthor">{{ entry.authorName }}</strong>
                <span :class="guestbookStyles.guestbook__commentDate">{{ formatCreatedAt(entry.createdAt) }}</span>
              </div>

              <template v-if="isEditing(entry.id)">
                <textarea
                  v-model="editingMessage"
                  rows="4"
                  maxlength="300"
                  :class="guestbookStyles.guestbook__textarea"
                />
                <div :class="guestbookStyles.guestbook__commentActions">
                  <span :class="guestbookStyles.guestbook__fieldCount">{{ editingMessageLengthText }}</span>
                  <button
                    type="button"
                    :class="guestbookStyles.guestbook__commentActionButton"
                    @click="cancelEditEntry"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    :disabled="isUpdatingEntry"
                    :class="[sharedStyles.shared__petalButton, guestbookStyles.guestbook__commentActionButton]"
                    @click="submitEditEntry"
                  >
                    {{ isUpdatingEntry ? "저장 중" : "저장" }}
                  </button>
                </div>
              </template>

              <template v-else>
                <p :class="guestbookStyles.guestbook__commentMessage">{{ entry.message }}</p>
                <div :class="guestbookStyles.guestbook__commentActions">
                  <button
                    type="button"
                    :class="guestbookStyles.guestbook__commentActionButton"
                    @click="handleEditEntry(entry)"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    :class="[guestbookStyles.guestbook__commentActionButton, guestbookStyles.guestbook__commentActionButtonDanger]"
                    @click="handleDeleteEntry(entry)"
                  >
                    삭제
                  </button>
                </div>
              </template>
            </li>
          </ul>

          <div :class="guestbookStyles.guestbook__pagination">
            <div
              v-if="isPaginationVisible"
              :class="guestbookStyles.guestbook__pageButtonRow"
            >
              <button
                type="button"
                :disabled="!hasPrevPage || isLoadingEntries"
                :class="guestbookStyles.guestbook__pageButton"
                @click="goToPrevPage"
              >
                이전
              </button>

              <button
                v-for="page in pageNumbers"
                :key="`guestbook-page-${page}`"
                type="button"
                :class="[
                  guestbookStyles.guestbook__pageButton,
                  page === currentPage
                    ? guestbookStyles.guestbook__pageButtonActive
                    : '',
                ]"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>

              <button
                type="button"
                :disabled="!hasNextPage || isLoadingEntries"
                :class="guestbookStyles.guestbook__pageButton"
                @click="goToNextPage"
              >
                다음
              </button>
            </div>
          </div>
        </template>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useGuestbookSection } from "~/composables/useGuestbookSection";

const {
  sharedStyles,
  guestbookStyles,
  listCardRef,
  authorName,
  message,
  password,
  entries,
  isGuestbookEnabled,
  isLoadingEntries,
  isSubmittingEntry,
  submitDisabled,
  currentPage,
  hasPrevPage,
  hasNextPage,
  isPaginationVisible,
  pageNumbers,
  nameLengthText,
  messageLengthText,
  passwordLengthText,
  editingMessage,
  editingMessageLengthText,
  isUpdatingEntry,
  formatCreatedAt,
  isEditing,
  fetchEntries,
  goToPage,
  goToPrevPage,
  goToNextPage,
  handleSubmit,
  handleEditEntry,
  handleDeleteEntry,
  cancelEditEntry,
  submitEditEntry,
} = useGuestbookSection();
</script>
