// Owned by the scene task. Renders a full-viewport Three.js scene into the
// given canvas, handles resize, and returns { dispose }.
//
// What it draws: a dark field of slowly drifting low-poly shards (one
// InstancedMesh) with a sparse star-like particle layer behind them, lit by a
// soft hemisphere light and two coloured point lights. The camera leans
// slightly toward the mouse for parallax on pointer devices only. If the user
// prefers reduced motion, a single static frame is rendered instead.

import * as THREE from 'three';

const SHARD_COUNT = 160;
const PARTICLE_COUNT = 2500;
const FIELD = { x: 28, y: 18, z: 20 }; // half-extents of the shard volume
const MAX_PIXEL_RATIO = 2;

export function createHeroScene(canvas) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(pointer: coarse)');

  // ---------------------------------------------------------------- renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
  renderer.setClearColor(0x07080c, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x07080c, 18, 46);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 22);
  const cameraTarget = new THREE.Vector3(0, 0, 0);

  // ---------------------------------------------------------------- lighting
  const hemi = new THREE.HemisphereLight(0x8fa6ff, 0x1a0f2e, 0.9);
  const keyLight = new THREE.PointLight(0x7c9cff, 60, 60, 1.6);
  keyLight.position.set(12, 10, 14);
  const fillLight = new THREE.PointLight(0xff7eb6, 35, 60, 1.6);
  fillLight.position.set(-14, -8, 10);
  scene.add(hemi, keyLight, fillLight);

  // ------------------------------------------------------------------ shards
  const shardGeometry = new THREE.IcosahedronGeometry(1, 0);
  const shardMaterial = new THREE.MeshStandardMaterial({
    color: 0x9aa7c7,
    roughness: 0.55,
    metalness: 0.25,
    flatShading: true,
    transparent: true,
    opacity: 0.85,
  });
  const shards = new THREE.InstancedMesh(shardGeometry, shardMaterial, SHARD_COUNT);
  shards.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  // Per-instance state used to animate without re-randomising every frame.
  const shardState = new Array(SHARD_COUNT);
  const dummy = new THREE.Object3D();
  const rand = (lo, hi) => lo + Math.random() * (hi - lo);
  for (let i = 0; i < SHARD_COUNT; i++) {
    const state = {
      base: new THREE.Vector3(
        rand(-FIELD.x, FIELD.x),
        rand(-FIELD.y, FIELD.y),
        rand(-FIELD.z, FIELD.z) - 6,
      ),
      scale: rand(0.18, 0.75),
      rotation: new THREE.Euler(rand(0, Math.PI * 2), rand(0, Math.PI * 2), 0),
      spin: new THREE.Vector2(rand(-0.25, 0.25), rand(-0.25, 0.25)),
      bobAmp: rand(0.3, 1.1),
      bobSpeed: rand(0.15, 0.45),
      bobPhase: rand(0, Math.PI * 2),
    };
    shardState[i] = state;
    writeShard(i, state, 0);
  }
  shards.instanceMatrix.needsUpdate = true;
  scene.add(shards);

  function writeShard(i, s, t) {
    dummy.position.set(
      s.base.x,
      s.base.y + Math.sin(t * s.bobSpeed + s.bobPhase) * s.bobAmp,
      s.base.z,
    );
    dummy.rotation.set(s.rotation.x + t * s.spin.x, s.rotation.y + t * s.spin.y, 0);
    dummy.scale.setScalar(s.scale);
    dummy.updateMatrix();
    shards.setMatrixAt(i, dummy.matrix);
  }

  // --------------------------------------------------------------- particles
  const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particlePositions[i * 3 + 0] = rand(-50, 50);
    particlePositions[i * 3 + 1] = rand(-30, 30);
    particlePositions[i * 3 + 2] = rand(-40, 5);
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xb9c4e6,
    size: 0.07,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // ---------------------------------------------------------------- resize
  function resize() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (reducedMotion.matches) renderStatic();
  }

  // --------------------------------------------------------------- parallax
  const pointer = new THREE.Vector2(0, 0); // normalised -1..1
  function onPointerMove(event) {
    if (coarsePointer.matches || event.pointerType === 'touch') return;
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
  }
  function onPointerLeave() {
    pointer.set(0, 0);
  }

  // ------------------------------------------------------------- animation
  const timer = new THREE.Timer();
  timer.connect(document); // pauses elapsed time while the tab is hidden
  let frameId = 0;

  function frame(timestamp) {
    frameId = requestAnimationFrame(frame);
    timer.update(timestamp);
    const t = timer.getElapsed();

    for (let i = 0; i < SHARD_COUNT; i++) writeShard(i, shardState[i], t);
    shards.instanceMatrix.needsUpdate = true;

    shards.rotation.y = t * 0.02;
    particles.rotation.y = t * 0.01;
    particles.rotation.x = Math.sin(t * 0.05) * 0.05;

    keyLight.position.x = Math.cos(t * 0.1) * 14;
    keyLight.position.z = 14 + Math.sin(t * 0.1) * 4;

    // Ease the camera toward the pointer-driven offset.
    const targetX = pointer.x * 1.4;
    const targetY = pointer.y * 0.9;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(cameraTarget);

    renderer.render(scene, camera);
  }

  function renderStatic() {
    for (let i = 0; i < SHARD_COUNT; i++) writeShard(i, shardState[i], 0);
    shards.instanceMatrix.needsUpdate = true;
    camera.position.set(0, 0, 22);
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
  }

  function start() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    if (reducedMotion.matches) {
      renderStatic();
    } else {
      frame();
    }
  }

  function onMotionPreferenceChange() {
    start();
  }

  // --------------------------------------------------------------- wiring
  window.addEventListener('resize', resize);
  if (!coarsePointer.matches) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
  }
  reducedMotion.addEventListener('change', onMotionPreferenceChange);

  resize();
  start();

  // --------------------------------------------------------------- dispose
  let disposed = false;
  function dispose() {
    if (disposed) return;
    disposed = true;

    cancelAnimationFrame(frameId);
    frameId = 0;

    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerleave', onPointerLeave);
    reducedMotion.removeEventListener('change', onMotionPreferenceChange);
    timer.dispose();

    scene.remove(shards, particles, hemi, keyLight, fillLight);
    shards.dispose();
    shardGeometry.dispose();
    shardMaterial.dispose();
    particleGeometry.dispose();
    particleMaterial.dispose();
    keyLight.dispose();
    fillLight.dispose();
    hemi.dispose();
    renderer.dispose();
  }

  return { dispose };
}
