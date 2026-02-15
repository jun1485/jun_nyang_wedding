import { computed, onMounted, onUnmounted, ref } from "vue";

// #region 타입 정의
interface MusicPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentIndex: number;
}
// #endregion

// #region 상수
const INITIAL_VOLUME = 0.1;
const PLAYLIST = [
  "/audio/bensound-the-light-between-us.mp3",
  "/audio/bensound-love.mp3",
];
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
  const currentSrc = computed(() => PLAYLIST[currentIndex.value]);

  let resumeOnUserGesture: (() => void) | null = null;
  let visibilityChangeHandler: (() => void) | null = null;
  let pageHideHandler: (() => void) | null = null;
  // #endregion

  // #region 볼륨 제어
  /** 볼륨 변경 - audio 요소와 상태 동기화 */
  function setVolume(newVolume: number) {
    volume.value = Math.max(0, Math.min(1, newVolume));
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
    try {
      audioPlayer.value.muted = false;
      audioPlayer.value.volume = volume.value;
      await audioPlayer.value.play();
      isPlaying.value = true;
      isMuted.value = false;
    } catch {
      // 사용자 제스처 환경에서만 재시도
    }
  }

  /** 자동재생 시도 - 정책 차단 시 muted 재생 → 제스처 대기 순서로 fallback */
  async function tryAutoplay() {
    if (!audioPlayer.value) return;
    const el = audioPlayer.value;
    el.volume = volume.value;

    try {
      await el.play();
      isPlaying.value = true;
      isMuted.value = el.muted;
      return;
    } catch {
      // 정책 차단 시 muted 재생 시도
    }

    try {
      el.muted = true;
      await el.play();
      isPlaying.value = true;
      isMuted.value = true;
      const unmute = () => {
        if (!audioPlayer.value) return;
        audioPlayer.value.muted = false;
        audioPlayer.value.volume = volume.value;
        isMuted.value = false;
        window.removeEventListener("pointerdown", unmute);
        window.removeEventListener("keydown", unmute);
      };
      window.addEventListener("pointerdown", unmute, { once: true });
      window.addEventListener("keydown", unmute, { once: true });
      return;
    } catch {
      // 완전 차단 시 첫 제스처에서 재시작
    }

    resumeOnUserGesture = () => resumePlayback();
    window.addEventListener("pointerdown", resumeOnUserGesture, { once: true });
    window.addEventListener("keydown", resumeOnUserGesture, { once: true });
  }

  /** 다음 트랙 재생 */
  function nextTrack() {
    if (!audioPlayer.value || PLAYLIST.length <= 1) return;
    currentIndex.value = (currentIndex.value + 1) % PLAYLIST.length;
    audioPlayer.value.src = currentSrc.value;
    audioPlayer.value.load();
    if (isPlaying.value) {
      audioPlayer.value.play().catch(() => {});
    }
  }

  /** 재생/일시정지 토글 */
  function togglePlay() {
    if (!audioPlayer.value) return;
    if (isPlaying.value) {
      audioPlayer.value.pause();
      isPlaying.value = false;
      return;
    }

    audioPlayer.value
      .play()
      .then(() => {
        isPlaying.value = true;
        isMuted.value = audioPlayer.value?.muted ?? false;
      })
      .catch(() => {
        if (!resumeOnUserGesture) {
          resumeOnUserGesture = () => resumePlayback();
          window.addEventListener("pointerdown", resumeOnUserGesture, {
            once: true,
          });
          window.addEventListener("keydown", resumeOnUserGesture, {
            once: true,
          });
        }
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
    currentIndex.value = Math.floor(Math.random() * PLAYLIST.length);
    if (audioPlayer.value) audioPlayer.value.load();
    tryAutoplay();

    visibilityChangeHandler = () => {
      if (document.visibilityState === "hidden") {
        pauseOnHiddenState();
      }
    };
    pageHideHandler = () => {
      pauseOnHiddenState();
    };

    document.addEventListener("visibilitychange", visibilityChangeHandler);
    window.addEventListener("pagehide", pageHideHandler);
  });

  onUnmounted(() => {
    if (resumeOnUserGesture) {
      window.removeEventListener("pointerdown", resumeOnUserGesture);
      window.removeEventListener("keydown", resumeOnUserGesture);
    }

    if (visibilityChangeHandler) {
      document.removeEventListener("visibilitychange", visibilityChangeHandler);
    }

    if (pageHideHandler) {
      window.removeEventListener("pagehide", pageHideHandler);
    }
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
