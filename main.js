import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { createSimpleNonOverlappingRoads } from './road.js';
import { createForest } from './tree.js';
import { createBuildings } from './building.js';
import { createTrafficLightsNearCrosswalks } from './trafficlight.js';



// ===== Renderer =====
const canvas = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// ===== Scene =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcfe9ff);

// ===== Camera & Controls =====
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 800);
camera.position.set(200, 150, 200);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ===== Light =====
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(100, 200, 100);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
scene.add(sun);

// ===== Ground =====
const groundGeo = new THREE.PlaneGeometry(400, 400);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x5dbb63 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);



// 도로
const roads = createSimpleNonOverlappingRoads(400);
scene.add(roads);

// 신호등 + 횡단보도
const traffic = createTrafficLightsNearCrosswalks(roads.children);
scene.add(traffic);


// ===== Road Zones (for tree & building placement) =====
const roadZones = [];
roads.children.forEach(r => {
  if (!r.geometry) return;
  const isVertical = Math.abs(r.rotation.z - Math.PI / 2) < 0.1;
  roadZones.push({
    pos: { x: r.position.x, z: r.position.z },
    dir: isVertical ? 'vertical' : 'horizontal',
    halfWidth: 10
  });
});

// ===== Forest =====
const forest = createForest(70, 160, roadZones);
scene.add(forest);

// ===== Buildings =====
const buildings = createBuildings(400, roadZones);
scene.add(buildings);



// ===== Animate =====
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// ===== Resize =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
