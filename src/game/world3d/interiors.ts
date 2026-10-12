/**
 * LOKOJA LIFE — Interior Definitions (INC 4 "life inside")
 * ---------------------------------------------------------
 * Pure, deterministic definitions of the enterable interiors: your own
 * flat at Home, Mama's buka at the Food Strip and the Kpata provision
 * store. Rooms, wall segments (with real doorway gaps), furniture and
 * the interaction hotspots are ALL data — so geometry, collision and
 * rendering can never disagree, and the whole layer is unit-testable
 * (scripts/test-world3d.ts BFS-pathability).
 *
 * Coordinates are interior-local METRES, origin at the room centre,
 * floor at y = 0. +x is east, +z is south (three.js ground plane).
 * Nothing here mutates game state and nothing knows about the economy.
 */

/* --------------------------------- furniture -------------------------------- */

export type FurnKind =
  | 'bed' | 'wardrobe' | 'stove' | 'fridge' | 'sofa' | 'tv'
  | 'table' | 'chair' | 'shelf' | 'counter' | 'bench' | 'shower'
  | 'mirror' | 'rug' | 'mat' | 'crate' | 'pot' | 'fan' | 'menu'
  // Stage 5-b — gym / bank / lounge fittings
  | 'dumbbell-rack' | 'bench-press' | 'treadmill' | 'mirror-strip'
  | 'sign' | 'ceilingfan' | 'vault' | 'partition' | 'queueboard'
  | 'booth' | 'bottle-shelf' | 'dj-deck' | 'speaker' | 'drink-table'
  // Stage 7 — school fittings (the classroom experience)
  | 'school-desk' | 'blackboard' | 'wallmap' | 'computer'
  // Stage 8 — the great schools: universities + laboratories + hostels
  | 'bunk' | 'locker' | 'lab-bench' | 'fume-hood' | 'basin'
  | 'specimen-cabinet' | 'microscope' | 'skeleton' | 'dissection-table'
  | 'podium' | 'riser' | 'machine'

export interface FurnFootprint {
  /** local width (x) at scale 1 */
  w: number
  /** local depth (z) at scale 1 */
  d: number
  /** blocks walking */
  solid: boolean
  /** visual height (m) */
  h: number
}

