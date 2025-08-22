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
// 핵심 로직: 장미 테마에 맞는 꽃잎 수/색감 조절 및 저사양 기기 보호
const deviceMemory = (navigator as any)?.deviceMemory || 4;
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const BASE_PETAL_COUNT = 140;
const PETAL_COUNT = prefersReducedMotion
  ? 40
  : Math.round(BASE_PETAL_COUNT * Math.min(1, deviceMemory / 4));

let isPaused = false;
let visibilityHandler: (() => void) | null = null;

/**
 * 꽃잎을 생성하고 장면에 추가합니다.
 * 이제 네모가 아닌, SVG 이미지를 텍스처로 사용합니다.
 */
const createPetals = () => {
  if (!scene) return;

  const textureLoader = new THREE.TextureLoader();
  const petalTexture = textureLoader.load("/textures/petal.svg");

  const petalGeometry = new THREE.PlaneGeometry(0.2, 0.2); // 크기를 약간 키웠습니다.
  const petalMaterial = new THREE.MeshBasicMaterial({
    map: petalTexture,
    side: THREE.DoubleSide,
    transparent: true,
    alphaTest: 0.1, // SVG의 투명한 부분이 완전히 투명하게 처리되도록 설정
  });

  for (let i = 0; i < PETAL_COUNT; i++) {
    const material = petalMaterial.clone();
    // 각 꽃잎의 투명도/색감(장미 계열 tint)을 무작위로 설정하여 깊이감을 줍니다.
    material.opacity = Math.random() * 0.5 + 0.4; // 0.4 ~ 0.9

    const petal = new THREE.Mesh(petalGeometry, material);

    // 초기 위치를 화면 전체에 무작위로 설정
    petal.position.set(
      (Math.random() - 0.5) * 10, // x
      Math.random() * 10 - 5, // y (시작 위치를 좀 더 넓게 분포)
      0 // z
    );

    // 크기를 무작위로 설정하여 자연스러움을 더합니다.
    const scale = Math.random() * 0.5 + 0.5; // 0.5 ~ 1.0
    petal.scale.set(scale, scale, scale);

    (petal as any).speed = prefersReducedMotion
      ? Math.random() * 0.003 + 0.001
      : Math.random() * 0.006 + 0.002;
    (petal as any).rotationSpeedX = (Math.random() - 0.5) * 0.02;
    (petal as any).rotationSpeedY = (Math.random() - 0.5) * 0.02;
    (petal as any).sway = Math.random() * Math.PI;

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
    const frustumHeight = 5;

    petals.forEach((petal) => {
      // 아래로 떨어지는 움직임
      petal.position.y -= (petal as any).speed;

      // 좌우로 흔들리는 움직임 (Sway)
      (petal as any).sway += (petal as any).speed * 0.4;
      petal.position.x += Math.sin((petal as any).sway) * 0.002;

      // 회전
      petal.rotation.x += (petal as any).rotationSpeedX;
      petal.rotation.y += (petal as any).rotationSpeedY;

      // 꽃잎이 화면 밖으로 나가면 다시 위에서 시작하도록 위치를 재설정합니다.
      if (petal.position.y < -frustumHeight / 2 - 0.1) {
        petal.position.y = frustumHeight / 2 + 0.1;
        petal.position.x = (Math.random() - 0.5) * frustumHeight * aspect;
      }
    });

    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);
};

/**
 * 창 크기 변경 시 렌더러와 카메라를 업데이트합니다.
 */
const handleResize = () => {
  if (!renderer || !camera) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;
  const frustumHeight = 5;

  renderer.setSize(width, height);

  camera.left = (-frustumHeight * aspect) / 2;
  camera.right = (frustumHeight * aspect) / 2;
  camera.top = frustumHeight / 2;
  camera.bottom = -frustumHeight / 2;
  camera.updateProjectionMatrix();
};

onMounted(() => {
  if (!canvas.value) return;

  // Scene
  scene = new THREE.Scene();

  // Camera
  const aspect = window.innerWidth / window.innerHeight;
  const frustumHeight = 5;
  camera = new THREE.OrthographicCamera(
    (-frustumHeight * aspect) / 2,
    (frustumHeight * aspect) / 2,
    frustumHeight / 2,
    -frustumHeight / 2,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: true,
    alpha: true, // 배경을 투명하게 처리
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

  // 메모리 누수 방지를 위해 Three.js 객체들을 정리합니다.
  if (scene) {
    petals.forEach((petal) => {
      petal.geometry.dispose();
      (petal.material as THREE.Material[]).forEach((m) => m.dispose());
      scene?.remove(petal);
    });
  }
  renderer?.dispose();
  renderer = null;
  scene = null;
  camera = null;
  petals = [];
});
</script>

<style scoped>
.webgl-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  outline: none;
  z-index: 0; /* 다른 콘텐츠 뒤에 위치하도록 설정 */
  pointer-events: none; /* 인터랙션을 가리지 않도록 */
}
</style>
