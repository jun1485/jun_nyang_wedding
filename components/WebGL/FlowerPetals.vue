<template>
  <canvas ref="canvas" class="webgl-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";

const canvas = ref<HTMLCanvasElement | null>(null);

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.OrthographicCamera | null = null;
let petals: THREE.Mesh[] = [];
let animationFrameId: number | null = null;
let sharedGeometry: THREE.PlaneGeometry | null = null;
let sharedMaterial: THREE.MeshBasicMaterial | null = null;
let sharedTexture: THREE.Texture | null = null;

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

  const textureLoader = new THREE.TextureLoader();
  sharedTexture = textureLoader.load("/textures/petal.svg");

  sharedGeometry = new THREE.PlaneGeometry(0.2, 0.2);
  sharedMaterial = new THREE.MeshBasicMaterial({
    map: sharedTexture,
    side: THREE.DoubleSide,
    transparent: true,
    alphaTest: 0.1,
  });

  for (let i = 0; i < PETAL_COUNT; i++) {
    const material = sharedMaterial.clone();
    material.opacity = Math.random() * 0.5 + 0.4;

    const petal = new THREE.Mesh(sharedGeometry, material);

    petal.position.set(
      (Math.random() - 0.5) * 10,
      Math.random() * FRUSTUM_HEIGHT - FRUSTUM_HEIGHT / 2,
      0
    );

    const scale = Math.random() * 0.5 + 0.5;
    petal.scale.set(scale, scale, scale);

    petal.userData.speed = prefersReducedMotion
      ? Math.random() * 0.002 + 0.001
      : Math.random() * (isMobile ? 0.0045 : 0.006) + 0.002;
    petal.userData.rotationSpeedX = (Math.random() - 0.5) * 0.015;
    petal.userData.rotationSpeedY = (Math.random() - 0.5) * 0.015;
    petal.userData.sway = Math.random() * Math.PI;

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
    const aspect = window.innerWidth / window.innerHeight;

    petals.forEach((petal) => {
      const speed = Number(petal.userData.speed ?? 0.003);
      const sway = Number(petal.userData.sway ?? 0);
      const rotationSpeedX = Number(petal.userData.rotationSpeedX ?? 0);
      const rotationSpeedY = Number(petal.userData.rotationSpeedY ?? 0);

      petal.position.y -= speed;

      petal.userData.sway = sway + speed * 0.4;
      petal.position.x += Math.sin(Number(petal.userData.sway)) * 0.002;

      petal.rotation.x += rotationSpeedX;
      petal.rotation.y += rotationSpeedY;

      if (petal.position.y < -FRUSTUM_HEIGHT / 2 - 0.1) {
        petal.position.y = FRUSTUM_HEIGHT / 2 + 0.1;
        petal.position.x = (Math.random() - 0.5) * FRUSTUM_HEIGHT * aspect;
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
  const aspect = width / height;

  renderer.setSize(width, height, false);

  camera.left = (-FRUSTUM_HEIGHT * aspect) / 2;
  camera.right = (FRUSTUM_HEIGHT * aspect) / 2;
  camera.top = FRUSTUM_HEIGHT / 2;
  camera.bottom = -FRUSTUM_HEIGHT / 2;
  camera.updateProjectionMatrix();
};

onMounted(() => {
  if (!canvas.value) return;

  // Scene
  scene = new THREE.Scene();

  // Camera
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(
    (-FRUSTUM_HEIGHT * aspect) / 2,
    (FRUSTUM_HEIGHT * aspect) / 2,
    FRUSTUM_HEIGHT / 2,
    -FRUSTUM_HEIGHT / 2,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Renderer
  renderer = new THREE.WebGLRenderer({
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
      if (Array.isArray(petal.material)) {
        petal.material.forEach((m) => m.dispose());
      } else {
        petal.material.dispose();
      }
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

<style scoped>
.webgl-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  outline: none;
  z-index: 0;
  pointer-events: none;
}
</style>
