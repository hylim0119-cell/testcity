import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const ROAD_WIDTH = 10;
const MIN_SPACING = 50;
const AREA = 400;
const HALF = AREA / 2;
const MARGIN = 40;

function createRoad(length, width, rotation, position) {
  const geo = new THREE.PlaneGeometry(length, width);
  const mat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.85 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = rotation;
  mesh.position.set(position.x, 0.02, position.z);
  mesh.receiveShadow = true;
  mesh.name = 'Road';
  return mesh;
}

function randomPositions(count, axis = 'z') {
  const picks = [];
  let guard = 0;
  while (picks.length < count && guard++ < 5000) {
    const v = Math.floor(Math.random() * (AREA - 2 * MARGIN)) - (HALF - MARGIN);
    if (picks.every(p => Math.abs(p - v) >= MIN_SPACING)) picks.push(v);
  }
  return picks.sort((a, b) => a - b);
}

export function createSimpleNonOverlappingRoads(areaSize = AREA) {
  const group = new THREE.Group();
  group.name = 'RoadNetwork';

  const total = Math.floor(Math.random() * 3) + 15;
  const horizCount = Math.max(1, Math.floor(total / 2));
  const vertCount = Math.max(1, total - horizCount);

  const zList = randomPositions(horizCount, 'z');
  const xList = randomPositions(vertCount, 'x');

  // 가로 도로
  zList.forEach(z => {
    const len = Math.random() * 120 + 260;
    const r = createRoad(len, ROAD_WIDTH, 0, { x: 0, z });
    group.add(r);
  });

  // 세로 도로
  xList.forEach(x => {
    const len = Math.random() * 120 + 260;
    const r = createRoad(len, ROAD_WIDTH, Math.PI / 2, { x, z: 0 });
    group.add(r);
  });

  return group;
}