export const FURN_FOOTPRINT: Record<FurnKind, FurnFootprint> = {
  bed: { w: 2.1, d: 1.5, solid: true, h: 0.55 },
  wardrobe: { w: 1.2, d: 0.6, solid: true, h: 2.0 },
  stove: { w: 0.9, d: 0.65, solid: true, h: 0.9 },
  fridge: { w: 0.8, d: 0.75, solid: true, h: 1.75 },
  sofa: { w: 2.2, d: 0.95, solid: true, h: 0.85 },
  tv: { w: 1.5, d: 0.45, solid: true, h: 1.1 },
  table: { w: 1.4, d: 0.9, solid: true, h: 0.75 },
  chair: { w: 0.5, d: 0.5, solid: true, h: 0.9 },
  shelf: { w: 1.8, d: 0.45, solid: true, h: 1.9 },
  counter: { w: 2.8, d: 0.9, solid: true, h: 0.95 },
  bench: { w: 1.6, d: 0.45, solid: true, h: 0.45 },
  shower: { w: 1.0, d: 1.0, solid: true, h: 0.25 },
  mirror: { w: 0.9, d: 0.35, solid: true, h: 1.9 },
  rug: { w: 2.6, d: 1.8, solid: false, h: 0.02 },
  mat: { w: 1.1, d: 0.65, solid: false, h: 0.02 },
  crate: { w: 0.7, d: 0.7, solid: true, h: 0.6 },
  pot: { w: 0.4, d: 0.4, solid: false, h: 0.35 },
  fan: { w: 0.4, d: 0.4, solid: false, h: 1.3 },
  menu: { w: 1.1, d: 0.12, solid: false, h: 0.8 },
  // Stage 5-b — gym / bank / lounge fittings
  'dumbbell-rack': { w: 1.7, d: 0.55, solid: true, h: 1.0 },
  'bench-press': { w: 1.5, d: 0.7, solid: true, h: 1.35 },
  treadmill: { w: 0.85, d: 1.95, solid: true, h: 1.25 },
  'mirror-strip': { w: 2.4, d: 0.1, solid: false, h: 1.9 },
  sign: { w: 1.7, d: 0.08, solid: false, h: 0.7 },
  ceilingfan: { w: 1.3, d: 1.3, solid: false, h: 0.5 },
  vault: { w: 1.7, d: 0.35, solid: true, h: 2.25 },
  partition: { w: 2.9, d: 0.12, solid: true, h: 1.95 },
  queueboard: { w: 0.95, d: 0.35, solid: true, h: 1.7 },
  booth: { w: 1.75, d: 0.95, solid: true, h: 1.05 },
  'bottle-shelf': { w: 3.2, d: 0.42, solid: true, h: 2.1 },
  'dj-deck': { w: 1.7, d: 0.85, solid: true, h: 1.05 },
  speaker: { w: 0.55, d: 0.55, solid: true, h: 1.45 },
  'drink-table': { w: 0.85, d: 0.85, solid: true, h: 0.78 },
  // Stage 7 — school fittings
  'school-desk': { w: 1.5, d: 0.62, solid: true, h: 0.75 },
  blackboard: { w: 2.6, d: 0.14, solid: false, h: 1.25 },
  wallmap: { w: 1.5, d: 0.1, solid: false, h: 1.0 },
  computer: { w: 0.85, d: 0.62, solid: false, h: 0.95 },
  // Stage 8 — the great schools
  bunk: { w: 2.05, d: 1.05, solid: true, h: 1.75 },
  locker: { w: 0.55, d: 0.6, solid: true, h: 1.8 },
  'lab-bench': { w: 2.3, d: 0.9, solid: true, h: 0.95 },
  'fume-hood': { w: 1.35, d: 0.85, solid: true, h: 2.25 },
  basin: { w: 0.6, d: 0.5, solid: true, h: 1.05 },
  'specimen-cabinet': { w: 1.1, d: 0.5, solid: true, h: 1.9 },
  microscope: { w: 0.3, d: 0.38, solid: false, h: 0.42 },
  skeleton: { w: 0.5, d: 0.5, solid: true, h: 1.72 },
  'dissection-table': { w: 2.0, d: 0.85, solid: true, h: 0.92 },
  podium: { w: 0.62, d: 0.5, solid: true, h: 1.18 },
  riser: { w: 3.6, d: 1.4, solid: false, h: 0.32 },
  machine: { w: 1.7, d: 0.85, solid: true, h: 1.3 },
}

export interface FurnDef {
  kind: FurnKind
  x: number
  z: number
  rotY: number
  /** footprint + visual scale multiplier (default 1) */
  s?: number
  /** palette tone index (furniture-specific palettes) */
  tone?: number
}

/* ---------------------------------- walls ----------------------------------- */

export interface WallSeg {
  x: number
  z: number
  w: number
  d: number
}

const T = 0.3 // wall thickness

/** axis-aligned wall from (ax,az) to (bx,bz) — lengths pad by T to close corners */
function wall(ax: number, az: number, bx: number, bz: number): WallSeg {
  const horiz = az === bz
  return {
    x: (ax + bx) / 2,
    z: (az + bz) / 2,
    w: horiz ? Math.abs(bx - ax) + T : T,
    d: horiz ? T : Math.abs(bz - az) + T,
  }
}

/* --------------------------------- hotspots --------------------------------- */

export type HotspotKind = 'bed' | 'stove' | 'tv' | 'bath' | 'menu' | 'shop' | 'exit'

export interface HotspotDef {
  id: string
  kind: HotspotKind
  x: number
  z: number
  /** HUD prompt text */
  label: string
}

/** Stage 5-b — self-service action hotspots (gym workout, bank teller,
 * lounge night-out, home wardrobe, school study). Kept as a SEPARATE array +
 * union so the HUD's existing HotspotKind-driven sheet contract stays untouched:
 * the InteriorScene layer owns the whole interaction for these (its own
 * prompt chip + panels) and reports `null` to the HUD while one is near.
 */
export type ActionKind = 'workout' | 'bank-teller' | 'night-out' | 'wardrobe' | 'study'

export interface ActionDef {
  id: string
  kind: ActionKind
  x: number
  z: number
  /** prompt text on the in-scene chip */
  label: string
}

