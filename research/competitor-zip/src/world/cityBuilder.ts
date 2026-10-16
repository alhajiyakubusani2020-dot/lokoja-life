import * as THREE from 'three';
import {
  createRoadTexture,
  createColonialBrickTexture,
  createSidewalkTexture,
  createLokojaBillboardTexture,
  createNigerianFlagTexture,
  createStripedFabricTexture
} from './textures';

export interface InteractiveZone {
  id: string;
  name: string;
  type: 'catfish_joint' | 'mount_patti' | 'nataco_haulage' | 'auto_garage' | 'confluence_villa' | 'bus_stop';
  position: THREE.Vector3;
  radius: number;
  labelMesh?: THREE.Mesh;
}

export interface CityWorld {
  rootGroup: THREE.Group;
  interactiveZones: InteractiveZone[];
  streetlights: THREE.PointLight[];
  waterNigerMesh: THREE.Mesh;
  waterBenueMesh: THREE.Mesh;
  bridgeBounds: THREE.Box3;
}

// Helper: Palm Tree
function createPalmTree(): THREE.Group {
  const tree = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.9 });

  const curvePoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.2, 2.0, 0),
    new THREE.Vector3(-0.1, 4.0, 0),
    new THREE.Vector3(0.1, 5.5, 0)
  ];
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  const trunkGeo = new THREE.TubeGeometry(curve, 10, 0.22, 8, false);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.castShadow = true;
  tree.add(trunk);

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x166534,
    roughness: 0.6,
    side: THREE.DoubleSide
  });

  const leafCount = 7;
  for (let i = 0; i < leafCount; i++) {
    const angle = (i / leafCount) * Math.PI * 2;
    const leafGeo = new THREE.PlaneGeometry(0.7, 2.4);
    leafGeo.translate(0, 1.2, 0);
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.copy(curvePoints[curvePoints.length - 1]);
    leaf.rotation.y = angle;
    leaf.rotation.x = 0.82;
    leaf.castShadow = true;
    tree.add(leaf);
  }

  return tree;
}

// Helper: Streetlamp
function createStreetlamp(x: number, z: number, rotationY = 0): { group: THREE.Group; light: THREE.PointLight } {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = rotationY;

  const metalMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.35, metalness: 0.8 });

  const postGeo = new THREE.CylinderGeometry(0.08, 0.12, 5.5, 8);
  const post = new THREE.Mesh(postGeo, metalMat);
  post.position.y = 2.75;
  post.castShadow = true;
  group.add(post);

  const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
  armGeo.rotateZ(Math.PI / 3);
  const arm = new THREE.Mesh(armGeo, metalMat);
  arm.position.set(0.65, 5.3, 0);
  group.add(arm);

  const fixtureGeo = new THREE.BoxGeometry(0.4, 0.15, 0.25);
  const fixture = new THREE.Mesh(fixtureGeo, metalMat);
  fixture.position.set(1.3, 5.7, 0);
  group.add(fixture);

  const bulbGeo = new THREE.BoxGeometry(0.35, 0.05, 0.2);
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffea9f });
  const bulb = new THREE.Mesh(bulbGeo, bulbMat);
  bulb.position.set(1.3, 5.62, 0);
  group.add(bulb);

  const light = new THREE.PointLight(0xffea9f, 0, 18, 1.2);
  light.position.set(1.3, 5.5, 0);
  group.add(light);

  return { group, light };
}

