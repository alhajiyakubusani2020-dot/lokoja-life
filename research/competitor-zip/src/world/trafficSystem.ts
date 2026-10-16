import * as THREE from 'three';
import { createLokojaBus, createKekeNapep, VehicleInstance } from '../entities/vehicleModels';
import { createCharacter, CharacterInstance } from '../entities/characterModel';

export interface TrafficVehicle {
  instance: VehicleInstance;
  waypoints: THREE.Vector3[];
  currentWaypointIdx: number;
  speed: number;
  maxSpeed: number;
  honkCooldown: number;
}

export interface PedestrianNPC {
  instance: CharacterInstance;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  progress: number;
  speed: number;
}

const _vTarget = new THREE.Vector3();
const _vDir = new THREE.Vector3();

export class TrafficSystem {
  public vehicles: TrafficVehicle[] = [];
  public pedestrians: PedestrianNPC[] = [];
  private rootGroup: THREE.Group;

  constructor(scene: THREE.Scene) {
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'TrafficSystem';
    scene.add(this.rootGroup);
    this.spawnTraffic();
    this.spawnPedestrians();
  }

  private spawnTraffic() {
    // Route 1: Nataco - Confluence Bridge Loop (Lokoja Express Bus 1)
    const route1 = [
      new THREE.Vector3(3.5, 0, 160),
      new THREE.Vector3(3.5, 0, 30),
      new THREE.Vector3(3.5, 4.8, -45),
      new THREE.Vector3(3.5, 0, -110),
      new THREE.Vector3(-3.5, 0, -110),
      new THREE.Vector3(-3.5, 4.8, -45),
      new THREE.Vector3(-3.5, 0, 30),
      new THREE.Vector3(-3.5, 0, 160),
    ];

    const bus1 = createLokojaBus(false);
    this.rootGroup.add(bus1.group);
    bus1.group.position.copy(route1[0]);
    this.vehicles.push({
      instance: bus1,
      waypoints: route1,
      currentWaypointIdx: 1,
      speed: 8.5,
      maxSpeed: 8.5,
      honkCooldown: Math.random() * 8 + 4
    });

    // Route 2: Ganaja Boulevard Loop (Lokoja Express Bus 2)
    const route2 = [
      new THREE.Vector3(-75, 0, 63),
      new THREE.Vector3(75, 0, 63),
      new THREE.Vector3(75, 0, 57),
      new THREE.Vector3(-75, 0, 57)
    ];

    const bus2 = createLokojaBus(false);
    this.rootGroup.add(bus2.group);
    bus2.group.position.copy(route2[0]);
    this.vehicles.push({
      instance: bus2,
      waypoints: route2,
      currentWaypointIdx: 1,
      speed: 7.2,
      maxSpeed: 7.2,
      honkCooldown: Math.random() * 10 + 6
    });

    // Route 3: Lokoja Keke Napep 1 (Beach - Ganaja)
    const route3 = [
      new THREE.Vector3(-80, 0, 7),
      new THREE.Vector3(80, 0, 7),
      new THREE.Vector3(80, 0, 5),
      new THREE.Vector3(-80, 0, 5)
    ];

    const keke1 = createKekeNapep(false);
    this.rootGroup.add(keke1.group);
    keke1.group.position.copy(route3[0]);
    this.vehicles.push({
      instance: keke1,
      waypoints: route3,
      currentWaypointIdx: 1,
      speed: 6.5,
      maxSpeed: 6.5,
      honkCooldown: Math.random() * 9 + 5
    });

    // Route 4: Lokoja Keke Napep 2 (Nataco Hub)
    const route4 = [
      new THREE.Vector3(-3.5, 0, 140),
      new THREE.Vector3(-3.5, 0, 20),
      new THREE.Vector3(3.5, 0, 20),
      new THREE.Vector3(3.5, 0, 140)
    ];

    const keke2 = createKekeNapep(false);
    this.rootGroup.add(keke2.group);
    keke2.group.position.copy(route4[0]);
    this.vehicles.push({
      instance: keke2,
      waypoints: route4,
      currentWaypointIdx: 1,
      speed: 7.0,
      maxSpeed: 7.0,
      honkCooldown: Math.random() * 12 + 4
    });
  }

  private spawnPedestrians() {
    const pedConfigs = [
      { start: new THREE.Vector3(-9.2, 0, 30), end: new THREE.Vector3(-9.2, 0, 120), speed: 1.4 },
      { start: new THREE.Vector3(9.2, 0, 110), end: new THREE.Vector3(9.2, 0, 40), speed: 1.3 },
      { start: new THREE.Vector3(25, 0, 52), end: new THREE.Vector3(40, 0, 52), speed: 1.1 },
      { start: new THREE.Vector3(-30, 0, 52), end: new THREE.Vector3(-55, 0, 52), speed: 1.2 },
      { start: new THREE.Vector3(-18, 0, 100), end: new THREE.Vector3(-26, 0, 100), speed: 0.9 }
    ];

    pedConfigs.forEach(cfg => {
      const char = createCharacter(false);
      this.rootGroup.add(char.group);
      char.group.position.copy(cfg.start);
      this.pedestrians.push({
        instance: char,
        startPos: cfg.start,
        endPos: cfg.end,
        progress: Math.random(),
        speed: cfg.speed
      });
    });
  }

  public update(delta: number) {
    for (let i = 0; i < this.vehicles.length; i++) {
      const v = this.vehicles[i];
      const target = v.waypoints[v.currentWaypointIdx];
      _vTarget.copy(target);

      const pos = v.instance.group.position;
      _vDir.subVectors(_vTarget, pos);

      const dist = Math.hypot(_vDir.x, _vDir.z);

      if (dist < 2.0) {
        v.currentWaypointIdx = (v.currentWaypointIdx + 1) % v.waypoints.length;
      } else {
        _vDir.normalize();
        const moveDist = v.speed * delta;
        pos.x += _vDir.x * moveDist;
        pos.z += _vDir.z * moveDist;
        pos.y = _vTarget.y;

        const targetRot = Math.atan2(_vDir.x, _vDir.z);
        v.instance.group.rotation.y = THREE.MathUtils.damp(
          v.instance.group.rotation.y,
          targetRot,
          8,
          delta
        );

        const wheelAngle = moveDist / 0.38;
        for (let w = 0; w < v.instance.allWheels.length; w++) {
          v.instance.allWheels[w].rotation.x += wheelAngle;
        }
      }
    }

    for (let p = 0; p < this.pedestrians.length; p++) {
      const ped = this.pedestrians[p];
      ped.progress += (ped.speed * delta) / 40;
      if (ped.progress > 1.0) ped.progress = 0;

      const pingPong = Math.sin(ped.progress * Math.PI);
      ped.instance.group.position.lerpVectors(ped.startPos, ped.endPos, pingPong);

      if (ped.progress < 0.5) {
        ped.instance.group.lookAt(ped.endPos.x, ped.instance.group.position.y, ped.endPos.z);
      } else {
        ped.instance.group.lookAt(ped.startPos.x, ped.instance.group.position.y, ped.startPos.z);
      }

      ped.instance.updateAnimation(delta, ped.speed, true);
    }
  }
}