/* --------------------------------- interiors -------------------------------- */

export interface RoomZone {
  name: string
  x: number
  z: number
  w: number
  d: number
}

export interface InteriorDef {
  id: string
  name: string
  /** exterior location id this interior belongs to (stable registry) */
  locationId: string
  /** overall outer footprint */
  size: { w: number; d: number }
  /** named floor zones (labels + tint variance) */
  rooms: RoomZone[]
  walls: WallSeg[]
  furniture: FurnDef[]
  hotspots: HotspotDef[]
  /** Stage 5-b — self-service action hotspots owned by the interior scene */
  actions?: ActionDef[]
  /** draw the floor as tiles (bank) instead of planks */
  floorTiles?: boolean
  /** where the player spawns inside (just through the door) */
  spawn: { x: number; z: number; facing: number }
  /** interior side of the exit door */
  door: { x: number; z: number }
  palette: { floor: string; floorAlt: string; wall: string; accent: string }
  /** the meal menu is served here (Mama's buka / home kitchen) */
  mealSpot: boolean
  /** the provisions counter is here (Kpata store) */
  shopSpot: boolean
}

/* ------------------------------- your own flat ------------------------------- */

const HOME: InteriorDef = (() => {
  const walls: WallSeg[] = [
    // perimeter — 12 × 9 m, entrance gap on the WEST wall (z −0.9..0.9)
    wall(-6, -4.5, 6, -4.5), // north
    wall(-6, 4.5, 6, 4.5), // south
    wall(6, -4.5, 6, 4.5), // east
    wall(-6, -4.5, -6, -0.9), // west, lower
    wall(-6, 0.9, -6, 4.5), // west, upper
    // inner wall A at x=2 — living ↔ back rooms, wide doorway z −3.9..−2.1
    // (gaps are declared 1.8 so they stay ≥1.5 after the wall-cap padding)
    wall(2, -4.5, 2, -3.9),
    wall(2, -2.1, 2, 4.5),
    // inner wall B at z=0.5 — bedroom ↔ kitchen+bath, doorway x 3.1..4.9
    wall(2, 0.5, 3.1, 0.5),
    wall(4.9, 0.5, 6, 0.5),
    // inner wall C at z=-1.9 — kitchen ↔ bathroom, doorway x 2.8..4.6
    wall(2, -1.9, 2.8, -1.9),
    wall(4.6, -1.9, 6, -1.9),
  ]
  return {
    id: 'home-interior',
    name: 'Your place',
    locationId: 'home',
    size: { w: 12, d: 9 },
    rooms: [
      { name: 'Living room', x: -2, z: 0, w: 8, d: 9 },
      { name: 'Bedroom', x: 4, z: 2.5, w: 4, d: 4 },
      { name: 'Kitchen', x: 4, z: -0.7, w: 4, d: 2.4 },
      { name: 'Bathroom', x: 4, z: -3.2, w: 4, d: 2.6 },
    ],
    walls,
    furniture: [
      // living room
      { kind: 'rug', x: -2.4, z: 0.5, rotY: 0, tone: 0 },
      { kind: 'sofa', x: -2.4, z: -3.6, rotY: 0, tone: 0 },
      { kind: 'tv', x: -2.4, z: 4.0, rotY: Math.PI, tone: 0 },
      { kind: 'table', x: -2.4, z: 0.6, rotY: 0, tone: 0 },
      { kind: 'chair', x: -4.9, z: -1.7, rotY: Math.PI / 2, tone: 0 },
      { kind: 'shelf', x: -5.6, z: 2.8, rotY: Math.PI / 2, tone: 0 },
      { kind: 'fan', x: -5.5, z: -3.8, rotY: Math.PI / 4, tone: 0 },
      // bedroom
      { kind: 'bed', x: 4.8, z: 3.1, rotY: 0, tone: 0 },
      { kind: 'wardrobe', x: 2.7, z: 4.0, rotY: Math.PI, tone: 0 },
      // kitchen
      { kind: 'stove', x: 5.4, z: -0.6, rotY: -Math.PI / 2, tone: 0 },
      { kind: 'pot', x: 5.4, z: -0.35, rotY: 0, tone: 0 },
      { kind: 'fridge', x: 2.6, z: -0.2, rotY: Math.PI / 2, tone: 0 },
      // bathroom
      { kind: 'shower', x: 2.8, z: -3.9, rotY: 0, tone: 0 },
      { kind: 'mirror', x: 4.6, z: -4.2, rotY: Math.PI, tone: 0 },
      // welcome mat by the door
      { kind: 'mat', x: -4.9, z: 0, rotY: 0, tone: 0 },
    ],
    hotspots: [
      { id: 'home-bed', kind: 'bed', x: 4.8, z: 1.8, label: 'Rest on the bed' },
      { id: 'home-stove', kind: 'stove', x: 4.6, z: -0.6, label: "Cook at the stove" },
      { id: 'home-tv', kind: 'tv', x: -2.4, z: 3.15, label: 'Watch some TV' },
      { id: 'home-bath', kind: 'bath', x: 4.6, z: -3.3, label: 'Freshen up' },
      { id: 'home-exit', kind: 'exit', x: -5.35, z: 0, label: 'Step outside' },
    ],
    // Stage 5-b — the bedroom wardrobe now opens your look
    actions: [
      { id: 'home-wardrobe', kind: 'wardrobe', x: 2.7, z: 3.1, label: 'Change your look' },
    ],
    spawn: { x: -3.4, z: 1.7, facing: Math.PI / 2 },
    door: { x: -5.6, z: 0 },
    palette: { floor: '#b98d5f', floorAlt: '#a87a4e', wall: '#e8dcc3', accent: '#2e7d5b' },
    mealSpot: false,
    shopSpot: false,
  }
})()

