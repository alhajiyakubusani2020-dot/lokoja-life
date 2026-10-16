import * as THREE from 'three';
import { createLokojaBusLiveryTexture } from '../world/textures';

export interface VehicleInstance {
  group: THREE.Group;
  type: 'bus' | 'keke';
  frontWheels: THREE.Group[];
  allWheels: THREE.Group[];
  chassis: THREE.Group;
  headlights: THREE.SpotLight[];
  headlightMeshes: THREE.Mesh[];
  exhaustPos: THREE.Vector3;
}

function createContactShadow(width: number, length: number): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const tex = new THREE.CanvasTexture(canvas);
  const geo = new THREE.PlaneGeometry(width, length);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    opacity: 0.8
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.03;
  return mesh;
}

function createWheel(radius: number, width: number, isChrome = false): THREE.Group {
  const wheelGroup = new THREE.Group();

  const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 18);
  tireGeo.rotateZ(Math.PI / 2);
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x1b1c1e,
    roughness: 0.85,
    metalness: 0.1
  });
  const tire = new THREE.Mesh(tireGeo, tireMat);
  tire.castShadow = true;
  wheelGroup.add(tire);

  const rimGeo = new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, width + 0.02, 16);
  rimGeo.rotateZ(Math.PI / 2);
  const rimMat = new THREE.MeshStandardMaterial({
    color: isChrome ? 0xd0d8e0 : 0x4a4e57,
    roughness: isChrome ? 0.2 : 0.45,
    metalness: isChrome ? 0.9 : 0.6
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  wheelGroup.add(rim);

  const hubGeo = new THREE.CylinderGeometry(radius * 0.28, radius * 0.28, width + 0.04, 12);
  hubGeo.rotateZ(Math.PI / 2);
  const hubMat = new THREE.MeshStandardMaterial({
    color: 0x008751, // Green hubcap for Lokoja
    roughness: 0.3,
    metalness: 0.7
  });
  const hub = new THREE.Mesh(hubGeo, hubMat);
  wheelGroup.add(hub);

  return wheelGroup;
}

/**
 * Creates the Lokoja Confluence City Express Bus (12+ procedural parts)
 */
export function createLokojaBus(isPlayer = false): VehicleInstance {
  const group = new THREE.Group();
  group.name = isPlayer ? 'PlayerLokojaBus' : 'AILokojaBus';

  const chassis = new THREE.Group();
  group.add(chassis);

  const busWhite = 0xf8fafc;
  const bodyMat = new THREE.MeshStandardMaterial({
    color: busWhite,
    roughness: 0.35,
    metalness: 0.35
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xd8dde4,
    roughness: 0.2,
    metalness: 0.9
  });

  const blackTrimMat = new THREE.MeshStandardMaterial({
    color: 0x18191b,
    roughness: 0.8,
    metalness: 0.1
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a2e3b,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.65,
    transparent: true,
    opacity: 0.75
  });

  // 1. Lower Van Body (White base)
  const lowerBodyGeo = new THREE.BoxGeometry(1.85, 0.95, 4.4);
  const lowerBody = new THREE.Mesh(lowerBodyGeo, bodyMat);
  lowerBody.position.y = 0.85;
  lowerBody.castShadow = true;
  lowerBody.receiveShadow = true;
  chassis.add(lowerBody);

  // 2. Lokoja Bus Livery Sides (Green & White with Nataco - Ganaja route banner)
  const liveryTex = createLokojaBusLiveryTexture();
  const liveryMat = new THREE.MeshStandardMaterial({
    map: liveryTex,
    roughness: 0.4,
    metalness: 0.2
  });

  const sideLiveryGeo = new THREE.PlaneGeometry(3.6, 0.7);
  // Left side
  const leftLivery = new THREE.Mesh(sideLiveryGeo, liveryMat);
  leftLivery.position.set(-0.935, 0.82, -0.1);
  leftLivery.rotation.y = -Math.PI / 2;
  chassis.add(leftLivery);

  // Right side
  const rightLivery = new THREE.Mesh(sideLiveryGeo, liveryMat);
  rightLivery.position.set(0.935, 0.82, -0.1);
  rightLivery.rotation.y = Math.PI / 2;
  chassis.add(rightLivery);

  // 3. Upper Passenger Cabin & Roof
  const cabinGeo = new THREE.BoxGeometry(1.78, 0.85, 3.8);
  const cabin = new THREE.Mesh(cabinGeo, bodyMat);
  cabin.position.set(0, 1.6, -0.2);
  cabin.castShadow = true;
  chassis.add(cabin);

  // 4. Windshield
  const windshieldGeo = new THREE.BoxGeometry(1.7, 0.7, 0.08);
  const windshield = new THREE.Mesh(windshieldGeo, glassMat);
  windshield.position.set(0, 1.58, 1.68);
  windshield.rotation.x = 0.22;
  chassis.add(windshield);

  // 5. Windows
  const sideWindowGeo = new THREE.BoxGeometry(0.06, 0.55, 3.2);
  const leftSideWin = new THREE.Mesh(sideWindowGeo, glassMat);
  leftSideWin.position.set(-0.9, 1.58, -0.25);
  chassis.add(leftSideWin);

  const rightSideWin = new THREE.Mesh(sideWindowGeo, glassMat);
  rightSideWin.position.set(0.9, 1.58, -0.25);
  chassis.add(rightSideWin);

  const rearWinGeo = new THREE.BoxGeometry(1.5, 0.55, 0.06);
  const rearWin = new THREE.Mesh(rearWinGeo, glassMat);
  rearWin.position.set(0, 1.58, -2.11);
  chassis.add(rearWin);

  // 6. Grille & Chrome Bumpers
  const grilleGeo = new THREE.BoxGeometry(1.5, 0.32, 0.1);
  const grille = new THREE.Mesh(grilleGeo, blackTrimMat);
  grille.position.set(0, 0.75, 2.22);
  chassis.add(grille);

  const bumperGeo = new THREE.BoxGeometry(1.95, 0.22, 0.25);
  const frontBumper = new THREE.Mesh(bumperGeo, chromeMat);
  frontBumper.position.set(0, 0.45, 2.25);
  frontBumper.castShadow = true;
  chassis.add(frontBumper);

  const rearBumper = new THREE.Mesh(bumperGeo, chromeMat);
  rearBumper.position.set(0, 0.45, -2.25);
  chassis.add(rearBumper);

  // 7. Roof Travel Rack with Interstate Luggage
  const rackFrameGeo = new THREE.BoxGeometry(1.5, 0.1, 2.4);
  const rackFrame = new THREE.Mesh(rackFrameGeo, blackTrimMat);
  rackFrame.position.set(0, 2.06, -0.3);
  chassis.add(rackFrame);

  const luggageColors = [0x008751, 0xd97706, 0x1d4ed8, 0xb91c1c];
  for (let i = 0; i < 3; i++) {
    const boxGeo = new THREE.BoxGeometry(0.55, 0.35, 0.65);
    const boxMat = new THREE.MeshStandardMaterial({
      color: luggageColors[i % luggageColors.length],
      roughness: 0.7
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.position.set((i - 1) * 0.45, 2.25, -0.3 + (i % 2) * 0.2);
    boxMesh.castShadow = true;
    chassis.add(boxMesh);
  }

  // 8. Headlights & Taillights
  const headlightMeshes: THREE.Mesh[] = [];
  const headlights: THREE.SpotLight[] = [];

  const lightGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 16);
  lightGeo.rotateX(Math.PI / 2);
  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xfff0c0,
    emissive: 0xffe680,
    emissiveIntensity: 0.9,
    roughness: 0.2
  });

  const leftLight = new THREE.Mesh(lightGeo, lightMat);
  leftLight.position.set(-0.68, 0.78, 2.24);
  chassis.add(leftLight);
  headlightMeshes.push(leftLight);

  const rightLight = new THREE.Mesh(lightGeo, lightMat);
  rightLight.position.set(0.68, 0.78, 2.24);
  chassis.add(rightLight);
  headlightMeshes.push(rightLight);

  const spotLeft = new THREE.SpotLight(0xfff5cc, 1.8, 35, Math.PI / 5, 0.4);
  spotLeft.position.set(-0.68, 0.8, 2.3);
  spotLeft.target.position.set(-0.68, 0, 15);
  chassis.add(spotLeft);
  chassis.add(spotLeft.target);
  headlights.push(spotLeft);

  const spotRight = new THREE.SpotLight(0xfff5cc, 1.8, 35, Math.PI / 5, 0.4);
  spotRight.position.set(0.68, 0.8, 2.3);
  spotRight.target.position.set(0.68, 0, 15);
  chassis.add(spotRight);
  chassis.add(spotRight.target);
  headlights.push(spotRight);

  // Taillights
  const tailGeo = new THREE.BoxGeometry(0.18, 0.12, 0.06);
  const tailMat = new THREE.MeshStandardMaterial({
    color: 0xcc0000,
    emissive: 0x990000,
    emissiveIntensity: 0.7
  });
  const leftTail = new THREE.Mesh(tailGeo, tailMat);
  leftTail.position.set(-0.75, 0.85, -2.22);
  chassis.add(leftTail);

  const rightTail = new THREE.Mesh(tailGeo, tailMat);
  rightTail.position.set(0.75, 0.85, -2.22);
  chassis.add(rightTail);

  // 9. Side Mirrors
  const mirrorGeo = new THREE.BoxGeometry(0.08, 0.22, 0.14);
  const leftMirror = new THREE.Mesh(mirrorGeo, blackTrimMat);
  leftMirror.position.set(-1.02, 1.35, 1.3);
  chassis.add(leftMirror);

  const rightMirror = new THREE.Mesh(mirrorGeo, blackTrimMat);
  rightMirror.position.set(1.02, 1.35, 1.3);
  chassis.add(rightMirror);

  // 10. Wheels Setup
  const frontWheels: THREE.Group[] = [];
  const allWheels: THREE.Group[] = [];
  const wheelRadius = 0.38;
  const wheelThickness = 0.28;

  const wheelCoords = [
    { x: -0.92, z: 1.3, isFront: true },
    { x: 0.92, z: 1.3, isFront: true },
    { x: -0.92, z: -1.3, isFront: false },
    { x: 0.92, z: -1.3, isFront: false }
  ];

  wheelCoords.forEach(pos => {
    const wheelAssembly = new THREE.Group();
    wheelAssembly.position.set(pos.x, wheelRadius, pos.z);

    const wheelMesh = createWheel(wheelRadius, wheelThickness, true);
    wheelAssembly.add(wheelMesh);

    group.add(wheelAssembly);
    allWheels.push(wheelMesh);
    if (pos.isFront) {
      frontWheels.push(wheelAssembly);
    }
  });

  // Soft Contact Shadow
  const shadow = createContactShadow(2.6, 5.0);
  group.add(shadow);

  const exhaustPos = new THREE.Vector3(-0.6, 0.35, -2.2);

  return {
    group,
    type: 'bus',
    frontWheels,
    allWheels,
    chassis,
    headlights,
    headlightMeshes,
    exhaustPos
  };
}

