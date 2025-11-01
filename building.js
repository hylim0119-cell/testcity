// building.js — 도시 밀도 버전 (건물 200~300개)
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const COLORS = [0x8e9aaf, 0xb8c0ff, 0xe7c6ff, 0xdee2ff, 0xadb5bd, 0xced4da, 0xd4a373, 0xb5838d];
function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createBuilding(x, z, w, d, h) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({
    color: randomColor(),
    roughness: 0.9,
    metalness: 0.1
  });
  const building = new THREE.Mesh(geo, mat);
  building.position.set(x, h / 2, z);
  building.castShadow = true;
  building.receiveShadow = true;
  return building;
}

export function createBuildings(areaSize = 400, roadZones = []) {
  const group = new THREE.Group();
  group.name = "Buildings";

  const half = areaSize / 2;
  const margin = 10;
  const count = Math.floor(Math.random() * 100) + 200; // ✅ 200~300개
  const minDistFromRoad = 15;

  for (let i = 0; i < count; i++) {
    const w = Math.random() * 10 + 10;
    const d = Math.random() * 10 + 10;
    const h = Math.random() * 60 + 30;
    const x = (Math.random() - 0.5) * (areaSize - w - margin);
    const z = (Math.random() - 0.5) * (areaSize - d - margin);

    const nearRoad = roadZones.some(r => {
      const dx = Math.abs(x - r.pos.x);
      const dz = Math.abs(z - r.pos.z);
      if (r.dir === "vertical") return dx < r.halfWidth + minDistFromRoad;
      else return dz < r.halfWidth + minDistFromRoad;
    });
    if (nearRoad) continue;

    const building = createBuilding(x, z, w, d, h);
    group.add(building);
  }

  return group;
}
