<template>
  <canvas ref="canvas" :class="flowerPetalStyles.canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import {
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  Texture,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { useEmotionStyles } from "~/composables/useEmotionStyles";

interface PetalUserData {
  speed: number;
  rotationSpeedX: number;
  rotationSpeedY: number;
  sway: number;
}

type PetalMesh = Mesh<PlaneGeometry, MeshBasicMaterial>;

const canvas = ref<HTMLCanvasElement | null>(null);
const { flowerPetalStyles } = useEmotionStyles();

let renderer: WebGLRenderer | null = null;
let scene: Scene | null = null;
let camera: OrthographicCamera | null = null;
let petals: PetalMesh[] = [];
let animationFrameId: number | null = null;
let sharedGeometry: PlaneGeometry | null = null;
let sharedMaterial: MeshBasicMaterial | null = null;
let sharedTexture: Texture | null = null;
let currentAspect = 1;

// SSR 안전성: 브라우저 전역(window/navigator)은 클라이언트에서만 접근
const isClient = typeof window !== "undefined";
const isMobile = isClient
  ? window.matchMedia("(max-width: 767px)").matches
  : false;
const deviceMemory =
  isClient
    ? ((window.navigator as Navigator & { deviceMemory?: number })
        .deviceMemory ?? 4)
    : 4;
const prefersReducedMotion =
  isClient &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const BASE_PETAL_COUNT = isMobile ? 90 : 140;
const PETAL_COUNT = prefersReducedMotion
  ? isMobile
    ? 20
    : 36
  : Math.max(
      36,
      Math.round(BASE_PETAL_COUNT * Math.min(1, deviceMemory / (isMobile ? 6 : 4)))
    );
const FRUSTUM_HEIGHT = isMobile ? 4.4 : 5;

let isPaused = false;
let visibilityHandler: (() => void) | null = null;

/**
 * 꽃잎을 생성하고 장면에 추가합니다.
 * 이제 네모가 아닌, SVG 이미지를 텍스처로 사용합니다.
 */
const createPetals = () => {
  if (!scene) return;

  const textureLoader = new TextureLoader();
  sharedTexture = textureLoader.load("/textures/petal.svg");

  sharedGeometry = new PlaneGeometry(0.2, 0.2);
  sharedMaterial = new MeshBasicMaterial({
    map: sharedTexture,
    side: DoubleSide,
    transparent: true,
    alphaTest: 0.1,
  });

  const spawnWidth = FRUSTUM_HEIGHT * currentAspect;

  for (let i = 0; i < PETAL_COUNT; i++) {
    const material = sharedMaterial.clone();
    material.opacity = Math.random() * 0.5 + 0.4;

    const petal = new Mesh(sharedGeometry, material);

    petal.position.set(
      (Math.random() - 0.5) * spawnWidth,
      Math.random() * FRUSTUM_HEIGHT - FRUSTUM_HEIGHT / 2,
      0
    );

    const scale = Math.random() * 0.5 + 0.5;
    petal.scale.set(scale, scale, scale);

    const userData = petal.userData as PetalUserData;
    userData.speed = prefersReducedMotion
      ? Math.random() * 0.002 + 0.001
      : Math.random() * (isMobile ? 0.0045 : 0.006) + 0.002;
    userData.rotationSpeedX = (Math.random() - 0.5) * 0.015;
    userData.rotationSpeedY = (Math.random() - 0.5) * 0.015;
    userData.sway = Math.random() * Math.PI;

    petals.push(petal);
    scene.add(petal);
  }
};

/**
 * 애니메이션 루프입니다. 매 프레임마다 꽃잎의 위치와 회전을 업데이트합니다.
 */
const animate = () => {
  if (!renderer || !scene || !camera) return;

  if (!isPaused) {
    petals.forEach((petal) => {
      const userData = petal.userData as PetalUserData;

      petal.position.y -= userData.speed;

      userData.sway += userData.speed * 0.4;
      petal.position.x += Math.sin(userData.sway) * 0.002;

      petal.rotation.x += userData.rotationSpeedX;
      petal.rotation.y += userData.rotationSpeedY;

      if (petal.position.y < -FRUSTUM_HEIGHT / 2 - 0.1) {
        petal.position.y = FRUSTUM_HEIGHT / 2 + 0.1;
        petal.position.x = (Math.random() - 0.5) * FRUSTUM_HEIGHT * currentAspect;
      }
    });

    renderer.render(scene, camera);
  }

  animationFrameId = requestAnimationFrame(animate);
};

/**
 * 창 크기 변경 시 렌더러와 카메라를 업데이트합니다.
 */
const handleResize = () => {
  if (!renderer || !camera) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  currentAspect = width / height;

  renderer.setSize(width, height, false);

  camera.left = (-FRUSTUM_HEIGHT * currentAspect) / 2;
  camera.right = (FRUSTUM_HEIGHT * currentAspect) / 2;
  camera.top = FRUSTUM_HEIGHT / 2;
  camera.bottom = -FRUSTUM_HEIGHT / 2;
  camera.updateProjectionMatrix();
};

onMounted(() => {
  if (!canvas.value) return;

  // Scene
  scene = new Scene();

  // Camera
  currentAspect = window.innerWidth / window.innerHeight;
  camera = new OrthographicCamera(
    (-FRUSTUM_HEIGHT * currentAspect) / 2,
    (FRUSTUM_HEIGHT * currentAspect) / 2,
    FRUSTUM_HEIGHT / 2,
    -FRUSTUM_HEIGHT / 2,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Renderer
  renderer = new WebGLRenderer({
    canvas: canvas.value,
    antialias: !isMobile,
    alpha: true,
    powerPreference: isMobile ? "low-power" : "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  handleResize();

  // Create Petals
  createPetals();

  // Animation
  animate();

  // Event Listener
  window.addEventListener("resize", handleResize);
  visibilityHandler = () => {
    isPaused = document.visibilityState === "hidden";
  };
  document.addEventListener("visibilitychange", visibilityHandler);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (visibilityHandler)
    document.removeEventListener("visibilitychange", visibilityHandler);
  if (animationFrameId != null) cancelAnimationFrame(animationFrameId);

  if (scene) {
    petals.forEach((petal) => {
      petal.material.dispose();
      scene?.remove(petal);
    });
  }
  sharedGeometry?.dispose();
  sharedMaterial?.dispose();
  sharedTexture?.dispose();
  sharedGeometry = null;
  sharedMaterial = null;
  sharedTexture = null;
  renderer?.dispose();
  renderer = null;
  scene = null;
  camera = null;
  petals = [];
  animationFrameId = null;
});
</script>
