import * as THREE from 'three';

export interface CharacterInstance {
  group: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  head: THREE.Group;
  updateAnimation: (delta: number, speed: number, isMoving: boolean) => void;
}

export function createCharacter(isPlayer = true): CharacterInstance {
  const group = new THREE.Group();
  group.name = isPlayer ? 'PlayerCharacter' : 'NPCCharacter';

  // Skin material
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0x4a2e18, // Rich deep skin tone
    roughness: 0.65,
    metalness: 0.05
  });

  // Ankara Pattern / Vibrant African Fabric Shirt Material
  const shirtColors = isPlayer ? 0x0284c7 : 0xe11d48; // Cyan/Blue for player, Coral red for NPC
  const shirtMat = new THREE.MeshStandardMaterial({
    color: shirtColors,
    roughness: 0.7,
    metalness: 0.1
  });

  // Trousers
  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.8,
    metalness: 0.1
  });

  // Shoes / Loafers
  const shoesMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.5,
    metalness: 0.3
  });

  // Traditional Nigerian Fila Cap
  const capMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Golden yellow embroidered fila
    roughness: 0.7
  });

  // 1. Torso / Dashiki Shirt
  const torsoGeo = new THREE.BoxGeometry(0.55, 0.7, 0.32);
  const torso = new THREE.Mesh(torsoGeo, shirtMat);
  torso.position.y = 1.15;
  torso.castShadow = true;
  group.add(torso);

  // 2. Head & Neck
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.68, 0);

  const headGeo = new THREE.BoxGeometry(0.32, 0.34, 0.32);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Fila Cap on head (angled traditional Yoruba cap)
  const capGeo = new THREE.BoxGeometry(0.34, 0.18, 0.34);
  const capMesh = new THREE.Mesh(capGeo, capMat);
  capMesh.position.set(0, 0.22, 0.02);
  capMesh.rotation.z = -0.15;
  headGroup.add(capMesh);

  // Sunglasses / shades for swagger
  const glassesGeo = new THREE.BoxGeometry(0.28, 0.07, 0.06);
  const glassesMat = new THREE.MeshStandardMaterial({ color: 0x000000, metalness: 0.9, roughness: 0.1 });
  const glasses = new THREE.Mesh(glassesGeo, glassesMat);
  glasses.position.set(0, 0.04, 0.17);
  headGroup.add(glasses);

  group.add(headGroup);

  // 3. Arms
  const armGeo = new THREE.BoxGeometry(0.14, 0.65, 0.14);
  armGeo.translate(0, -0.28, 0); // Pivot at shoulder

  // Left Arm
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.36, 1.45, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, shirtMat);
  leftArmMesh.castShadow = true;
  leftArm.add(leftArmMesh);
  group.add(leftArm);

  // Right Arm
  const rightArm = new THREE.Group();
  rightArm.position.set(0.36, 1.45, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, shirtMat);
  rightArmMesh.castShadow = true;
  rightArm.add(rightArmMesh);
  group.add(rightArm);

  // 4. Legs
  const legGeo = new THREE.BoxGeometry(0.18, 0.75, 0.18);
  legGeo.translate(0, -0.36, 0); // Pivot at hip

  // Left Leg
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.16, 0.8, 0);
  const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
  leftLegMesh.castShadow = true;
  leftLeg.add(leftLegMesh);

  // Shoe
  const shoeGeo = new THREE.BoxGeometry(0.2, 0.12, 0.32);
  const leftShoe = new THREE.Mesh(shoeGeo, shoesMat);
  leftShoe.position.set(0, -0.74, 0.06);
  leftLeg.add(leftShoe);
  group.add(leftLeg);

  // Right Leg
  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.16, 0.8, 0);
  const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
  rightLegMesh.castShadow = true;
  rightLeg.add(rightLegMesh);

  const rightShoe = new THREE.Mesh(shoeGeo, shoesMat);
  rightShoe.position.set(0, -0.74, 0.06);
  rightLeg.add(rightShoe);
  group.add(rightLeg);

  // Soft Contact shadow under character
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 64;
  shadowCanvas.height = 64;
  const sCtx = shadowCanvas.getContext('2d')!;
  const grad = sCtx.createRadialGradient(32, 32, 4, 32, 32, 30);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 64, 64);

  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.PlaneGeometry(0.8, 0.8);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity: 0.7
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  // Animation state
  let walkTime = 0;

  const updateAnimation = (delta: number, speed: number, isMoving: boolean) => {
    if (isMoving) {
      walkTime += delta * Math.max(speed * 8, 4);
      const angle = Math.sin(walkTime) * 0.65;

      leftLeg.rotation.x = angle;
      rightLeg.rotation.x = -angle;

      leftArm.rotation.x = -angle * 0.8;
      rightArm.rotation.x = angle * 0.8;

      // Subtle torso bob
      torso.position.y = 1.15 + Math.abs(Math.sin(walkTime * 2)) * 0.05;
      headGroup.position.y = 1.68 + Math.abs(Math.sin(walkTime * 2)) * 0.05;
    } else {
      // Idle breathing
      walkTime += delta * 2;
      leftLeg.rotation.x = THREE.MathUtils.damp(leftLeg.rotation.x, 0, 10, delta);
      rightLeg.rotation.x = THREE.MathUtils.damp(rightLeg.rotation.x, 0, 10, delta);
      leftArm.rotation.x = THREE.MathUtils.damp(leftArm.rotation.x, 0, 10, delta);
      rightArm.rotation.x = THREE.MathUtils.damp(rightArm.rotation.x, 0, 10, delta);

      torso.position.y = 1.15 + Math.sin(walkTime) * 0.015;
      headGroup.position.y = 1.68 + Math.sin(walkTime) * 0.015;
    }
  };

  return {
    group,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    head: headGroup,
    updateAnimation
  };
}
