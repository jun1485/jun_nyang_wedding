import { computed, onMounted, onUnmounted, ref } from "vue";

// #region 상수
const INITIAL_VOLUME = 0.1;
const PLAYLIST = ["/audio/AWN.mp3"];
const AUTOPLAY_RETRY_INTERVAL_MS = 800;
const AUTOPLAY_MAX_RETRY_COUNT = 4;
const STORAGE_KEY_AUTOPLAY_INTENT = "wedding-bgm-autoplay-intent";
const STORAGE_KEY_VOLUME = "wedding-bgm-volume";
const STORAGE_AUTOPLAY_ON = "on";
const STORAGE_AUTOPLAY_OFF = "off";
// #endregion

/**
 * 음악 플레이어 composable - 재생/일시정지, 음소거, 볼륨 조절, 트랙 전환 제공
 */
export function useMusicPlayer() {
  // #region 상태
  const audioPlayer = ref<HTMLAudioElement | null>(null);
  const isPlaying = ref(false);
  const isMuted = ref(false);
  const volume = ref(INITIAL_VOLUME);
  const currentIndex = ref(0);
  const autoplayIntent = ref(true);
  const currentSrc = computed(() => PLAYLIST[currentIndex.value]);

  let resumeOnUserGesture: (() => void) | null = null;
  let unmuteOnUserGesture: (() => void) | null = null;
  let visibilityChangeHandler: (() => void) | null = null;
  let canPlayHandler: (() => void) | null = null;
  let pageShowHandler: (() => void) | null = null;
  let autoplayRetryTimerId: number | null = null;
  let autoplayRetryCount = 0;
  // #endregion

  // #region 사용자 제스처 이벤트
  function addUserGestureListeners(
    handler: () => void,
    once: boolean = true
  ) {
    window.addEventListener("pointerdown", handler, {
      once,
      capture: true,
    });
    window.addEventListener("touchstart", handler, {
      once,
      capture: true,
      passive: true,
    });
    window.addEventListener("click", handler, {
      once,
      capture: true,
    });
    window.addEventListener("keydown", handler, {
      once,
      capture: true,
    });
  }

  function removeUserGestureListeners(handler: () => void) {
    window.removeEventListener("pointerdown", handler, true);
    window.removeEventListener("touchstart", handler, true);
    window.removeEventListener("click", handler, true);
    window.removeEventListener("keydown", handler, true);
  }
  // #endregion

  // #region 저장소 동기화
  function persistAutoplayIntent(shouldAutoplay: boolean) {
    autoplayIntent.value = shouldAutoplay;
    try {
      localStorage.setItem(
        STORAGE_KEY_AUTOPLAY_INTENT,
        shouldAutoplay ? STORAGE_AUTOPLAY_ON : STORAGE_AUTOPLAY_OFF,
      );
    } catch {
      // 저장소 접근 불가 환경 대응 - 런타임 상태만 유지
    }
  }

  function persistVolume(nextVolume: number) {
    try {
      localStorage.setItem(STORAGE_KEY_VOLUME, String(nextVolume));
    } catch {
      // 저장소 접근 불가 환경 대응 - 런타임 상태만 유지
    }
  }

  function restorePlaybackPreferences() {
    try {
      const storedVolume = localStorage.getItem(STORAGE_KEY_VOLUME);
      const parsedVolume = storedVolume == null ? NaN : Number(storedVolume);

      if (!Number.isNaN(parsedVolume)) {
        volume.value = Math.max(0, Math.min(1, parsedVolume));
      }

      const storedAutoplayIntent = localStorage.getItem(
        STORAGE_KEY_AUTOPLAY_INTENT,
      );

      if (storedAutoplayIntent === STORAGE_AUTOPLAY_OFF) {
        autoplayIntent.value = false;
        return;
      }

      autoplayIntent.value = true;
    } catch {
      // 저장소 접근 불가 환경 대응 - 기본값 유지
      autoplayIntent.value = true;
    }
  }
  // #endregion

  // #region 재생 가능 상태 판별
  // 백그라운드 재생 차단 규칙 통일 - hidden 상태에서 재생 시도 조기 중단 사용
  function isHiddenState(): boolean {
    return document.visibilityState === "hidden";
  }

  function resolvePreferMutedAutoplay(): boolean {
    return /iphone|ipad|ipod|android/i.test(navigator.userAgent);
  }

  function clearAutoplayRetryTimer() {
    if (autoplayRetryTimerId == null) return;
    window.clearTimeout(autoplayRetryTimerId);
    autoplayRetryTimerId = null;
  }

  function resetAutoplayRetryState() {
    clearAutoplayRetryTimer();
    autoplayRetryCount = 0;
  }
  // #endregion

  // #region 볼륨 제어
  /** 볼륨 변경 - audio 요소와 상태 동기화 */
  function setVolume(newVolume: number) {
    volume.value = Math.max(0, Math.min(1, newVolume));
    persistVolume(volume.value);
    if (!audioPlayer.value) return;
    audioPlayer.value.volume = volume.value;
    if (volume.value === 0) {
      isMuted.value = true;
      audioPlayer.value.muted = true;
    } else if (isMuted.value) {
      isMuted.value = false;
      audioPlayer.value.muted = false;
    }
  }

  /** 음소거 토글 - mute 시 볼륨 아이콘 반영 */
  function toggleMute() {
    if (!audioPlayer.value) return;
    audioPlayer.value.muted = !audioPlayer.value.muted;
    isMuted.value = audioPlayer.value.muted;
  }
  // #endregion

  // #region 재생 제어
  /** 자동재생 정책 차단 시 사용자 제스처에서 재생 복원 */
  async function resumePlayback() {
    if (!audioPlayer.value) return;
    if (isHiddenState()) return;
    try {
      audioPlayer.value.muted = false;
      audioPlayer.value.defaultMuted = false;
      audioPlayer.value.removeAttribute("muted");
      audioPlayer.value.volume = volume.value;
      await audioPlayer.value.play();
      persistAutoplayIntent(true);
      isPlaying.value = true;
      isMuted.value = false;
      if (resumeOnUserGesture) {
        removeUserGestureListeners(resumeOnUserGesture);
        resumeOnUserGesture = null;
      }
      resetAutoplayRetryState();
    } catch {
      // 사용자 제스처 환경에서만 재시도
    }
  }

  async function playWithMutedState(muted: boolean): Promise<boolean> {
    if (!audioPlayer.value) return false;
    if (isHiddenState()) return false;

    const el = audioPlayer.value;
    el.muted = muted;
    el.defaultMuted = muted;

    if (muted) {
      el.setAttribute("muted", "");
    } else {
      el.removeAttribute("muted");
    }

    try {
      await el.play();
      isPlaying.value = true;
      isMuted.value = muted;
      persistAutoplayIntent(true);
      if (resumeOnUserGesture) {
        removeUserGestureListeners(resumeOnUserGesture);
        resumeOnUserGesture = null;
      }
      resetAutoplayRetryState();
      return true;
    } catch {
      return false;
    }
  }

  function attachUnmuteOnGesture() {
    const unmute = () => {
      if (!audioPlayer.value) return;
      audioPlayer.value.muted = false;
      audioPlayer.value.defaultMuted = false;
      audioPlayer.value.removeAttribute("muted");
      audioPlayer.value.volume = volume.value;
      isMuted.value = false;
      unmuteOnUserGesture = null;
    };

    if (unmuteOnUserGesture) {
      removeUserGestureListeners(unmuteOnUserGesture);
    }

    unmuteOnUserGesture = unmute;
    addUserGestureListeners(unmuteOnUserGesture);
  }

  function attachResumeOnGesture() {
    const resume = () => {
      void resumePlayback();
      resumeOnUserGesture = null;
    };

    if (resumeOnUserGesture) {
      removeUserGestureListeners(resumeOnUserGesture);
    }

    resumeOnUserGesture = resume;
    addUserGestureListeners(resumeOnUserGesture);
  }

  function scheduleAutoplayRetry(preferMutedAutoplay: boolean) {
    if (!autoplayIntent.value) return;
    if (isPlaying.value) return;
    if (autoplayRetryCount >= AUTOPLAY_MAX_RETRY_COUNT) return;

    clearAutoplayRetryTimer();
    autoplayRetryTimerId = window.setTimeout(() => {
      autoplayRetryTimerId = null;
      autoplayRetryCount += 1;
      void tryAutoplay(preferMutedAutoplay);
    }, AUTOPLAY_RETRY_INTERVAL_MS);
  }

  /** 자동재생 시도 - 정책 차단 시 muted 재생 → 제스처 대기 순서로 fallback */
  async function tryAutoplay(preferMutedAutoplay: boolean = false) {
    if (!audioPlayer.value) return;
    if (isHiddenState()) return;
    if (!autoplayIntent.value) return;
    const el = audioPlayer.value;
    el.volume = volume.value;

    const orderedMutedStates = preferMutedAutoplay
      ? [true, false]
      : [false, true];

    for (const mutedState of orderedMutedStates) {
      const hasPlayed = await playWithMutedState(mutedState);
      if (!hasPlayed) continue;

      if (mutedState) {
        attachUnmuteOnGesture();
      }

      return;
    }

    attachResumeOnGesture();
    scheduleAutoplayRetry(preferMutedAutoplay);
  }

  /** 다음 트랙 재생 */
  function nextTrack() {
    if (!audioPlayer.value || PLAYLIST.length <= 1) return;
    currentIndex.value = (currentIndex.value + 1) % PLAYLIST.length;
    audioPlayer.value.src = currentSrc.value;
    audioPlayer.value.load();
    if (isPlaying.value && !isHiddenState()) {
      audioPlayer.value.play().catch(() => {});
    }
  }

  /** 재생/일시정지 토글 */
  function togglePlay() {
    if (!audioPlayer.value) return;
    if (!isPlaying.value && isHiddenState()) return;
    if (isPlaying.value) {
      audioPlayer.value.pause();
      isPlaying.value = false;
      persistAutoplayIntent(false);
      resetAutoplayRetryState();
      return;
    }

    audioPlayer.value
      .play()
      .then(() => {
        persistAutoplayIntent(true);
        isPlaying.value = true;
        isMuted.value = audioPlayer.value?.muted ?? false;
        resetAutoplayRetryState();
      })
      .catch(() => {
        attachResumeOnGesture();
      });
  }

  /** 백그라운드/화면 꺼짐 대응 - 브라우저 비가시 상태에서 오디오 정지 유지 */
  function pauseOnHiddenState() {
    if (!audioPlayer.value) return;
    audioPlayer.value.pause();
    isPlaying.value = false;
  }
  // #endregion

  // #region 라이프사이클
  onMounted(() => {
    restorePlaybackPreferences();
    currentIndex.value = Math.floor(Math.random() * PLAYLIST.length);
    const preferMutedAutoplay = resolvePreferMutedAutoplay();

    if (audioPlayer.value) {
      // 모바일 자동재생 정책 대응 - 초기 muted/defaultMuted 상태 선적용 후 재생 시도 사용
      if (preferMutedAutoplay && autoplayIntent.value) {
        audioPlayer.value.muted = true;
        audioPlayer.value.defaultMuted = true;
        audioPlayer.value.setAttribute("muted", "");
        isMuted.value = true;
      }

      audioPlayer.value.volume = volume.value;
      audioPlayer.value.preload = "auto";
      audioPlayer.value.load();
    }

    void tryAutoplay(preferMutedAutoplay);

    visibilityChangeHandler = () => {
      if (document.visibilityState === "hidden") {
        pauseOnHiddenState();
        return;
      }

      if (!isPlaying.value && autoplayIntent.value) {
        void tryAutoplay(preferMutedAutoplay);
      }
    };

    canPlayHandler = () => {
      if (!isPlaying.value && autoplayIntent.value) {
        void tryAutoplay(preferMutedAutoplay);
      }
    };

    pageShowHandler = () => {
      if (!isPlaying.value && autoplayIntent.value) {
        void tryAutoplay(preferMutedAutoplay);
      }
    };

    document.addEventListener("visibilitychange", visibilityChangeHandler);
    audioPlayer.value?.addEventListener("canplay", canPlayHandler);
    window.addEventListener("pageshow", pageShowHandler);
  });

  onUnmounted(() => {
    if (resumeOnUserGesture) {
      removeUserGestureListeners(resumeOnUserGesture);
    }

    if (unmuteOnUserGesture) {
      removeUserGestureListeners(unmuteOnUserGesture);
    }

    if (visibilityChangeHandler) {
      document.removeEventListener("visibilitychange", visibilityChangeHandler);
    }

    if (canPlayHandler && audioPlayer.value) {
      audioPlayer.value.removeEventListener("canplay", canPlayHandler);
    }

    if (pageShowHandler) {
      window.removeEventListener("pageshow", pageShowHandler);
    }

    clearAutoplayRetryTimer();
  });
  // #endregion

  return {
    audioPlayer,
    isPlaying,
    isMuted,
    volume,
    currentSrc,
    togglePlay,
    toggleMute,
    setVolume,
    nextTrack,
  };
}