// Helper: Build Mount Patti Plateau (458m hill with Lugard Rest House & Broadcast Mast)
function createMountPatti(): THREE.Group {
  const mountGroup = new THREE.Group();
  mountGroup.position.set(-110, 0, 60);

  const mountainMat = new THREE.MeshStandardMaterial({
    color: 0x4d5b44, // Savanna lush green & granite rock
    roughness: 0.95,
    metalness: 0.05
  });

  // Base hill tier
  const tier1Geo = new THREE.ConeGeometry(55, 32, 10);
  const tier1 = new THREE.Mesh(tier1Geo, mountainMat);
  tier1.position.y = 16;
  tier1.castShadow = true;
  tier1.receiveShadow = true;
  mountGroup.add(tier1);

  // Flat summit plateau (458m altitude feel)
  const plateauGeo = new THREE.CylinderGeometry(28, 35, 12, 10);
  const plateau = new THREE.Mesh(plateauGeo, mountainMat);
  plateau.position.y = 36;
  plateau.castShadow = true;
  plateau.receiveShadow = true;
  mountGroup.add(plateau);

  // Lord Lugard's Colonial Rest House on Mount Patti summit
  const restHouseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 }); // Red colonial tin roof

  const houseGeo = new THREE.BoxGeometry(10, 3.5, 7);
  const house = new THREE.Mesh(houseGeo, restHouseMat);
  house.position.set(0, 44, 0);
  house.castShadow = true;
  mountGroup.add(house);

  const roofGeo = new THREE.ConeGeometry(8, 2.5, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(0, 46.8, 0);
  roof.castShadow = true;
  mountGroup.add(roof);

  // Mount Patti Lookout Terrace Railing
  const railingMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
  const terraceGeo = new THREE.TorusGeometry(12, 0.2, 6, 16);
  terraceGeo.rotateX(Math.PI / 2);
  const terrace = new THREE.Mesh(terraceGeo, railingMat);
  terrace.position.set(0, 42.2, 0);
  mountGroup.add(terrace);

  // Telecommunications Broadcast Mast (Lattice tower with red & white bands)
  const towerMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.8, roughness: 0.3 });
  const mastGeo = new THREE.CylinderGeometry(0.15, 1.2, 38, 4);
  const mast = new THREE.Mesh(mastGeo, towerMat);
  mast.position.set(10, 61, -4);
  mast.castShadow = true;
  mountGroup.add(mast);

  // Red aviation flashing warning beacon
  const beacon = new THREE.PointLight(0xff0000, 3.0, 50);
  beacon.position.set(10, 80, -4);
  mountGroup.add(beacon);

  return mountGroup;
}

// Helper: The Iron of Liberty Monument (Bishop Crowther & Freedom Memorial)
function createIronOfLibertyMonument(): THREE.Group {
  const group = new THREE.Group();
  group.position.set(28, 0, 85);

  const stoneMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.7 });
  const ironMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.3, metalness: 0.9 });

  // Tiered plaza base
  const base1 = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 8), stoneMat);
  base1.position.y = 0.2;
  group.add(base1);

  const base2 = new THREE.Mesh(new THREE.BoxGeometry(5, 0.4, 5), stoneMat);
  base2.position.y = 0.6;
  group.add(base2);

  // The Historic Iron Pole / Obelisk of Liberty
  const poleGeo = new THREE.CylinderGeometry(0.12, 0.22, 6.5, 8);
  const pole = new THREE.Mesh(poleGeo, ironMat);
  pole.position.y = 3.8;
  pole.castShadow = true;
  group.add(pole);

  // Liberty emblem on top
  const emblemGeo = new THREE.SphereGeometry(0.4, 12, 12);
  const emblemMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
  const emblem = new THREE.Mesh(emblemGeo, emblemMat);
  emblem.position.y = 7.2;
  group.add(emblem);

  return group;
}

// Helper: River Speedboat / Wooden Canoe on River Niger
function createRiverBoat(x: number, z: number, rotationY = 0): THREE.Group {
  const boat = new THREE.Group();
  boat.position.set(x, -0.15, z);
  boat.rotation.y = rotationY;

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
  const hullGeo = new THREE.BoxGeometry(1.4, 0.6, 5.0);
  const hull = new THREE.Mesh(hullGeo, woodMat);
  hull.position.y = 0.3;
  boat.add(hull);

  // Canopy
  const canopyGeo = new THREE.BoxGeometry(1.5, 0.1, 2.5);
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.position.set(0, 1.4, -0.3);
  boat.add(canopy);

  return boat;
}

/**
 * Builds the complete 3D Lokoja Confluence City:
 * River Niger & Benue Confluence, Mount Patti (458m), Confluence Bridge, Nataco Hub, Catfish Joint, Liberty Monument.
 */
