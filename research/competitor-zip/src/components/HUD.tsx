import React, { useState } from 'react';
import { PlayerMode, PlayerStats, TimeOfDay, PassengerMission } from '../types';
import { soundSystem } from '../audio/soundSystem';
import {
  Radio,
  Sun,
  Moon,
  Sunset,
  Volume2,
  VolumeX,
  Compass,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Car,
  User,
  Zap,
  Navigation
} from 'lucide-react';

interface HUDProps {
  stats: PlayerStats;
  playerMode: PlayerMode;
  speedKmH: number;
  timeOfDay: TimeOfDay;
  onTimeChange: (time: TimeOfDay) => void;
  onTogglePlayerMode: () => void;
  onOpenHelp: () => void;
  nearbyZoneName: string | null;
  onInteract: () => void;
  activeMission: PassengerMission | null;
  onAcceptMission: () => void;
  onTouchJoystick: (x: number, y: number) => void;
  onTouchAction: (action: 'accelerate' | 'brake' | 'horn', active: boolean) => void;
  onHonk: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  playerMode,
  speedKmH,
  timeOfDay,
  onTimeChange,
  onTogglePlayerMode,
  onOpenHelp,
  nearbyZoneName,
  onInteract,
  activeMission,
  onAcceptMission,
  onTouchJoystick,
  onTouchAction,
  onHonk
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [radioStation, setRadioStation] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const stations = [
    'Confluence FM 94.0 (Afrobeats & Amapiano)',
    'Mount Patti Radio (Lokoja Highlife & Groove)',
    'River Niger Chill Waves (Confluence Ambience)'
  ];

  const handleToggleRadio = () => {
    const playing = soundSystem.toggleRadio();
    setIsRadioPlaying(playing);
  };

  const handleNextStation = () => {
    const next = (radioStation + 1) % 3;
    setRadioStation(next);
    soundSystem.setRadioStation(next);
  };

