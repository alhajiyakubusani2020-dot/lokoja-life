import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildLagosCity, CityWorld, InteractiveZone } from '../world/cityBuilder';
import { createLokojaBus, createKekeNapep, VehicleInstance } from '../entities/vehicleModels';
import { createCharacter, CharacterInstance } from '../entities/characterModel';
import { TrafficSystem } from '../world/trafficSystem';
import { soundSystem } from '../audio/soundSystem';
import { PlayerMode, TimeOfDay } from '../types';

const _vCamTarget = new THREE.Vector3();
const _vCamIdeal = new THREE.Vector3();
const _vForward = new THREE.Vector3();
const _vMove = new THREE.Vector3();

export interface LagosSceneCallbacks {
  onZoneEnter: (zone: InteractiveZone) => void;
  onZoneExit: () => void;
  onVehicleToggle: (mode: PlayerMode) => void;
  onSpeedUpdate: (speedKmH: number) => void;
}

export class LagosScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  // Environment & Lighting
  private dirLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private cityWorld: CityWorld;
  private trafficSystem: TrafficSystem;

  // Player Entities
  private playerCharacter: CharacterInstance;
  private playerBus: VehicleInstance;
  private playerKeke: VehicleInstance;
  private playerMode: PlayerMode = 'driving_bus'; // Start right inside the Lokoja Confluence Bus!

  // Driving Physics State
  private vehicleSpeed = 0;
  private vehicleHeading = 0;
  private vehicleSteer = 0;
  private maxForwardSpeed = 22; // m/s ~ 80 km/h
  private maxReverseSpeed = -7;
  private acceleration = 16;
  private braking = 28;
  private friction = 6.0;

  // On-foot Physics State
  private footSpeed = 5.5; // m/s
  private footRunSpeed = 9.5;
  private footHeading = 0;

  // Input State
  private keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    horn: false,
    interact: false
  };

  private touchInput = {
    x: 0,
    y: 0,
    accelerate: false,
    brake: false,
    horn: false
  };

  // Camera Orbit State
  private cameraDistance = 8.5;
  private cameraHeight = 3.8;
  private cameraAngle = 0;
  private isPointerDown = false;
  private previousPointerX = 0;
  private previousPointerY = 0;

  // Particles
  private particleGroup: THREE.Group;
  private particles: { mesh: THREE.Mesh; life: number; maxLife: number; vel: THREE.Vector3 }[] = [];

  // Interaction State
  private activeZone: InteractiveZone | null = null;
  private callbacks: LagosSceneCallbacks;
  private clock = new THREE.Clock();
  private animFrameId: number | null = null;
  private isDisposed = false;

  constructor(container: HTMLElement, callbacks: LagosSceneCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      800
    );

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 3. Studio Environment Map (RoomEnvironment via PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig & Confluence Savanna Atmosphere
    this.hemiLight = new THREE.HemisphereLight(0xfffaed, 0x43523d, 1.2);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xfff7e6, 2.4);
    this.dirLight.position.set(60, 90, 50);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 280;
    this.dirLight.shadow.camera.left = -60;
    this.dirLight.shadow.camera.right = 60;
    this.dirLight.shadow.camera.top = 60;
    this.dirLight.shadow.camera.bottom = -60;
    this.dirLight.shadow.bias = -0.0005;
    this.dirLight.shadow.normalBias = 0.02;
    this.scene.add(this.dirLight);

    this.scene.fog = new THREE.FogExp2(0xdfe6dc, 0.0035);
    this.scene.background = new THREE.Color(0xdfe6dc);

    // 5. Build Lokoja Confluence City
    this.cityWorld = buildLagosCity();
    this.scene.add(this.cityWorld.rootGroup);

    // 6. Spawn Player Entities
    this.playerBus = createLokojaBus(true);
    this.playerBus.group.position.set(0, 0, 55);
    this.scene.add(this.playerBus.group);

    this.playerKeke = createKekeNapep(true);
    this.playerKeke.group.position.set(12, 0, 48);
    this.scene.add(this.playerKeke.group);

    this.playerCharacter = createCharacter(true);
    this.playerCharacter.group.position.set(0, 0, 55);
    this.scene.add(this.playerCharacter.group);

    this.setPlayerMode('driving_bus');

    // 7. Traffic & Pedestrians
    this.trafficSystem = new TrafficSystem(this.scene);

    // 8. Particles
    this.particleGroup = new THREE.Group();
    this.scene.add(this.particleGroup);

    // 9. Event Listeners
    this.initEventListeners();

    // 10. Start Loop
    this.animate();
  }

  private initEventListeners() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
  }

  private onResize = () => {
    if (!this.container || this.isDisposed) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.keys.sprint = true;
        break;
      case 'KeyH':
        this.triggerHorn();
        break;
      case 'KeyE':
        this.handleInteractOrToggle();
        break;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.keys.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.keys.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.keys.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.keys.right = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.keys.sprint = false;
        break;
    }
  };

  private onPointerDown = (e: PointerEvent) => {
    this.isPointerDown = true;
    this.previousPointerX = e.clientX;
    this.previousPointerY = e.clientY;
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isPointerDown) return;
    const dx = e.clientX - this.previousPointerX;
    const dy = e.clientY - this.previousPointerY;
    this.cameraAngle -= dx * 0.005;
    this.cameraHeight = THREE.MathUtils.clamp(this.cameraHeight + dy * 0.02, 1.5, 9.0);
    this.previousPointerX = e.clientX;
    this.previousPointerY = e.clientY;
  };

  private onPointerUp = () => {
    this.isPointerDown = false;
  };

  public setTouchJoystick(x: number, y: number) {
    this.touchInput.x = x;
    this.touchInput.y = y;
  }

  public setTouchAction(action: 'accelerate' | 'brake' | 'horn', active: boolean) {
    if (action === 'accelerate') this.touchInput.accelerate = active;
    if (action === 'brake') this.touchInput.brake = active;
    if (action === 'horn' && active) this.triggerHorn();
  }

  public triggerHorn() {
    soundSystem.playDanfoHorn();
  }

  public handleInteractOrToggle() {
    if (this.activeZone) {
      this.callbacks.onZoneEnter(this.activeZone);
      return;
    }

    if (this.playerMode === 'on_foot') {
      const pPos = this.playerCharacter.group.position;
      const dDist = pPos.distanceTo(this.playerBus.group.position);
      const kDist = pPos.distanceTo(this.playerKeke.group.position);

      if (dDist < 5.0) {
        this.setPlayerMode('driving_bus');
      } else if (kDist < 5.0) {
        this.setPlayerMode('driving_keke');
      }
    } else {
      this.setPlayerMode('on_foot');
    }
  }

  public setPlayerMode(mode: PlayerMode) {
    this.playerMode = mode;
    this.vehicleSpeed = 0;

    if (mode === 'on_foot') {
      const activeVeh = this.playerMode === 'driving_bus' ? this.playerBus : this.playerKeke;
      this.playerCharacter.group.position.copy(activeVeh.group.position).add(new THREE.Vector3(-1.8, 0, 0));
      this.playerCharacter.group.visible = true;
      this.cameraDistance = 5.5;
      this.cameraHeight = 2.4;
      soundSystem.stopEngine();
    } else if (mode === 'driving_bus') {
      this.playerCharacter.group.visible = false;
      this.playerBus.group.visible = true;
      this.cameraDistance = 9.2;
      this.cameraHeight = 4.2;
    } else if (mode === 'driving_keke') {
      this.playerCharacter.group.visible = false;
      this.playerKeke.group.visible = true;
      this.cameraDistance = 7.5;
      this.cameraHeight = 3.6;
    }

    this.callbacks.onVehicleToggle(mode);
  }

  public setTimeOfDay(time: TimeOfDay) {
    if (time === 'morning') {
      this.hemiLight.color.setHex(0xffedd5);
      this.hemiLight.groundColor.setHex(0x43523d);
      this.hemiLight.intensity = 1.1;
      this.dirLight.color.setHex(0xfed7aa);
      this.dirLight.position.set(70, 45, 60);
      this.dirLight.intensity = 2.0;
      this.scene.background = new THREE.Color(0xfef3c7);
      this.scene.fog = new THREE.FogExp2(0xfef3c7, 0.003);
      this.setStreetlights(false);
    } else if (time === 'noon') {
      this.hemiLight.color.setHex(0xfffaed);
      this.hemiLight.groundColor.setHex(0x43523d);
      this.hemiLight.intensity = 1.3;
      this.dirLight.color.setHex(0xffffff);
      this.dirLight.position.set(30, 95, 30);
      this.dirLight.intensity = 2.6;
      this.scene.background = new THREE.Color(0xcffafe);
      this.scene.fog = new THREE.FogExp2(0xe0f2fe, 0.0025);
      this.setStreetlights(false);
    } else if (time === 'sunset') {
      // Confluence Sunset over Mount Patti & River Niger
      this.hemiLight.color.setHex(0xf97316);
      this.hemiLight.groundColor.setHex(0x312e81);
      this.hemiLight.intensity = 0.95;
      this.dirLight.color.setHex(0xe11d48);
      this.dirLight.position.set(-80, 25, 40);
      this.dirLight.intensity = 2.2;
      this.scene.background = new THREE.Color(0xfb7185);
      this.scene.fog = new THREE.FogExp2(0xfda4af, 0.0035);
      this.setStreetlights(true);
    } else {
      // Lokoja Night
      this.hemiLight.color.setHex(0x1e1b4b);
      this.hemiLight.groundColor.setHex(0x020617);
      this.hemiLight.intensity = 0.35;
      this.dirLight.color.setHex(0x60a5fa);
      this.dirLight.position.set(40, 70, -20);
      this.dirLight.intensity = 0.45;
      this.scene.background = new THREE.Color(0x0a0f1d);
      this.scene.fog = new THREE.FogExp2(0x0f172a, 0.005);
      this.setStreetlights(true);
    }
  }

  private setStreetlights(enabled: boolean) {
    this.cityWorld.streetlights.forEach(light => {
      light.intensity = enabled ? 1.8 : 0;
    });
    [this.playerBus, this.playerKeke].forEach(v => {
      v.headlights.forEach(h => {
        h.intensity = enabled ? 2.2 : 0.4;
      });
    });
  }

  private emitExhaustPuff(pos: THREE.Vector3) {
    if (this.particles.length > 40) return;
    const geo = new THREE.SphereGeometry(0.12, 6, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.6
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    this.particleGroup.add(mesh);
    this.particles.push({
      mesh,
      life: 0,
      maxLife: 0.8,
      vel: new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.8 + Math.random() * 0.5, (Math.random() - 0.5) * 0.4)
    });
  }

  private updateParticles(delta: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += delta;
      p.mesh.position.addScaledVector(p.vel, delta);
      p.mesh.scale.multiplyScalar(1.0 + delta * 1.5);
      const ratio = 1 - p.life / p.maxLife;
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, ratio * 0.6);

      if (p.life >= p.maxLife) {
        this.particleGroup.remove(p.mesh);
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
        this.particles.splice(i, 1);
      }
    }
  }

  private getRoadHeight(x: number, z: number): number {
    // Jamata Confluence Bridge
    if (Math.abs(x) < 8.2) {
      if (z <= 8 && z >= -98) {
        return 5.12;
      }
      if (z > 8 && z <= 24) {
        const t = (24 - z) / 16;
        return t * 5.12;
      }
      if (z < -98 && z >= -114) {
        const t = (z - (-114)) / 16;
        return t * 5.12;
      }
    }
    return 0;
  }

  private animate = () => {
    if (this.isDisposed) return;
    this.animFrameId = requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);

    if (this.playerMode === 'on_foot') {
      this.updatePlayerFoot(delta);
    } else {
      this.updatePlayerVehicle(delta);
    }

    this.trafficSystem.update(delta);

    // River Niger & River Benue wave vertex ripple
    const time = this.clock.getElapsedTime();
    [this.cityWorld.waterNigerMesh, this.cityWorld.waterBenueMesh].forEach((mesh, idx) => {
      if (mesh) {
        const posAttr = mesh.geometry.attributes.position;
        const phase = idx * 1.5;
        for (let i = 0; i < posAttr.count; i++) {
          const u = posAttr.getX(i);
          const v = posAttr.getY(i);
          posAttr.setZ(i, Math.sin(u * 0.15 + time * 1.8 + phase) * 0.12 + Math.cos(v * 0.2 + time * 1.4) * 0.08);
        }
        posAttr.needsUpdate = true;
      }
    });

    this.updateParticles(delta);
    this.updateCamera(delta);
    this.checkInteractiveZones();

    this.renderer.render(this.scene, this.camera);
  };

  private updatePlayerVehicle(delta: number) {
    const isBus = this.playerMode === 'driving_bus';
    const vehicle = isBus ? this.playerBus : this.playerKeke;

    let forwardInput = 0;
    if (this.keys.forward || this.touchInput.accelerate || this.touchInput.y < -0.2) forwardInput += 1;
    if (this.keys.backward || this.touchInput.brake || this.touchInput.y > 0.2) forwardInput -= 1;

    let steerInput = 0;
    if (this.keys.left || this.touchInput.x < -0.2) steerInput += 1;
    if (this.keys.right || this.touchInput.x > 0.2) steerInput -= 1;

    if (forwardInput > 0) {
      this.vehicleSpeed += this.acceleration * forwardInput * delta;
      if (this.vehicleSpeed > this.maxForwardSpeed) this.vehicleSpeed = this.maxForwardSpeed;
    } else if (forwardInput < 0) {
      if (this.vehicleSpeed > 0.5) {
        this.vehicleSpeed -= this.braking * delta;
      } else {
        this.vehicleSpeed -= this.acceleration * 0.6 * delta;
        if (this.vehicleSpeed < this.maxReverseSpeed) this.vehicleSpeed = this.maxReverseSpeed;
      }
    } else {
      if (this.vehicleSpeed > 0) {
        this.vehicleSpeed = Math.max(0, this.vehicleSpeed - this.friction * delta);
      } else if (this.vehicleSpeed < 0) {
        this.vehicleSpeed = Math.min(0, this.vehicleSpeed + this.friction * delta);
      }
    }

    const steerResponse = isBus ? 1.6 : 2.4;
    const speedFactor = Math.min(Math.abs(this.vehicleSpeed) / 5, 1.0);
    this.vehicleSteer = THREE.MathUtils.damp(
      this.vehicleSteer,
      steerInput * 0.48,
      12,
      delta
    );

    if (Math.abs(this.vehicleSpeed) > 0.1) {
      const turnDir = this.vehicleSpeed >= 0 ? 1 : -1;
      this.vehicleHeading += this.vehicleSteer * steerResponse * speedFactor * turnDir * delta;
    }

    _vForward.set(Math.sin(this.vehicleHeading), 0, Math.cos(this.vehicleHeading));
    const dist = this.vehicleSpeed * delta;
    vehicle.group.position.addScaledVector(_vForward, dist);
    vehicle.group.rotation.y = this.vehicleHeading;

    const groundY = this.getRoadHeight(vehicle.group.position.x, vehicle.group.position.z);
    vehicle.group.position.y = THREE.MathUtils.damp(vehicle.group.position.y, groundY, 14, delta);

    vehicle.frontWheels.forEach(w => {
      w.rotation.y = this.vehicleSteer * 0.9;
    });

    const wheelSpin = dist / 0.38;
    vehicle.allWheels.forEach(w => {
      w.rotation.x += wheelSpin;
    });

    const rollAngle = -this.vehicleSteer * (this.vehicleSpeed / this.maxForwardSpeed) * 0.18;
    vehicle.chassis.rotation.z = THREE.MathUtils.damp(vehicle.chassis.rotation.z, rollAngle, 10, delta);

    const speedRatio = Math.abs(this.vehicleSpeed) / this.maxForwardSpeed;
    soundSystem.updateEngineSound(speedRatio, true);

    if (forwardInput > 0 && Math.random() < 0.3) {
      const worldExhaust = vehicle.exhaustPos.clone().applyMatrix4(vehicle.group.matrixWorld);
      this.emitExhaustPuff(worldExhaust);
    }

    const kmh = Math.round(Math.abs(this.vehicleSpeed) * 3.6);
    this.callbacks.onSpeedUpdate(kmh);
  }

  private updatePlayerFoot(delta: number) {
    const char = this.playerCharacter;

    let mx = 0;
    let mz = 0;
    if (this.keys.forward || this.touchInput.y < -0.2) mz += 1;
    if (this.keys.backward || this.touchInput.y > 0.2) mz -= 1;
    if (this.keys.left || this.touchInput.x < -0.2) mx += 1;
    if (this.keys.right || this.touchInput.x > 0.2) mx -= 1;

    const isMoving = mx !== 0 || mz !== 0;
    const currentSpeed = this.keys.sprint ? this.footRunSpeed : this.footSpeed;

    if (isMoving) {
      _vMove.set(mx, 0, mz).normalize();

      const forwardAngle = this.cameraAngle + Math.PI;
      const moveX = _vMove.x * Math.cos(forwardAngle) + _vMove.z * Math.sin(forwardAngle);
      const moveZ = -_vMove.x * Math.sin(forwardAngle) + _vMove.z * Math.cos(forwardAngle);

      const moveDist = currentSpeed * delta;
      char.group.position.x += moveX * moveDist;
      char.group.position.z += moveZ * moveDist;

      this.footHeading = Math.atan2(moveX, moveZ);
      char.group.rotation.y = THREE.MathUtils.damp(char.group.rotation.y, this.footHeading, 12, delta);

      if (Math.random() < 0.08) {
        soundSystem.playFootstep();
      }
    }

    const groundY = this.getRoadHeight(char.group.position.x, char.group.position.z);
    char.group.position.y = THREE.MathUtils.damp(char.group.position.y, groundY, 14, delta);

    char.updateAnimation(delta, currentSpeed, isMoving);
    this.callbacks.onSpeedUpdate(isMoving ? (this.keys.sprint ? 14 : 6) : 0);
  }

  private updateCamera(delta: number) {
    const targetEntity =
      this.playerMode === 'on_foot'
        ? this.playerCharacter.group
        : this.playerMode === 'driving_bus'
        ? this.playerBus.group
        : this.playerKeke.group;

    _vCamTarget.copy(targetEntity.position);
    _vCamTarget.y += this.playerMode === 'on_foot' ? 1.4 : 1.8;

    let heading = this.cameraAngle;
    if (this.playerMode !== 'on_foot') {
      heading = this.vehicleHeading + this.cameraAngle;
    }

    const dist = this.cameraDistance + (Math.abs(this.vehicleSpeed) / this.maxForwardSpeed) * 3.0;
    _vCamIdeal.set(
      _vCamTarget.x - Math.sin(heading) * dist,
      _vCamTarget.y + this.cameraHeight,
      _vCamTarget.z - Math.cos(heading) * dist
    );

    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, _vCamIdeal.x, 8, delta);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, _vCamIdeal.y, 8, delta);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, _vCamIdeal.z, 8, delta);

    this.camera.lookAt(_vCamTarget);
  }

  private checkInteractiveZones() {
    const playerPos =
      this.playerMode === 'on_foot'
        ? this.playerCharacter.group.position
        : this.playerBus.group.position;

    let nearestZone: InteractiveZone | null = null;
    let minDist = Infinity;

    for (const zone of this.cityWorld.interactiveZones) {
      const d = playerPos.distanceTo(zone.position);
      if (d <= zone.radius && d < minDist) {
        minDist = d;
        nearestZone = zone;
      }
    }

    if (nearestZone !== this.activeZone) {
      this.activeZone = nearestZone;
      if (nearestZone) {
        this.callbacks.onZoneEnter(nearestZone);
      } else {
        this.callbacks.onZoneExit();
      }
    }
  }

  public getPlayerPosition(): THREE.Vector3 {
    return this.playerMode === 'on_foot'
      ? this.playerCharacter.group.position
      : this.playerBus.group.position;
  }

  public dispose() {
    this.isDisposed = true;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    soundSystem.stopEngine();

    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);

    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);

    this.renderer.dispose();
  }
}
