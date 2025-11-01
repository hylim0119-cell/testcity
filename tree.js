// tree.js — 나무 크기 + 밀도 조정
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

function createTree(x, z) {
  const group = new THREE.Group();

  // 🌳 줄기 (조금 더 두껍게)
  const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 3.5, 12);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8d5524 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.set(x, 1.75, z);
  trunk.castShadow = true;
  group.add(trunk);

  // 🍃 잎 부분 (기존보다 1.8배 큼)
  const leavesGeo = new THREE.SphereGeometry(2.5, 24, 18);
  const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });
  const leaves = new THREE.Mesh(leavesGeo, leavesMat);
  leaves.position.set(x, 4, z);
  leaves.castShadow = true;
  group.add(leaves);

  return group;
}

export function createForest(count = 70, spread = 160, roadZones = []) {
  const group = new THREE.Group();
  group.name = "Forest";

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * spread * 2;
    const z = (Math.random() - 0.5) * spread * 2;

    // 도로 근처 피하기
    const nearRoad = roadZones.some(r => {
      const dx = Math.abs(x - r.pos.x);
      const dz = Math.abs(z - r.pos.z);
      if (r.dir === "vertical") return dx < r.halfWidth + 10;
      else return dz < r.halfWidth + 10;
    });
    if (nearRoad) continue;

    const tree = createTree(x, z);
    group.add(tree);
  }

  return group;
}
