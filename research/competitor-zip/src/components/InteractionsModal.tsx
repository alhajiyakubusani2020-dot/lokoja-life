import React, { useState } from 'react';
import { ActiveModal, PlayerStats } from '../types';
import { soundSystem } from '../audio/soundSystem';
import {
  Utensils,
  Mountain,
  Truck,
  Wrench,
  Building2,
  X,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';

interface ModalProps {
  modal: ActiveModal;
  onClose: () => void;
  playerStats: PlayerStats;
  onUpdateStats: (newStats: Partial<PlayerStats>) => void;
  onNotification: (msg: string) => void;
}

export const InteractionsModal: React.FC<ModalProps> = ({
  modal,
  onClose,
  playerStats,
  onUpdateStats,
  onNotification
}) => {
  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="relative w-full max-w-xl bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {modal === 'catfish_joint' && (
          <CatfishJointContent
            stats={playerStats}
            onUpdate={onUpdateStats}
            notify={onNotification}
          />
        )}

        {modal === 'mount_patti' && (
          <MountPattiContent
            stats={playerStats}
            onUpdate={onUpdateStats}
            notify={onNotification}
          />
        )}

        {modal === 'nataco_haulage' && (
          <NatacoHaulageContent
            stats={playerStats}
            onUpdate={onUpdateStats}
            notify={onNotification}
          />
        )}

        {modal === 'auto_garage' && (
          <AutoGarageContent
            stats={playerStats}
            onUpdate={onUpdateStats}
            notify={onNotification}
          />
        )}

        {modal === 'confluence_villa' && (
          <ConfluenceVillaContent
            stats={playerStats}
            onUpdate={onUpdateStats}
            notify={onNotification}
          />
        )}

        {modal === 'controls_help' && <ControlsHelpContent />}
      </div>
    </div>
  );
};