  const handleToggleMute = () => {
    const muted = soundSystem.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-40 select-none flex flex-col justify-between p-3 md:p-6 overflow-hidden">
      {/* --- TOP HEADER BAR --- */}
      <div className="flex items-start justify-between w-full gap-2">
        {/* Left: Branding & Stats */}
        <div className="flex flex-col gap-2">
          {/* Brand Pill */}
          <div className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 bg-slate-900/90 border border-emerald-500/30 rounded-xl shadow-lg">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-white text-base shadow">
              ₦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-sm md:text-base text-emerald-400">
                  LOKOJA LIFE 3D
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
                  {stats.hustleRank}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                The Confluence City • Niger & Benue • Mount Patti
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="pointer-events-auto flex items-center gap-3 px-4 py-2 bg-slate-900/90 border border-slate-700/60 rounded-xl shadow-md text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <span className="text-slate-400 font-normal">Balance:</span>
              <span className="text-sm">₦{stats.naira.toLocaleString()}</span>
            </div>

            <div className="w-px h-4 bg-slate-700" />

            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${stats.energy}%` }}
                />
              </div>
              <span className="text-slate-300 font-medium">{stats.energy}%</span>
            </div>

            <div className="w-px h-4 bg-slate-700" />

            <div className="flex items-center gap-1 text-purple-300">
              <span className="text-slate-400">Cred:</span>
              <span className="font-bold">{stats.streetCred}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Settings & Mission Tracker */}
        <div className="flex flex-col items-end gap-2">
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-2 bg-slate-900/90 border border-slate-700/60 rounded-xl shadow-md text-xs">
            {/* Time of Day */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => onTimeChange('morning')}
                title="Confluence Morning Dawn"
                className={`p-1.5 rounded ${timeOfDay === 'morning' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onTimeChange('noon')}
                title="Sunny Noon"
                className={`p-1.5 rounded ${timeOfDay === 'noon' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                <Sun className="w-3.5 h-3.5 text-yellow-300" />
              </button>
              <button
                onClick={() => onTimeChange('sunset')}
                title="Mount Patti Golden Sunset"
                className={`p-1.5 rounded ${timeOfDay === 'sunset' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Sunset className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onTimeChange('night')}
                title="Lokoja Night"
                className={`p-1.5 rounded ${timeOfDay === 'night' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mute audio */}
            <button
              onClick={handleToggleMute}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Help / Controls */}
            <button
              onClick={onOpenHelp}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              title="Controls & Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Lokoja Commuter Mission Card */}
          {activeMission && (
            <div className="pointer-events-auto max-w-xs p-3 bg-slate-900/90 border border-emerald-500/40 rounded-xl shadow-lg text-xs space-y-1">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 animate-bounce" />
                  {activeMission.status === 'available' ? 'NEW COMMUTER' : 'IN TRANSIT'}
                </span>
                <span>₦{activeMission.fare.toLocaleString()}</span>
              </div>
              <div className="text-slate-300">
                <strong>{activeMission.passengerName}</strong>: {activeMission.pickupLocation} ➔ {activeMission.dropoffLocation}
              </div>
              {activeMission.status === 'available' ? (
                <button
                  onClick={onAcceptMission}
                  className="w-full mt-1.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-center transition"
                >
                  Accept Passenger (₦{activeMission.fare.toLocaleString()})
                </button>
              ) : (
                <div className="text-[11px] text-amber-300 italic pt-0.5">
                  Drive to destination stop in Lokoja to collect fare!
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- CENTER INTERACTION PROMPT --- */}
      {nearbyZoneName && (
        <div className="pointer-events-auto mx-auto mb-4 px-6 py-3 bg-slate-900/95 border-2 border-emerald-400 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-7 h-7 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-sm">
            E
          </div>
          <div>
            <div className="text-xs text-emerald-300 font-semibold uppercase tracking-wider">Nearby Location</div>
            <div className="text-sm font-bold text-white">{nearbyZoneName}</div>
          </div>
          <button
            onClick={onInteract}
            className="ml-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition"
          >
            Enter / Action
          </button>
        </div>
      )}

      {/* --- COLLAPSIBLE BOTTOM CONTROL DOCK (UNDER 15% VIEWPORT FOOTPRINT) --- */}
      <div className="pointer-events-auto mx-auto w-full max-w-4xl flex flex-col items-center">
        {/* Toggle Drawer Button */}
        <button
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="px-4 py-1 bg-slate-900/90 border-t border-x border-slate-700/70 rounded-t-xl text-slate-300 text-xs font-semibold flex items-center gap-1.5 hover:text-white transition shadow"
        >
          {isDockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" /> Show Controls & Confluence Radio
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" /> Hide Dock (Zen Mode)
            </>
          )}
        </button>

        {!isDockCollapsed && (
          <div className="w-full p-3 md:p-4 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* 1. Confluence FM Radio Player */}
            <div className="flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/70 rounded-xl px-3 py-2">
              <button
                onClick={handleToggleRadio}
                className={`p-2 rounded-lg transition ${
                  isRadioPlaying ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
                title="Play/Stop Confluence Radio"
              >
                <Radio className="w-4 h-4" />
              </button>
              <div className="flex flex-col max-w-[180px] md:max-w-[220px]">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>CONFLUENCE FM</span>
                  <button
                    onClick={handleNextStation}
                    className="text-emerald-400 hover:underline font-bold text-[10px]"
                  >
                    Next Station ➔
                  </button>
                </div>
                <div className="truncate font-semibold text-white text-xs">
                  {isRadioPlaying ? stations[radioStation] : 'Radio Off (Click Play)'}
                </div>
              </div>
            </div>

            {/* 2. Speedometer & Mode Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/70 rounded-xl px-3.5 py-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-medium">SPEED</span>
                  <span className="font-black text-sm text-white">{speedKmH} <span className="text-[10px] font-normal text-slate-400">KM/H</span></span>
                </div>
              </div>

              {/* Mode switch */}
              <button
                onClick={onTogglePlayerMode}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/70 rounded-xl text-white transition font-medium"
              >
                {playerMode === 'on_foot' ? (
                  <>
                    <Car className="w-4 h-4 text-emerald-400" />
                    <span>Drive Bus</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-sky-400" />
                    <span>Get Out (Foot)</span>
                  </>
                )}
              </button>

              {/* Horn Action */}
              <button
                onClick={onHonk}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition shadow flex items-center gap-1.5"
              >
                <span>HORN</span>
                <span className="text-[10px] bg-emerald-600/40 px-1 rounded text-slate-900 font-mono">H</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MOBILE TOUCH CONTROLS --- */}
      <div className="pointer-events-auto md:hidden fixed bottom-20 left-4 right-4 flex items-end justify-between pointer-events-none">
        <div className="pointer-events-auto grid grid-cols-3 gap-1 bg-slate-900/80 p-2 rounded-2xl border border-slate-700/70">
          <div />
          <button
            onPointerDown={() => onTouchJoystick(0, -1)}
            onPointerUp={() => onTouchJoystick(0, 0)}
            className="w-12 h-12 bg-slate-800 active:bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold"
          >
            ▲
          </button>
          <div />
          <button
            onPointerDown={() => onTouchJoystick(-1, 0)}
            onPointerUp={() => onTouchJoystick(0, 0)}
            className="w-12 h-12 bg-slate-800 active:bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold"
          >
            ◀
          </button>
          <button
            onPointerDown={() => onTouchJoystick(0, 1)}
            onPointerUp={() => onTouchJoystick(0, 0)}
            className="w-12 h-12 bg-slate-800 active:bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold"
          >
            ▼
          </button>
          <button
            onPointerDown={() => onTouchJoystick(1, 0)}
            onPointerUp={() => onTouchJoystick(0, 0)}
            className="w-12 h-12 bg-slate-800 active:bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold"
          >
            ▶
          </button>
        </div>

        <div className="pointer-events-auto flex flex-col gap-2">
          <button
            onPointerDown={() => onTouchAction('accelerate', true)}
            onPointerUp={() => onTouchAction('accelerate', false)}
            className="w-14 h-14 bg-emerald-600 active:bg-emerald-500 rounded-2xl text-white font-bold text-xs shadow-lg flex items-center justify-center"
          >
            GAS
          </button>
          <button
            onPointerDown={() => onTouchAction('brake', true)}
            onPointerUp={() => onTouchAction('brake', false)}
            className="w-14 h-14 bg-rose-600 active:bg-rose-500 rounded-2xl text-white font-bold text-xs shadow-lg flex items-center justify-center"
          >
            BRAKE
          </button>
        </div>
      </div>
    </div>
  );
};