/* -------------------------------- mama's buka -------------------------------- */

const MAMAS: InteriorDef = (() => {
  const walls: WallSeg[] = [
    // 10 × 8 m, door gap on the EAST wall (z −0.9..0.9)
    wall(-5, -4, 5, -4),
    wall(-5, 4, 5, 4),
    wall(-5, -4, -5, 4),
    wall(5, -4, 5, -0.9),
    wall(5, 0.9, 5, 4),
  ]
  return {
    id: 'mamas-kitchen',
    name: "Mama's Kitchen",
    locationId: 'food-area',
    size: { w: 10, d: 8 },
    rooms: [
      { name: 'Kitchen', x: 0.8, z: 1.4, w: 8.4, d: 5.2 },
      { name: 'Seating', x: -2.2, z: -1.6, w: 5.6, d: 4.8 },
    ],
    walls,
    furniture: [
      // the long serving counter with pots
      { kind: 'counter', x: 0.6, z: 2.6, rotY: 0, s: 2.1, tone: 0 },
      { kind: 'pot', x: -0.9, z: 2.5, rotY: 0, tone: 0, s: 1.4 },
      { kind: 'pot', x: 0.7, z: 2.5, rotY: 0, tone: 1, s: 1.2 },
      { kind: 'pot', x: 2.1, z: 2.5, rotY: 0, tone: 2, s: 1.3 },
      { kind: 'stove', x: 3.6, z: 3.2, rotY: Math.PI, tone: 1 },
      { kind: 'shelf', x: -1.4, z: 3.6, rotY: Math.PI, tone: 0 },
      { kind: 'fridge', x: 4.4, z: 1.9, rotY: -Math.PI / 2, tone: 1 },
      { kind: 'menu', x: 0.6, z: 1.75, rotY: Math.PI, tone: 0 },
      // seating
      { kind: 'table', x: -2.3, z: -1.3, rotY: 0, tone: 1 },
      { kind: 'bench', x: -2.3, z: -0.35, rotY: 0, tone: 0 },
      { kind: 'bench', x: -2.3, z: -2.25, rotY: 0, tone: 0 },
      { kind: 'table', x: -4.1, z: -2.6, rotY: 0, tone: 1 },
      { kind: 'chair', x: -4.1, z: -3.4, rotY: 0, tone: 0 },
      { kind: 'crate', x: -4.5, z: 3.3, rotY: 0.3, tone: 0 },
      { kind: 'crate', x: -3.7, z: 3.5, rotY: -0.2, tone: 1 },
      { kind: 'fan', x: 4.5, z: -3.4, rotY: -Math.PI / 4, tone: 0 },
    ],
    hotspots: [
      { id: 'mamas-menu', kind: 'menu', x: 0.6, z: 1.25, label: "Order from Mama's menu" },
      { id: 'mamas-exit', kind: 'exit', x: 4.4, z: 0, label: 'Step back to the food strip' },
    ],
    spawn: { x: 3.9, z: 0, facing: -Math.PI / 2 },
    door: { x: 4.5, z: 0 },
    palette: { floor: '#9c7a4f', floorAlt: '#8a6a42', wall: '#f0e4cc', accent: '#c94f2e' },
    mealSpot: true,
    shopSpot: false,
  }
})()

