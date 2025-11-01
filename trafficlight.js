// trafficlight.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const ROAD_WIDTH = 10;

/** 신호등 생성 */
function createTrafficLight(x, z, rotation = 0) {
  const group = new THREE.Group();
  group.name = 'TrafficLight';

  // 기둥
  const poleGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 8);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.set(0, 3, 0);
  group.add(pole);

  // 본체
  const boxGeo = new THREE.BoxGeometry(1, 1.8, 0.8);
  const boxMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const box = new THREE.Mesh(boxGeo, boxMat);
  box.position.set(0, 5.2, 0.3);
  group.add(box);

  // 빨-노-초 불빛
  const colors = [0xff0000, 0xffff00, 0x00ff00];
  colors.forEach((c, i) => {
    const bulbGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: c,
      emissive: c,
      emissiveIntensity: 0.9,
    });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0, 5.5 - i * 0.45, 0.7);
    group.add(bulb);
  });

  group.position.set(x, 0, z);
  group.rotation.y = rotation;
  return group;
}

/** 신호등 + 횡단보도 세트 */
export function createTrafficLightsNearCrosswalks(roads) {
  const group = new THREE.Group();
  group.name = 'TrafficLightsAndCrosswalks';

  const crosswalkMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  roads.forEach((road) => {
    const rot = road.rotation.z;
    const along = { x: Math.cos(rot), z: Math.sin(rot) }; // 도로 진행 방향
    const across = { x: Math.sin(rot), z: -Math.cos(rot) }; // 폭 방향

    // 도로 중앙 기준 랜덤 위치
    const halfLen = (road.geometry.parameters.width ?? 200) / 2;
    const offset = (Math.random() * 2 - 1) * (halfLen - 40);
    const cx = road.position.x + along.x * offset;
    const cz = road.position.z + along.z * offset;

    // 🚦 신호등 도로 옆으로
    const lightOffset = 6;
    const lx = cx + across.x * lightOffset;
    const lz = cz + across.z * lightOffset;
    const lightRot = rot + Math.PI / 2;
    const light = createTrafficLight(lx, lz, lightRot);
    group.add(light);

    // 🛑 횡단보도 — 5줄, 폭 2, 간격 1.6
    const stripeCount = 5;
    const stripeGap = 1.6;
    const stripeThickness = 1;
    const stripeLen = 2;

    // 🎯 핵심: 각 줄을 "도로 폭 방향"으로 이동시켜야 함
    for (let i = 0; i < stripeCount; i++) {
      const geo = new THREE.PlaneGeometry(stripeLen, stripeThickness);
      const stripe = new THREE.Mesh(geo, crosswalkMat);
      stripe.rotation.x = -Math.PI / 2;

      // 각 줄을 "도로 폭 방향(across)"으로 배치
      const offsetAcross = (i - (stripeCount - 1) / 2) * stripeGap;
      const sx = cx + across.x * offsetAcross;
      const sz = cz + across.z * offsetAcross;

      stripe.position.set(sx, 0.22, sz);
      stripe.rotation.z = rot;
      group.add(stripe);
    }
  });

  return group;
}