/**
 * Creates the Lokoja Keke Napep (3-Wheeled Auto-Rickshaw)
 */
export function createKekeNapep(isPlayer = false): VehicleInstance {
  const group = new THREE.Group();
  group.name = isPlayer ? 'PlayerKeke' : 'AIKeke';

  const chassis = new THREE.Group();
  group.add(chassis);

  const kekeYellow = 0xf59e0b;
  const bodyMat = new THREE.MeshStandardMaterial({
    color: kekeYellow,
    roughness: 0.4,
    metalness: 0.3
  });

  const canvasRoofMat = new THREE.MeshStandardMaterial({
    color: 0x064e3b, // Dark green vinyl roof popular in Kogi
    roughness: 0.9,
    metalness: 0.05
  });

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.3,
    metalness: 0.8
  });

  // 1. Cockpit shell
  const lowerGeo = new THREE.BoxGeometry(1.25, 0.55, 2.2);
  const lower = new THREE.Mesh(lowerGeo, bodyMat);
  lower.position.set(0, 0.55, 0);
  lower.castShadow = true;
  chassis.add(lower);

  // 2. Green Canvas Canopy
  const roofGeo = new THREE.BoxGeometry(1.3, 0.12, 1.9);
  const roof = new THREE.Mesh(roofGeo, canvasRoofMat);
  roof.position.set(0, 1.5, -0.1);
  roof.castShadow = true;
  chassis.add(roof);

  const strutPositions = [
    [-0.6, 1.05, 0.75],
    [0.6, 1.05, 0.75],
    [-0.6, 1.05, -0.95],
    [0.6, 1.05, -0.95]
  ];
  strutPositions.forEach(([x, y, z]) => {
    const strutGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.0, 8);
    const strut = new THREE.Mesh(strutGeo, steelMat);
    strut.position.set(x, y, z);
    chassis.add(strut);
  });

  // 3. Front Nose & Handlebars
  const noseGeo = new THREE.BoxGeometry(0.7, 0.5, 0.6);
  const nose = new THREE.Mesh(noseGeo, bodyMat);
  nose.position.set(0, 0.7, 1.1);
  nose.castShadow = true;
  chassis.add(nose);

  const barGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.6, 8);
  barGeo.rotateZ(Math.PI / 2);
  const bar = new THREE.Mesh(barGeo, steelMat);
  bar.position.set(0, 1.05, 0.7);
  chassis.add(bar);

  // 4. Passenger Seat Cushion
  const seatGeo = new THREE.BoxGeometry(1.1, 0.25, 0.7);
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.7 });
  const seat = new THREE.Mesh(seatGeo, seatMat);
  seat.position.set(0, 0.75, -0.45);
  chassis.add(seat);

  // 5. Headlight
  const headlightMeshes: THREE.Mesh[] = [];
  const headlights: THREE.SpotLight[] = [];

  const lightGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 14);
  lightGeo.rotateX(Math.PI / 2);
  const lightMat = new THREE.MeshStandardMaterial({
    color: 0xfff0c0,
    emissive: 0xffe680,
    emissiveIntensity: 0.8
  });
  const frontLight = new THREE.Mesh(lightGeo, lightMat);
  frontLight.position.set(0, 0.75, 1.42);
  chassis.add(frontLight);
  headlightMeshes.push(frontLight);

  const spot = new THREE.SpotLight(0xfff0c0, 1.5, 30, Math.PI / 5, 0.4);
  spot.position.set(0, 0.75, 1.45);
  spot.target.position.set(0, 0, 12);
  chassis.add(spot);
  chassis.add(spot.target);
  headlights.push(spot);

  // 6. Tricycle Wheels
  const frontWheels: THREE.Group[] = [];
  const allWheels: THREE.Group[] = [];
  const wheelRadius = 0.28;
  const wheelThickness = 0.18;

  const frontAssembly = new THREE.Group();
  frontAssembly.position.set(0, wheelRadius, 1.15);
  const frontWheel = createWheel(wheelRadius, wheelThickness);
  frontAssembly.add(frontWheel);
  group.add(frontAssembly);
  frontWheels.push(frontAssembly);
  allWheels.push(frontWheel);

  [-0.65, 0.65].forEach(x => {
    const rearWheel = createWheel(wheelRadius, wheelThickness);
    rearWheel.position.set(x, wheelRadius, -0.65);
    group.add(rearWheel);
    allWheels.push(rearWheel);
  });

  const shadow = createContactShadow(1.8, 3.0);
  group.add(shadow);

  const exhaustPos = new THREE.Vector3(-0.35, 0.25, -1.05);

  return {
    group,
    type: 'keke',
    frontWheels,
    allWheels,
    chassis,
    headlights,
    headlightMeshes,
    exhaustPos
  };
}