/* ----------------------------- kpata provision store ---------------------------- */

const KPATA_SHOP: InteriorDef = (() => {
  const walls: WallSeg[] = [
    // 9 × 7 m, door gap on the SOUTH wall (x −0.9..0.9)
    wall(-4.5, -3.5, 4.5, -3.5),
    wall(-4.5, -3.5, -4.5, 3.5),
    wall(4.5, -3.5, 4.5, 3.5),
    wall(-4.5, 3.5, -0.9, 3.5),
    wall(0.9, 3.5, 4.5, 3.5),
  ]
  return {
    id: 'kpata-shop',
    name: 'Kpata Provision Store',
    locationId: 'kpata-market',
    size: { w: 9, d: 7 },
    rooms: [{ name: 'Shop floor', x: 0, z: 0, w: 9, d: 7 }],
    walls,
    furniture: [
      // three shelf rows with goods — the east side stays open to the door
      { kind: 'shelf', x: -0.7, z: -2.4, rotY: 0, s: 1.5, tone: 0 },
      { kind: 'shelf', x: -0.7, z: -0.3, rotY: 0, s: 1.5, tone: 1 },
      { kind: 'shelf', x: -0.7, z: 1.9, rotY: 0, s: 1.5, tone: 2 },
      // the provisions counter
      { kind: 'counter', x: 2.9, z: -2.2, rotY: Math.PI / 2, tone: 0 },
      { kind: 'crate', x: 3.9, z: -0.6, rotY: 0.2, tone: 0 },
      { kind: 'crate', x: 3.9, z: 0.2, rotY: -0.1, tone: 1 },
      { kind: 'crate', x: 3.9, z: 1.0, rotY: 0.35, tone: 2 },
      { kind: 'fridge', x: -3.9, z: 2.8, rotY: Math.PI / 2, tone: 0 },
      { kind: 'fan', x: 4.0, z: 3.0, rotY: Math.PI, tone: 0 },
    ],
    hotspots: [
      { id: 'kpata-counter', kind: 'shop', x: 2.0, z: -1.2, label: 'Buy foodstuff at the counter' },
      { id: 'kpata-exit', kind: 'exit', x: 0, z: 2.8, label: 'Step back to the market' },
    ],
    spawn: { x: 0, z: 2.75, facing: Math.PI },
    door: { x: 0, z: 3.05 },
    palette: { floor: '#ad8756', floorAlt: '#9c774a', wall: '#e2d5b8', accent: '#3a6ea3' },
    mealSpot: false,
    shopSpot: true,
  }
})()

/* ------------------------------- peak fitness gym ------------------------------- */

