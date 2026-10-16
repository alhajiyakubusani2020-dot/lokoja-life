export type TimeOfDay = 'morning' | 'noon' | 'sunset' | 'night';

export type PlayerMode = 'on_foot' | 'driving_bus' | 'driving_keke';

export interface PassengerMission {
  id: string;
  passengerName: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupCoord: [number, number]; // x, z
  dropoffCoord: [number, number]; // x, z
  fare: number;
  tipBonus: number;
  status: 'available' | 'in_transit' | 'completed';
}

export interface PlayerStats {
  naira: number;
  energy: number; // 0 - 100
  streetCred: number;
  hustleRank: string;
  passengersServed: number;
  ownedVehicles: string[];
  activeVehicle: 'bus' | 'keke';
  apartment: string;
}

export type ActiveModal =
  | null
  | 'catfish_joint'
  | 'mount_patti'
  | 'nataco_haulage'
  | 'auto_garage'
  | 'confluence_villa'
  | 'controls_help';