// 1. Mama Halima's Confluence Catfish Joint
const CatfishJointContent: React.FC<{
  stats: PlayerStats;
  onUpdate: (s: Partial<PlayerStats>) => void;
  notify: (m: string) => void;
}> = ({ stats, onUpdate, notify }) => {
  const dishes = [
    {
      name: 'Fresh River Niger Giant Catfish Pepper Soup',
      desc: 'Freshly caught River Niger point-and-kill catfish spiced with aromatic calabash nutmeg and scent leaves.',
      cost: 4500,
      energyGain: 60
    },
    {
      name: 'Hot Tuwo Shinkafa & Miyan Kuka',
      desc: 'Northern staple soft rice tuwo served with fragrant baobab kuka soup and tender braised beef.',
      cost: 3800,
      energyGain: 50
    },
    {
      name: 'Chilled Confluence Zobo & Ginger Brew',
      desc: 'Refreshing spiced hibiscus beverage with natural ginger and clove extract.',
      cost: 1500,
      energyGain: 25
    }
  ];

  const buyFood = (dish: typeof dishes[0]) => {
    if (stats.naira < dish.cost) {
      notify("Oga, your money never reach! Run more trips around Lokoja.");
      return;
    }
    soundSystem.playCashChime();
    onUpdate({
      naira: stats.naira - dish.cost,
      energy: Math.min(100, stats.energy + dish.energyGain)
    });
    notify(`Chowed ${dish.name}! Energy +${dish.energyGain}%`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="p-3 bg-amber-950 text-amber-400 rounded-xl">
          <Utensils className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-400">Mama Halima Catfish Joint</h2>
          <p className="text-xs text-slate-400">Fresh River Niger Delicacies • Confluence Flavours</p>
        </div>
      </div>

      <div className="grid gap-3">
        {dishes.map((dish, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="font-semibold text-amber-200">{dish.name}</div>
              <div className="text-xs text-slate-400 max-w-sm">{dish.desc}</div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 pt-1">
                <Zap className="w-3.5 h-3.5" /> Energy +{dish.energyGain}%
              </div>
            </div>
            <button
              onClick={() => buyFood(dish)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition"
            >
              ₦{dish.cost.toLocaleString()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Mount Patti Historic Tourism (Flora Shaw 1897 & Lord Lugard)
const MountPattiContent: React.FC<{
  stats: PlayerStats;
  onUpdate: (s: Partial<PlayerStats>) => void;
  notify: (m: string) => void;
}> = ({ stats, onUpdate, notify }) => {
  const [guiding, setGuiding] = useState(false);
  const [toursCompleted, setToursCompleted] = useState(0);

  const startTour = () => {
    soundSystem.playSizzle();
    setGuiding(true);
    setTimeout(() => {
      soundSystem.playCashChime();
      const fee = 12000;
      onUpdate({
        naira: stats.naira + fee,
        streetCred: stats.streetCred + 35,
        energy: Math.max(0, stats.energy - 10)
      });
      setGuiding(false);
      setToursCompleted(c => c + 1);
      notify(`Tour finished! Tourists enjoyed the Confluence view. Earned ₦${fee.toLocaleString()}!`);
    }, 1800);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="p-3 bg-sky-950 text-sky-400 rounded-xl">
          <Mountain className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-sky-400">Mount Patti Summit (458m)</h2>
          <p className="text-xs text-slate-400">Birthplace of the name "Nigeria" (Flora Shaw, 1897) • Lugard Rest House</p>
        </div>
      </div>

      <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl text-center space-y-4">
        <div className="text-slate-300 text-sm">
          Tourist Expeditions Guided: <span className="font-bold text-sky-400">{toursCompleted}</span>
        </div>

        <div className="h-32 bg-slate-950 rounded-xl flex items-center justify-center border border-sky-900/40 relative overflow-hidden p-4">
          {!guiding ? (
            <div className="text-slate-300 text-xs leading-relaxed max-w-md">
              From this 458-meter summit, observe the glorious Y-shaped confluence where the brownish River Niger meets the greenish River Benue!
            </div>
          ) : (
            <div className="text-center animate-pulse">
              <Sparkles className="w-8 h-8 text-sky-400 mx-auto" />
              <span className="text-sky-300 font-bold text-sm">Guiding visitors through Lord Lugard's Colonial Rest House...</span>
            </div>
          )}
        </div>

        <button
          disabled={guiding || stats.energy < 10}
          onClick={startTour}
          className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl transition"
        >
          {guiding ? 'Tour in Progress...' : 'Guide Confluence Tourist Group (Earn ₦12,000)'}
        </button>
      </div>
    </div>
  );
};

// 3. Nataco Interstate Haulage & Logistics Hub
const NatacoHaulageContent: React.FC<{
  stats: PlayerStats;
  onUpdate: (s: Partial<PlayerStats>) => void;
  notify: (m: string) => void;
}> = ({ stats, onUpdate, notify }) => {
  const [dispatching, setDispatching] = useState(false);

  const logisticsContracts = [
    { title: 'Lokoja to Abuja Fast Transit Shuttle', payout: 38000, cred: 30 },
    { title: 'Obajana Cement Heavy Haulage Dispatch', payout: 85000, cred: 60 },
    { title: 'North-South Interstate Passenger Manifest', payout: 140000, cred: 95 }
  ];

  const doContract = (c: typeof logisticsContracts[0]) => {
    soundSystem.playKeyboardType();
    setDispatching(true);
    setTimeout(() => {
      soundSystem.playCashChime();
      onUpdate({
        naira: stats.naira + c.payout,
        streetCred: stats.streetCred + c.cred,
        energy: Math.max(0, stats.energy - 15)
      });
      setDispatching(false);
      notify(`Haulage dispatched! Earned ₦${c.payout.toLocaleString()} commission!`);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="p-3 bg-amber-950 text-amber-400 rounded-xl">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-amber-400">Nataco Interstate Junction</h2>
          <p className="text-xs text-slate-400">The Central Transport Crossroads of Nigeria</p>
        </div>
      </div>

      <div className="grid gap-3">
        {logisticsContracts.map((c, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-amber-200">{c.title}</div>
              <div className="text-xs text-slate-400">Commission: <span className="text-emerald-400 font-bold">₦{c.payout.toLocaleString()}</span> • Cred +{c.cred}</div>
            </div>
            <button
              disabled={dispatching || stats.energy < 15}
              onClick={() => doContract(c)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-lg text-sm transition"
            >
              {dispatching ? 'Routing...' : 'Dispatch'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. Ganaja Auto Workshop
const AutoGarageContent: React.FC<{
  stats: PlayerStats;
  onUpdate: (s: Partial<PlayerStats>) => void;
  notify: (m: string) => void;
}> = ({ stats, onUpdate, notify }) => {
  const upgrades = [
    { name: 'Heavy-Duty Shock Absorbers', cost: 42000, desc: 'Smooths out Ganaja road potholes and unpaved terrain.' },
    { name: 'Confluence High-Beam Fog Spotlights', cost: 28000, desc: 'Pierce through morning river mist and night haze.' },
    { name: 'Confluence Stage 2 Interstate Turbo Engine', cost: 85000, desc: 'Boosts bus top speed by +25% on the Abuja expressway.' }
  ];

  const buyUpgrade = (u: typeof upgrades[0]) => {
    if (stats.naira < u.cost) {
      notify("Oga, your money never reach! Run more passenger trips.");
      return;
    }
    soundSystem.playCashChime();
    onUpdate({
      naira: stats.naira - u.cost,
      streetCred: stats.streetCred + 30
    });
    notify(`Installed ${u.name}! Vehicle tuned!`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl">
          <Wrench className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-400">Ganaja Auto Workshop</h2>
          <p className="text-xs text-slate-400">Tuning & upgrades for your Lokoja Bus & Keke</p>
        </div>
      </div>

      <div className="grid gap-3">
        {upgrades.map((u, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-emerald-200">{u.name}</div>
              <div className="text-xs text-slate-400">{u.desc}</div>
            </div>
            <button
              onClick={() => buyUpgrade(u)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition"
            >
              ₦{u.cost.toLocaleString()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Confluence View Villa
const ConfluenceVillaContent: React.FC<{
  stats: PlayerStats;
  onUpdate: (s: Partial<PlayerStats>) => void;
  notify: (m: string) => void;
}> = ({ stats, onUpdate, notify }) => {
  const rent = () => {
    if (stats.naira < 220000) {
      notify("Oga, Confluence Hillside Villa is for big bosses! You need ₦220,000.");
      return;
    }
    soundSystem.playCashChime();
    onUpdate({
      naira: stats.naira - 220000,
      apartment: 'Confluence Hillside Panorama Villa',
      streetCred: stats.streetCred + 150,
      hustleRank: 'Kogi Big Boy'
    });
    notify("Keys handed over! You now own a luxury Confluence residence!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="p-3 bg-teal-950 text-teal-400 rounded-xl">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-teal-400">Confluence Hillside Real Estate</h2>
          <p className="text-xs text-slate-400">Luxury hilltop villa overlooking the River Niger & Benue</p>
        </div>
      </div>

      <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-3">
        <div className="text-sm font-semibold text-teal-300">Confluence Panorama Villa with 24/7 Power</div>
        <div className="text-xs text-slate-300 leading-relaxed">
          Unobstructed view of Mount Patti and the meeting of the two rivers. Includes private speedboat jetty and multi-car parking.
        </div>
        <div className="text-sm text-slate-400">
          Annual Lease: <span className="text-teal-400 font-bold text-base">₦220,000</span>
        </div>
        <button
          onClick={rent}
          className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl transition"
        >
          Lease Villa (₦220,000)
        </button>
      </div>
    </div>
  );
};

// 6. Controls Help
const ControlsHelpContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-emerald-400">Lokoja Life 3D Controls & Guide</h2>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-slate-800 rounded-lg">
          <div className="font-bold text-white mb-1">Bus & Keke Driving</div>
          <div className="text-slate-400">W / Up : Accelerate</div>
          <div className="text-slate-400">S / Down : Brake & Reverse</div>
          <div className="text-slate-400">A / D : Steer Left / Right</div>
          <div className="text-slate-400">H : Horn ("PIM-PIM!")</div>
          <div className="text-slate-400">E : Enter / Exit Vehicle & Interact</div>
        </div>
        <div className="p-3 bg-slate-800 rounded-lg">
          <div className="font-bold text-white mb-1">On Foot Exploration</div>
          <div className="text-slate-400">WASD : Walk Around</div>
          <div className="text-slate-400">Shift : Sprint / Run</div>
          <div className="text-slate-400">Mouse Drag : Orbit Camera</div>
          <div className="text-slate-400">E : Enter Bus or Shop</div>
        </div>
      </div>
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-200">
        💡 <strong>Confluence Highlights:</strong> Climb Mount Patti to see where Flora Shaw named Nigeria, cross the Jamata Confluence Bridge, eat fresh River Niger Catfish at Mama Halima's, and take interstate transit gigs at Nataco!
      </div>
    </div>
  );
};