const GYM: InteriorDef = (() => {
  const walls: WallSeg[] = [
    // 11 × 8 m, door gap on the SOUTH wall (x −0.9..0.9)
    wall(-5.5, -4, 5.5, -4),
    wall(-5.5, -4, -5.5, 4),
    wall(5.5, -4, 5.5, 4),
    wall(-5.5, 4, -0.9, 4),
    wall(0.9, 4, 5.5, 4),
  ]
  return {
    id: 'peak-gym',
    name: 'Peak Fitness Gym',
    locationId: 'university-area',
    size: { w: 11, d: 8 },
    rooms: [
      { name: 'Weights corner', x: -3, z: -1, w: 5, d: 6 },
      { name: 'Cardio row', x: 3.2, z: -1.6, w: 4.2, d: 4.4 },
    ],
    walls,
    furniture: [
      // wall mirror strip + the house motto (both hang on the north wall)
      { kind: 'mirror-strip', x: 1.4, z: -3.83, rotY: 0, s: 1.4, tone: 0 },
      { kind: 'sign', x: -2.9, z: -3.82, rotY: 0, tone: 0 },
      // weights corner
      { kind: 'dumbbell-rack', x: -5.02, z: 0.1, rotY: -Math.PI / 2, tone: 0 },
      { kind: 'crate', x: -5.0, z: 1.9, rotY: 0.2, tone: 0 },
      { kind: 'bench-press', x: -3.3, z: -2.4, rotY: 0, tone: 0 },
      // cardio row
      { kind: 'treadmill', x: 4.5, z: -2.4, rotY: 0, tone: 0 },
      { kind: 'shelf', x: 4.0, z: -3.68, rotY: 0, s: 0.9, tone: 2 },
      { kind: 'bench', x: 4.95, z: 0.6, rotY: -Math.PI / 2, tone: 1 },
      // open floor: mats for stretching under the ceiling fan
      { kind: 'ceilingfan', x: 0, z: 0.4, rotY: 0, tone: 0 },
      { kind: 'mat', x: -1.2, z: 1.5, rotY: 0.1, tone: 0 },
      { kind: 'mat', x: 0.2, z: 1.7, rotY: -0.12, tone: 1 },
      { kind: 'fan', x: -4.9, z: 3.3, rotY: -Math.PI / 4, tone: 0 },
    ],
    hotspots: [
      { id: 'gym-exit', kind: 'exit', x: 0, z: 3.2, label: 'Step back to the campus' },
    ],
    actions: [
      { id: 'gym-workout', kind: 'workout', x: -1.5, z: -0.9, label: 'Hit a workout' },
    ],
    spawn: { x: 0, z: 2.6, facing: Math.PI },
    door: { x: 0, z: 3.55 },
    palette: { floor: '#3a3e44', floorAlt: '#2f3237', wall: '#e6ddc8', accent: '#c94f2e' },
    mealSpot: false,
    shopSpot: false,
  }
})()

/* ---------------------------- lokoja microfinance bank ---------------------------- */

const BANK: InteriorDef = (() => {
  const walls: WallSeg[] = [
    // 12 × 9 m, door gap on the SOUTH wall (x −0.9..0.9)
    wall(-6, -4.5, 6, -4.5),
    wall(-6, -4.5, -6, 4.5),
    wall(6, -4.5, 6, 4.5),
    wall(-6, 4.5, -0.9, 4.5),
    wall(0.9, 4.5, 6, 4.5),
  ]
  return {
    id: 'lokoja-microfinance',
    name: 'Lokoja Microfinance Bank',
    locationId: 'government-area',
    size: { w: 12, d: 9 },
    rooms: [
      { name: 'Banking hall', x: 0, z: 0.4, w: 12, d: 7.4 },
      { name: 'Teller row', x: 2.2, z: -2.4, w: 6.4, d: 3.4 },
    ],
    walls,
    furniture: [
      // the teller counter + glass partition, queue board beside it
      { kind: 'counter', x: 2.2, z: -2.6, rotY: 0, tone: 1 },
      { kind: 'partition', x: 2.2, z: -1.82, rotY: 0, tone: 0 },
      { kind: 'queueboard', x: 4.9, z: -2.6, rotY: -Math.PI / 2, tone: 0 },
      // the vault — back wall, very serious
      { kind: 'vault', x: -3.8, z: -4.15, rotY: 0, tone: 0 },
      // queue benches
      { kind: 'bench', x: -1.9, z: 0.9, rotY: 0, tone: 1 },
      { kind: 'bench', x: -1.9, z: 2.1, rotY: 0, tone: 1 },
      { kind: 'shelf', x: 5.6, z: 1.4, rotY: -Math.PI / 2, tone: 1 },
      { kind: 'fridge', x: 5.4, z: -4.0, rotY: -Math.PI / 2, tone: 1 },
      { kind: 'crate', x: -5.3, z: 3.7, rotY: 0.25, tone: 0 },
      { kind: 'ceilingfan', x: -2.2, z: -1.6, rotY: 0, tone: 0 },
      { kind: 'ceilingfan', x: 2.6, z: 1.6, rotY: 0, tone: 0 },
    ],
    hotspots: [
      { id: 'bank-exit', kind: 'exit', x: 0, z: 3.2, label: 'Step back to the secretariat' },
    ],
    actions: [
      { id: 'bank-teller', kind: 'bank-teller', x: 2.2, z: -1.05, label: 'Join the queue' },
    ],
    spawn: { x: 0, z: 2.6, facing: Math.PI },
    door: { x: 0, z: 4.05 },
    palette: { floor: '#cfc8b8', floorAlt: '#bfb6a2', wall: '#eee6d2', accent: '#1d5c8a' },
    floorTiles: true,
    mealSpot: false,
    shopSpot: false,
  }
})()

