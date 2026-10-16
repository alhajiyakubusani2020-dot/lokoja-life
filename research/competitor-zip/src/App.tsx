import React, { useEffect, useRef, useState } from 'react';
import { LagosScene } from './game/LagosScene';
import { HUD } from './components/HUD';
import { InteractionsModal } from './components/InteractionsModal';
import { ActiveModal, PassengerMission, PlayerMode, PlayerStats, TimeOfDay } from './types';
import { soundSystem } from './audio/soundSystem';
import { InteractiveZone } from './world/cityBuilder';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<LagosScene | null>(null);

  // Player Stats & State
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    naira: 25000,
    energy: 95,
    streetCred: 40,
    hustleRank: 'Confluence Pilot',
    passengersServed: 3,
    ownedVehicles: ['bus', 'keke'],
    activeVehicle: 'bus',
    apartment: 'None (Felele Quarters)'
  });

  const [playerMode, setPlayerMode] = useState<PlayerMode>('driving_bus');
  const [speedKmH, setSpeedKmH] = useState<number>(0);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('sunset');
  const [nearbyZone, setNearbyZone] = useState<InteractiveZone | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [notification, setNotification] = useState<string | null>(
    "Welcome to Lokoja Life! Explore where River Niger meets River Benue, climb Mount Patti & drive Nataco!"
  );

  // Lokoja Commuter Missions
  const [activeMission, setActiveMission] = useState<PassengerMission | null>({
    id: 'mission_lokoja_1',
    passengerName: 'Mallam Haruna',
    pickupLocation: 'Nataco Interstate Terminal Stop',
    dropoffLocation: 'Confluence Beach & Bridge Stop',
    pickupCoord: [-10, 20],
    dropoffCoord: [10, 32],
    fare: 6500,
    tipBonus: 1500,
    status: 'available'
  });

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new LagosScene(mountRef.current, {
      onZoneEnter: (zone) => {
        setNearbyZone(zone);
      },
      onZoneExit: () => {
        setNearbyZone(null);
      },
      onVehicleToggle: (mode) => {
        setPlayerMode(mode);
      },
      onSpeedUpdate: (kmh) => {
        setSpeedKmH(kmh);
      }
    });

    sceneRef.current = scene;
    scene.setTimeOfDay(timeOfDay);

    const handleFirstGesture = () => {
      soundSystem.ensureContext();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);

    return () => {
      scene.dispose();
      sceneRef.current = null;
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  const handleTimeChange = (time: TimeOfDay) => {
    setTimeOfDay(time);
    sceneRef.current?.setTimeOfDay(time);
  };

  const handleTogglePlayerMode = () => {
    if (sceneRef.current) {
      sceneRef.current.handleInteractOrToggle();
    }
  };

  const handleHonk = () => {
    sceneRef.current?.triggerHorn();
  };

  const handleInteract = () => {
    if (!nearbyZone) return;

    if (nearbyZone.type === 'catfish_joint') {
      setActiveModal('catfish_joint');
    } else if (nearbyZone.type === 'mount_patti') {
      setActiveModal('mount_patti');
    } else if (nearbyZone.type === 'nataco_haulage') {
      setActiveModal('nataco_haulage');
    } else if (nearbyZone.type === 'auto_garage') {
      setActiveModal('auto_garage');
    } else if (nearbyZone.type === 'confluence_villa') {
      setActiveModal('confluence_villa');
    } else if (nearbyZone.type === 'bus_stop') {
      handleBusStopInteraction(nearbyZone);
    }
  };

  const handleBusStopInteraction = (zone: InteractiveZone) => {
    if (!activeMission) {
      const destinations = [
        { name: 'Confluence Beach & Bridge Stop', coord: [10, 32] as [number, number], fare: 7500 },
        { name: 'Mount Patti Base Junction', coord: [-10, 85] as [number, number], fare: 9000 },
        { name: 'Ganaja Flyover Interchange', coord: [10, 140] as [number, number], fare: 12500 }
      ];
      const dest = destinations[Math.floor(Math.random() * destinations.length)];
      const names = ['Hajiya Fatima', 'Engr. Danjuma', 'Blessing from FULokoja', 'Alhaji Bello'];
      const pName = names[Math.floor(Math.random() * names.length)];

      setActiveMission({
        id: `mission_${Date.now()}`,
        passengerName: pName,
        pickupLocation: zone.name,
        dropoffLocation: dest.name,
        pickupCoord: [zone.position.x, zone.position.z],
        dropoffCoord: dest.coord,
        fare: dest.fare,
        tipBonus: 2000,
        status: 'available'
      });
      notify(`New passenger waiting at ${zone.name}!`);
    } else if (activeMission.status === 'in_transit') {
      const dist = Math.hypot(
        zone.position.x - activeMission.dropoffCoord[0],
        zone.position.z - activeMission.dropoffCoord[1]
      );
      if (dist < 15.0) {
        soundSystem.playCashChime();
        const total = activeMission.fare + activeMission.tipBonus;
        setPlayerStats(prev => ({
          ...prev,
          naira: prev.naira + total,
          streetCred: prev.streetCred + 25,
          passengersServed: prev.passengersServed + 1,
          hustleRank: prev.passengersServed >= 5 ? 'Confluence Kingpin' : 'Nataco Transporter'
        }));
        notify(`Trip completed! ${activeMission.passengerName} paid ₦${total.toLocaleString()}!`);
        setActiveMission(null);
      } else {
        notify(`This is ${zone.name}. Passenger is heading to ${activeMission.dropoffLocation}!`);
      }
    }
  };

  const handleAcceptMission = () => {
    if (!activeMission) return;
    setActiveMission({
      ...activeMission,
      status: 'in_transit'
    });
    soundSystem.playDanfoHorn();
    notify(`Passenger boarded! Head towards ${activeMission.dropoffLocation}!`);
  };

  const updateStats = (newStats: Partial<PlayerStats>) => {
    setPlayerStats(prev => ({ ...prev, ...newStats }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* 3D Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD */}
      <HUD
        stats={playerStats}
        playerMode={playerMode}
        speedKmH={speedKmH}
        timeOfDay={timeOfDay}
        onTimeChange={handleTimeChange}
        onTogglePlayerMode={handleTogglePlayerMode}
        onOpenHelp={() => setActiveModal('controls_help')}
        nearbyZoneName={nearbyZone?.name ?? null}
        onInteract={handleInteract}
        activeMission={activeMission}
        onAcceptMission={handleAcceptMission}
        onTouchJoystick={(x, y) => sceneRef.current?.setTouchJoystick(x, y)}
        onTouchAction={(action, active) => sceneRef.current?.setTouchAction(action, active)}
        onHonk={handleHonk}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-slate-900/95 border border-emerald-400/80 rounded-xl text-emerald-300 font-bold text-xs md:text-sm shadow-2xl flex items-center gap-2">
          <span>🔔</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Interaction Modals */}
      <InteractionsModal
        modal={activeModal}
        onClose={() => setActiveModal(null)}
        playerStats={playerStats}
        onUpdateStats={updateStats}
        onNotification={notify}
      />
    </div>
  );
}