export function buildLagosCity(): CityWorld {
  const rootGroup = new THREE.Group();
  const interactiveZones: InteractiveZone[] = [];
  const streetlights: THREE.PointLight[] = [];

  // --- 1. LOKOJA SAVANNA & CITY GROUND ---
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x43523d, // North-Central Nigerian savanna grass & rich soil
    roughness: 0.92,
    metalness: 0.05
  });

  // Lokoja City Peninsula (Main urban zone)
  const cityGroundGeo = new THREE.PlaneGeometry(340, 240);
  const cityGround = new THREE.Mesh(cityGroundGeo, groundMat);
  cityGround.rotation.x = -Math.PI / 2;
  cityGround.position.set(0, -0.05, 75);
  cityGround.receiveShadow = true;
  rootGroup.add(cityGround);

  // North Bank (Felele / Abuja highway approach)
  const northGroundGeo = new THREE.PlaneGeometry(340, 160);
  const northGround = new THREE.Mesh(northGroundGeo, groundMat);
  northGround.rotation.x = -Math.PI / 2;
  northGround.position.set(0, -0.05, -160);
  northGround.receiveShadow = true;
  rootGroup.add(northGround);

  // --- 2. THE CONFLUENCE: RIVER NIGER & RIVER BENUE ---
  // The famous geographical phenomenon:
  // West side: River Niger (muddy ochre / golden brown)
  // East side: River Benue (clean light teal-green)
  // They flow alongside each other and converge!
  const riverNigerMat = new THREE.MeshPhysicalMaterial({
    color: 0x8a623a, // Distinctive brownish-gold River Niger water
    roughness: 0.18,
    metalness: 0.1,
    transmission: 0.65,
    transparent: true,
    opacity: 0.92
  });

  const riverBenueMat = new THREE.MeshPhysicalMaterial({
    color: 0x0e7490, // Distinctive clear greenish-teal River Benue water
    roughness: 0.15,
    metalness: 0.1,
    transmission: 0.72,
    transparent: true,
    opacity: 0.90
  });

  // Niger River channel (West side)
  const nigerGeo = new THREE.PlaneGeometry(180, 85, 32, 16);
  const waterNigerMesh = new THREE.Mesh(nigerGeo, riverNigerMat);
  waterNigerMesh.rotation.x = -Math.PI / 2;
  waterNigerMesh.position.set(-90, -0.28, -45);
  waterNigerMesh.receiveShadow = true;
  rootGroup.add(waterNigerMesh);

  // Benue River channel (East side)
  const benueGeo = new THREE.PlaneGeometry(180, 85, 32, 16);
  const waterBenueMesh = new THREE.Mesh(benueGeo, riverBenueMat);
  waterBenueMesh.rotation.x = -Math.PI / 2;
  waterBenueMesh.position.set(90, -0.28, -45);
  waterBenueMesh.receiveShadow = true;
  rootGroup.add(waterBenueMesh);

  // Sandy Confluence Beach Bank
  const sandMat = new THREE.MeshStandardMaterial({ color: 0xd9b375, roughness: 0.9 });
  const sandGeo = new THREE.PlaneGeometry(360, 8);
  const sandBank1 = new THREE.Mesh(sandGeo, sandMat);
  sandBank1.rotation.x = -Math.PI / 2;
  sandBank1.position.set(0, -0.02, -3);
  rootGroup.add(sandBank1);

  const sandBank2 = new THREE.Mesh(sandGeo, sandMat);
  sandBank2.rotation.x = -Math.PI / 2;
  sandBank2.position.set(0, -0.02, -87);
  rootGroup.add(sandBank2);

  // Fishing boats at Confluence Beach
  const boat1 = createRiverBoat(-35, -2, 0.2);
  const boat2 = createRiverBoat(-42, -2, -0.15);
  const boat3 = createRiverBoat(38, -2, 0.4);
  rootGroup.add(boat1);
  rootGroup.add(boat2);
  rootGroup.add(boat3);

  // --- 3. MOUNT PATTI (TOWERING HISTORIC PLATEAU) ---
  const mountPatti = createMountPatti();
  rootGroup.add(mountPatti);

  interactiveZones.push({
    id: 'mount_patti',
    name: 'Mount Patti Summit Lookout (458m)',
    type: 'mount_patti',
    position: new THREE.Vector3(-110, 0, 60),
    radius: 12.0
  });

  // --- 4. ROADS & HIGHWAYS ---
  const roadTex = createRoadTexture();
  const roadMat = new THREE.MeshStandardMaterial({
    map: roadTex,
    roughness: 0.75,
    metalness: 0.2
  });

  const sidewalkTex = createSidewalkTexture();
  const sidewalkMat = new THREE.MeshStandardMaterial({
    map: sidewalkTex,
    roughness: 0.85
  });

  // Trans-Sahara / A2 Expressway (Nataco - Ganaja Main Arterial)
  const mainRoadGeo = new THREE.PlaneGeometry(16, 200);
  const mainRoad = new THREE.Mesh(mainRoadGeo, roadMat);
  mainRoad.rotation.x = -Math.PI / 2;
  mainRoad.position.set(0, 0.02, 70);
  mainRoad.receiveShadow = true;
  rootGroup.add(mainRoad);

  // Sidewalks
  [-9, 9].forEach(x => {
    const walkGeo = new THREE.BoxGeometry(2.5, 0.15, 200);
    const walk = new THREE.Mesh(walkGeo, sidewalkMat);
    walk.position.set(x, 0.075, 70);
    walk.receiveShadow = true;
    rootGroup.add(walk);
  });

  // Ganaja Boulevard (East-West road linking Ganaja Village and Old Market)
  const ganajaRoadGeo = new THREE.PlaneGeometry(180, 16);
  const ganajaRoad = new THREE.Mesh(ganajaRoadGeo, roadMat);
  ganajaRoad.rotation.x = -Math.PI / 2;
  ganajaRoad.position.set(0, 0.025, 60);
  ganajaRoad.receiveShadow = true;
  rootGroup.add(ganajaRoad);

  // Confluence Beach Road
  const beachRoadGeo = new THREE.PlaneGeometry(240, 14);
  const beachRoad = new THREE.Mesh(beachRoadGeo, roadMat);
  beachRoad.rotation.x = -Math.PI / 2;
  beachRoad.position.set(0, 0.025, 6);
  beachRoad.receiveShadow = true;
  rootGroup.add(beachRoad);

  // --- 5. THE GREAT CONFLUENCE BRIDGE (Murtala Mohammed / Jamata Bridge) ---
  const bridgeDeckGeo = new THREE.BoxGeometry(16, 1.2, 92);
  const bridgeConcreteMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 });
  const bridgeDeck = new THREE.Mesh(bridgeDeckGeo, bridgeConcreteMat);
  bridgeDeck.position.set(0, 4.5, -45);
  bridgeDeck.receiveShadow = true;
  bridgeDeck.castShadow = true;
  rootGroup.add(bridgeDeck);

  const bridgeRoadGeo = new THREE.PlaneGeometry(14.8, 92);
  const bridgeRoad = new THREE.Mesh(bridgeRoadGeo, roadMat);
  bridgeRoad.rotation.x = -Math.PI / 2;
  bridgeRoad.position.set(0, 5.12, -45);
  bridgeRoad.receiveShadow = true;
  rootGroup.add(bridgeRoad);

  // Heavy steel bridge truss arches (Iconic River Niger Bridge design)
  const steelTrussMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.3 });
  [-7.8, 7.8].forEach(x => {
    // 3 continuous truss spans across the river
    for (let s = -32; s <= 32; s += 32) {
      const archGeo = new THREE.TorusGeometry(15, 0.35, 6, 16, Math.PI);
      const arch = new THREE.Mesh(archGeo, steelTrussMat);
      arch.position.set(x, 5.1, -45 + s);
      arch.castShadow = true;
      rootGroup.add(arch);
    }
  });

  // Guardrails
  [-7.6, 7.6].forEach(x => {
    const railGeo = new THREE.BoxGeometry(0.3, 0.9, 92);
    const rail = new THREE.Mesh(railGeo, steelTrussMat);
    rail.position.set(x, 5.6, -45);
    rail.castShadow = true;
    rootGroup.add(rail);
  });

  // Bridge Ramps
  const rampGeo = new THREE.BoxGeometry(16, 1.2, 28);
  const southRamp = new THREE.Mesh(rampGeo, bridgeConcreteMat);
  southRamp.position.set(0, 2.2, 8);
  southRamp.rotation.x = 0.16;
  rootGroup.add(southRamp);

  const northRamp = new THREE.Mesh(rampGeo, bridgeConcreteMat);
  northRamp.position.set(0, 2.2, -98);
  northRamp.rotation.x = -0.16;
  rootGroup.add(northRamp);

  const bridgeBounds = new THREE.Box3(
    new THREE.Vector3(-9, 0, -95),
    new THREE.Vector3(9, 10, 25)
  );

  // --- 6. NATACO INTERSTATE LOGISTICS & TRANSPORT HUB ---
  const natacoGroup = new THREE.Group();
  natacoGroup.position.set(-42, 0, 40);

  // Main Terminal Depot
  const natacoDepotGeo = new THREE.BoxGeometry(28, 10, 22);
  const natacoDepotMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 });
  const natacoDepot = new THREE.Mesh(natacoDepotGeo, natacoDepotMat);
  natacoDepot.position.y = 5;
  natacoDepot.castShadow = true;
  natacoGroup.add(natacoDepot);

  // Big Billboard
  const natacoBillTex = createLokojaBillboardTexture('nataco');
  const natacoBill = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), new THREE.MeshBasicMaterial({ map: natacoBillTex }));
  natacoBill.position.set(0, 15, 11.2);
  natacoGroup.add(natacoBill);

  // Fuel Canopy & Loading Bay
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 });
  const canopyGeo = new THREE.BoxGeometry(22, 0.6, 12);
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.position.set(0, 5.5, 18);
  canopy.castShadow = true;
  natacoGroup.add(canopy);

  rootGroup.add(natacoGroup);

  interactiveZones.push({
    id: 'nataco_haulage',
    name: 'Nataco Interstate Logistics Hub (Haulage & Transit)',
    type: 'nataco_haulage',
    position: new THREE.Vector3(-42, 0, 58),
    radius: 8.0
  });

  // --- 7. MAMA HALIMA'S FRESH CONFLUENCE CATFISH JOINT ---
  const catfishGroup = new THREE.Group();
  catfishGroup.position.set(34, 0, 42);

  const shopGeo = new THREE.BoxGeometry(16, 5.5, 14);
  const shopMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.8 });
  const shop = new THREE.Mesh(shopGeo, shopMat);
  shop.position.y = 2.75;
  shop.castShadow = true;
  catfishGroup.add(shop);

  // Green & Yellow Awning
  const awningTex = createStripedFabricTexture('#008751', '#fef08a');
  const awningMat = new THREE.MeshStandardMaterial({ map: awningTex, roughness: 0.6, side: THREE.DoubleSide });
  const awning = new THREE.Mesh(new THREE.PlaneGeometry(15, 5), awningMat);
  awning.position.set(0, 4.2, 9.2);
  awning.rotation.x = 0.55;
  catfishGroup.add(awning);

  // Catfish Billboard
  const catfishBillTex = createLokojaBillboardTexture('catfish');
  const catfishBill = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), new THREE.MeshBasicMaterial({ map: catfishBillTex }));
  catfishBill.position.set(0, 8.8, 7.1);
  catfishGroup.add(catfishBill);

  // Big River Niger Catfish Pepper Soup Pot & Grill
  const potGeo = new THREE.CylinderGeometry(0.9, 0.7, 1.0, 14);
  const potMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.7 });
  const pot = new THREE.Mesh(potGeo, potMat);
  pot.position.set(-3.5, 0.5, 9.5);
  catfishGroup.add(pot);

  const potLight = new THREE.PointLight(0xf97316, 1.8, 6);
  potLight.position.set(-3.5, 0.4, 9.5);
  catfishGroup.add(potLight);

  rootGroup.add(catfishGroup);

  interactiveZones.push({
    id: 'catfish_joint',
    name: "Mama Halima's Confluence Catfish & Pepper Soup",
    type: 'catfish_joint',
    position: new THREE.Vector3(34, 0, 52),
    radius: 7.0
  });

  // --- 8. THE IRON OF LIBERTY MONUMENT ---
  const libertyMonument = createIronOfLibertyMonument();
  rootGroup.add(libertyMonument);

  // --- 9. GANAJA AUTO WORKSHOP & MOTOR SPARES ---
  const garageGroup = new THREE.Group();
  garageGroup.position.set(52, 0, 125);

  const garageGeo = new THREE.BoxGeometry(24, 7.5, 18);
  const garageMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
  const garage = new THREE.Mesh(garageGeo, garageMat);
  garage.position.y = 3.75;
  garage.castShadow = true;
  garageGroup.add(garage);

  const garageSignGeo = new THREE.BoxGeometry(18, 2.2, 0.4);
  const garageSignMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
  const garageSign = new THREE.Mesh(garageSignGeo, garageSignMat);
  garageSign.position.set(0, 8.5, 9.2);
  garageGroup.add(garageSign);

  rootGroup.add(garageGroup);

  interactiveZones.push({
    id: 'auto_garage',
    name: 'Ganaja Auto Workshop (Bus & Keke Tuning)',
    type: 'auto_garage',
    position: new THREE.Vector3(52, 0, 136),
    radius: 8.0
  });

  // --- 10. CONFLUENCE HILLTOP VILLA (REAL ESTATE) ---
  const villaGroup = new THREE.Group();
  villaGroup.position.set(-65, 0, 130);

  const villaGeo = new THREE.BoxGeometry(28, 22, 22);
  const villaMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
  const villa = new THREE.Mesh(villaGeo, villaMat);
  villa.position.y = 11;
  villa.castShadow = true;
  villaGroup.add(villa);

  const villaBillTex = createLokojaBillboardTexture('kogi');
  const villaBill = new THREE.Mesh(new THREE.PlaneGeometry(16, 7), new THREE.MeshBasicMaterial({ map: villaBillTex }));
  villaBill.position.set(0, 26, 11.1);
  villaGroup.add(villaBill);

  rootGroup.add(villaGroup);

  interactiveZones.push({
    id: 'confluence_villa',
    name: 'Confluence View Hillside Villa (Rent Home)',
    type: 'confluence_villa',
    position: new THREE.Vector3(-65, 0, 143),
    radius: 8.0
  });

  // --- 11. LOKOJA COMMUTER BUS STOPS ---
  const busStopData = [
    { id: 'stop_nataco', name: 'Nataco Interstate Terminal Stop', pos: new THREE.Vector3(-10, 0, 20) },
    { id: 'stop_confluence', name: 'Confluence Beach & Bridge Stop', pos: new THREE.Vector3(10, 0, 32) },
    { id: 'stop_patti_base', name: 'Mount Patti Base Junction', pos: new THREE.Vector3(-10, 0, 85) },
    { id: 'stop_ganaja', name: 'Ganaja Flyover Interchange', pos: new THREE.Vector3(10, 0, 140) }
  ];

  busStopData.forEach(stop => {
    const stopGroup = new THREE.Group();
    stopGroup.position.copy(stop.pos);

    // Green and white bus shelter
    const shelterRoofGeo = new THREE.BoxGeometry(4.5, 0.2, 2.2);
    const shelterRoofMat = new THREE.MeshStandardMaterial({ color: 0x008751, roughness: 0.4 });
    const shelterRoof = new THREE.Mesh(shelterRoofGeo, shelterRoofMat);
    shelterRoof.position.y = 2.8;
    shelterRoof.castShadow = true;
    stopGroup.add(shelterRoof);

    [-2.0, 2.0].forEach(px => {
      const pGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.8, 6);
      const p = new THREE.Mesh(pGeo, new THREE.MeshStandardMaterial({ color: 0x475569 }));
      p.position.set(px, 1.4, -0.9);
      stopGroup.add(p);
    });

    // Striped curb
    const curbGeo = new THREE.BoxGeometry(6.0, 0.25, 0.5);
    const curbMat = new THREE.MeshStandardMaterial({ color: 0x008751, roughness: 0.7 });
    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.position.set(0, 0.125, 1.2);
    stopGroup.add(curb);

    rootGroup.add(stopGroup);

    interactiveZones.push({
      id: stop.id,
      name: stop.name,
      type: 'bus_stop',
      position: stop.pos.clone().add(new THREE.Vector3(0, 0, 1.5)),
      radius: 6.5
    });
  });

  // --- 12. SAVANNA PALM TREES ---
  const palmCoords = [
    [-18, 15], [-18, 40], [-18, 70], [-18, 120], [-18, 150],
    [18, 15], [18, 40], [18, 85], [18, 120], [18, 155],
    [-28, 4], [-48, 4], [-75, 4], [28, 4], [55, 4], [80, 4]
  ];

  palmCoords.forEach(([px, pz]) => {
    const palm = createPalmTree();
    palm.position.set(px, 0, pz);
    rootGroup.add(palm);
  });

  // --- 13. STREETLIGHTS ---
  const streetLightCoords = [
    [-8.8, 25], [-8.8, 55], [-8.8, 85], [-8.8, 115], [-8.8, 145],
    [8.8, 25], [8.8, 55], [8.8, 85], [8.8, 115], [8.8, 145]
  ];

  streetLightCoords.forEach(([lx, lz]) => {
    const isLeft = lx < 0;
    const { group: slGroup, light: slLight } = createStreetlamp(lx, lz, isLeft ? 0 : Math.PI);
    rootGroup.add(slGroup);
    streetlights.push(slLight);
  });

  return {
    rootGroup,
    interactiveZones,
    streetlights,
    waterNigerMesh,
    waterBenueMesh,
    bridgeBounds
  };
}