/* ----------------------------- golden nights lounge ------------------------------ */

const LOUNGE: InteriorDef = (() => {
  const walls: WallSeg[] = [
    // 10 × 8 m, door gap on the EAST wall (z −0.9..0.9)
    wall(-5, -4, 5, -4),
    wall(-5, 4, 5, 4),
    wall(-5, -4, -5, 4),
    wall(5, -4, 5, -0.9),
    wall(5, 0.9, 5, 4),
  ]
  return {
    id: 'golden-nights',
    name: 'Golden Nights Lounge',
    locationId: 'food-area',
    size: { w: 10, d: 8 },
    rooms: [
      { name: 'Dance floor', x: 0.4, z: -0.8, w: 7.6, d: 5.6 },
      { name: 'Bar counter', x: -1, z: 2.6, w: 6.4, d: 2.8 },
    ],
    walls,
    furniture: [
      // the dark wood bar + backlit bottle shelf
      { kind: 'counter', x: -1.0, z: 2.8, rotY: 0, s: 1.5, tone: 0 },
      { kind: 'bottle-shelf', x: -1.0, z: 3.6, rotY: 0, tone: 0 },
      { kind: 'crate', x: -4.5, z: 3.4, rotY: 0.25, tone: 0 },
      // booth seats with drink tables on the west side
      { kind: 'booth', x: -4.4, z: -0.8, rotY: Math.PI / 2, tone: 1 },
      { kind: 'booth', x: -4.4, z: -2.8, rotY: Math.PI / 2, tone: 2 },
      { kind: 'drink-table', x: -3.3, z: -0.8, rotY: 0, tone: 0 },
      { kind: 'drink-table', x: -3.3, z: -2.8, rotY: 0, tone: 0 },
      // DJ corner + speaker stacks
      { kind: 'dj-deck', x: 3.6, z: -3.3, rotY: Math.PI, tone: 0 },
      { kind: 'speaker', x: 4.55, z: -3.35, rotY: 0, tone: 0 },
      { kind: 'speaker', x: 2.4, z: -3.4, rotY: 0, tone: 1 },
      // scattered tables with glasses on the dance floor
      { kind: 'drink-table', x: 2.6, z: -1.5, rotY: 0, tone: 1 },
      { kind: 'drink-table', x: 0.6, z: 0.8, rotY: 0, tone: 0 },
      { kind: 'rug', x: 0.6, z: -0.6, rotY: 0, s: 1.3, tone: 2 },
      // accents
      { kind: 'sign', x: -2.0, z: -3.8, rotY: 0, s: 1.2, tone: 1 },
      { kind: 'fan', x: 4.4, z: 2.9, rotY: Math.PI, tone: 0 },
    ],
    hotspots: [
      { id: 'lounge-exit', kind: 'exit', x: 4.1, z: 0, label: 'Step back to the food strip' },
    ],
    actions: [
      { id: 'lounge-night-out', kind: 'night-out', x: -1.0, z: 0.9, label: 'Pull up a booth' },
    ],
    spawn: { x: 3.5, z: 0, facing: -Math.PI / 2 },
    door: { x: 4.5, z: 0 },
    palette: { floor: '#4a3524', floorAlt: '#3e2c1e', wall: '#2e2620', accent: '#e8a317' },
    mealSpot: false,
    shopSpot: false,
  }
})()

export const INTERIORS: InteriorDef[] = [HOME, MAMAS, KPATA_SHOP, GYM, BANK, LOUNGE]

/* ------------------------- school interiors (Stage 7) -------------------------
 * Registered here so INTERIOR_BY_ID stays the single source every consumer
 * already trusts. The type-only import above erased at runtime means this
 * adds no import cycle (schools → layout happens on the value side).
 * --------------------------------------------------------------------------- */
import { SCHOOL_INTERIORS } from './schools'

INTERIORS.push(...SCHOOL_INTERIORS)

export const INTERIOR_BY_ID: Record<string, InteriorDef> = Object.fromEntries(
  INTERIORS.map((i) => [i.id, i]),
)

/* --------------------------------- collision -------------------------------- */

export interface InteriorBox {
  cx: number
  cz: number
  hw: number
  hd: number
  cos: number
  sin: number
  rotY: number
}

/** all solid boxes (walls + solid furniture) for one interior, world-local */
export function interiorColliders(def: InteriorDef): InteriorBox[] {
  const boxes: InteriorBox[] = []
  for (const w of def.walls) {
    boxes.push({ cx: w.x, cz: w.z, hw: w.w / 2, hd: w.d / 2, cos: 1, sin: 0, rotY: 0 })
  }
  for (const f of def.furniture) {
    const fp = FURN_FOOTPRINT[f.kind]
    if (!fp.solid) continue
    const s = f.s ?? 1
    boxes.push({
      cx: f.x,
      cz: f.z,
      hw: (fp.w * s) / 2 + 0.08,
      hd: (fp.d * s) / 2 + 0.08,
      cos: Math.cos(-f.rotY),
      sin: Math.sin(-f.rotY),
      rotY: f.rotY,
    })
  }
  return boxes
}

const COLLIDER_CACHE = new Map<string, InteriorBox[]>()

/** cached colliders — interiors are immutable so this is safe and fast */
export function collidersFor(def: InteriorDef): InteriorBox[] {
  let c = COLLIDER_CACHE.get(def.id)
  if (!c) {
    c = interiorColliders(def)
    COLLIDER_CACHE.set(def.id, c)
  }
  return c
}

/** push a circle out of an oriented box (same math as the world resolver) */
function resolveBox(x: number, z: number, r: number, b: InteriorBox): [number, number] {
  const dx = x - b.cx
  const dz = z - b.cz
  const lx = dx * b.cos - dz * b.sin
  const lz = dx * b.sin + dz * b.cos
  const clampedX = Math.max(-b.hw, Math.min(b.hw, lx))
  const clampedZ = Math.max(-b.hd, Math.min(b.hd, lz))
  const ox = lx - clampedX
  const oz = lz - clampedZ
  const dist2 = ox * ox + oz * oz
  if (dist2 > r * r) return [x, z]
  if (dist2 > 1e-6) {
    const dist = Math.sqrt(dist2)
    const push = (r - dist) / dist
    const rx = ox * push
    const rz = oz * push
    const wcos = Math.cos(b.rotY)
    const wsin = Math.sin(b.rotY)
    return [x + (rx * wcos - rz * wsin), z + (rx * wsin + rz * wcos)]
  }
  const dxFace = b.hw - Math.abs(lx)
  const dzFace = b.hd - Math.abs(lz)
  if (dxFace < dzFace) {
    const nl = lx >= 0 ? b.hw + r : -b.hw - r
    const rx = nl - lx
    const wcos = Math.cos(b.rotY)
    const wsin = Math.sin(b.rotY)
    return [x + rx * wcos, z + rx * wsin]
  }
  const nl = lz >= 0 ? b.hd + r : -b.hd - r
  const rz = nl - lz
  const wcos = Math.cos(b.rotY)
  const wsin = Math.sin(b.rotY)
  return [x + -rz * wsin, z + rz * wcos]
}

/** interior player radius — slimmer than outdoors for tight home lanes */
export const INTERIOR_PLAYER_RADIUS = 0.42

/**
 * Resolve a would-be interior position into a legal one:
 * furniture/wall push-out, then a hard clamp to the room bounds.
 */
export function resolveInteriorPosition(
  def: InteriorDef,
  x: number,
  z: number,
  r: number = INTERIOR_PLAYER_RADIUS,
): [number, number] {
  for (const b of collidersFor(def)) {
    const dx = x - b.cx
    const dz = z - b.cz
    if (dx * dx + dz * dz > (b.hw + b.hd + r) ** 2) continue
    ;[x, z] = resolveBox(x, z, r, b)
  }
  const hx = def.size.w / 2 - r - 0.05
  const hz = def.size.d / 2 - r - 0.05
  x = Math.max(-hx, Math.min(hx, x))
  z = Math.max(-hz, Math.min(hz, z))
  return [x, z]
}
