/**
 * LOKOJA LIFE — G2 SPACES: per-location action boards
 * ---------------------------------------------------
 * Every location in LOCATIONS gets a real board of things to do. THE
 * HONESTY LAW of this file: a row that mutates the game NAMES the real
 * door it rides — a store action on useGameStore (verified by
 * scripts/test-m21-spaces.ts against the live store surface). A row with
 * no honest door is kind 'view' and stays informational. No fake
 * mutations, no invented naira — the few cost/effect numbers shown are
 * copied from src/game/data/config.ts where the door itself prices the
 * move (NEEDS.rest, INTERIOR.relax/gym/study/lounge, NIGHT_OUT.cost).
 *
 * Wiring: LocationSheet renders this board. 'needs' rows whose door takes
 * no location context (rest/relaxIndoors/workout/study) fire the real
 * store action when the player stands in the location; 'spend'/'earn'
 * rows stay descriptive provenance (their real doors live in the systems
 * that already own them: Work tab, phone apps, the world HUD panels).
 */

export type LocActionKind = 'needs' | 'spend' | 'earn' | 'view'

export interface LocAction {
  key: string
  label: string
  emoji: string
  kind: LocActionKind
  /** display-only naira chip — the door itself always prices the move */
  cost?: number
  /** descriptive needs delta for display (real values from config) */
  effects?: Partial<Record<'health' | 'energy' | 'hunger' | 'mood', number>>
  /** the REAL store action this row rides — must exist on useGameStore */
  door?: string
  /** optional argument for the door (rest kind, relax kind, …) */
  arg?: string
  /** honest note for informational rows */
  note?: string
}

export const LOC_ACTIONS: Record<string, LocAction[]> = {
  /* ------------------------------ the launch ten ------------------------------ */
  home: [
    { key: 'nap', label: 'Take a nap', emoji: '😴', kind: 'needs', door: 'rest', arg: 'nap', effects: { energy: 22, hunger: -8, mood: 4, health: 2 } },
    { key: 'sleep', label: 'Sleep till morning', emoji: '🌙', kind: 'needs', door: 'rest', arg: 'sleep', effects: { energy: 100, hunger: -22, mood: 12, health: 8 } },
    { key: 'bath', label: 'Freshen up', emoji: '🚿', kind: 'needs', door: 'relaxIndoors', arg: 'bath', effects: { mood: 5, energy: 5, hunger: -3 } },
    { key: 'tv', label: 'Watch some TV', emoji: '📺', kind: 'needs', door: 'relaxIndoors', arg: 'tv', effects: { mood: 8, energy: 3, hunger: -3 } },
    { key: 'rent', label: 'Settle the rent', emoji: '🧾', kind: 'spend', door: 'payRent', note: 'The landlord respects a tenant who pays early.' },
  ],
  'kpata-market': [
    { key: 'hustles', label: 'Search for hustles', emoji: '📋', kind: 'earn', door: 'searchHustles', note: 'Traders always need a runner — the Work tab holds the offers.' },
    { key: 'shop', label: 'Buy foodstuff', emoji: '🛒', kind: 'spend', door: 'eatMeal', note: 'The provision counter rides today\u2019s market price.' },
    { key: 'ram', label: 'Ram market (Eid)', emoji: '🐏', kind: 'spend', door: 'buyRam', note: 'Seasonal — the butchers come with the festival.' },
    { key: 'asoebi', label: 'Buy aso-ebi fabric', emoji: '🧵', kind: 'spend', door: 'buyAsoEbi', note: 'Once a wedding is announced, the fabric sells fast.' },
    { key: 'bargain', label: 'Learn the traders\u2019 prices', emoji: '⚖️', kind: 'view', note: 'Stand still long enough and you will hear the real price of everything.' },
  ],
  'ganaja-junction': [
    { key: 'hustles', label: 'Search for hustles', emoji: '📋', kind: 'earn', door: 'searchHustles', note: 'Delivery riders gather where the roads meet.' },
    { key: 'gist', label: 'Catch the junction gist', emoji: '🗣️', kind: 'view', note: 'Every road into Lokoja drops its news here first.' },
    { key: 'suya', label: 'Join the suya queue', emoji: '🍢', kind: 'spend', door: 'eatMeal', note: 'The mallam knows regulars by their order.' },
  ],
  confluence: [
    { key: 'sand', label: 'Buy Crusher sand', emoji: '🪣', kind: 'spend', door: 'buySand', note: 'The sand dealers\u2019 line moves with the river.' },
    { key: 'canoe', label: 'Buy the fishermen\u2019s canoe', emoji: '🛶', kind: 'spend', door: 'buyCanoe', note: 'One canoe, and the ferry gigs open.' },
    { key: 'ferry-gig', label: 'Run a ferry gig', emoji: '⛴️', kind: 'earn', door: 'runFerryGig', note: 'Passengers pay the surge fare when the road is cut.' },
    { key: 'tolls', label: 'Collect the toll bowl', emoji: '🪙', kind: 'earn', door: 'collectTolls', note: 'Your walkway, your earnings — stand on it to collect.' },
    { key: 'view', label: 'Watch the two rivers meet', emoji: '🌊', kind: 'view', note: 'Free of charge, and worth every minute.' },
  ],
  'mount-patti': [
    { key: 'hike', label: 'Climb the trail', emoji: '🥾', kind: 'needs', door: 'workout', effects: { energy: -14, mood: 8, health: 6, hunger: -8 } },
    { key: 'summit', label: 'Sit at the summit', emoji: '🌄', kind: 'view', note: 'The whole city in one look — bring water.' },
    { key: 'history', label: 'Walk the old rest house', emoji: '🏛️', kind: 'view', note: 'The hill has watched every visitor since 1860.' },
  ],
  'historic-lokoja': [
    { key: 'tour', label: 'Walk the relic trail', emoji: '🚶', kind: 'view', note: 'Lugard\u2019s rest house, the old cemetery, the first administrative blocks.' },
    { key: 'museum', label: 'Hear the curator\u2019s stories', emoji: '🖼️', kind: 'view', note: 'Lokoja was the capital of the Northern Protectorate — the streets remember.' },
    { key: 'photography', label: 'Photograph the ruins', emoji: '📸', kind: 'view', note: 'Morning light loves these walls.' },
  ],
  'government-area': [
    { key: 'nepa', label: 'Settle the light bill', emoji: '💡', kind: 'spend', door: 'payNepa', note: 'Free at the office window; the phone adds a convenience fee.' },
    { key: 'kgirs', label: 'Clear your tax', emoji: '🧾', kind: 'spend', door: 'payKgirs', note: 'The revenue office forgives nobody\u2019s paperwork.' },
    { key: 'efcc', label: 'File a whistleblower tip', emoji: '📋', kind: 'view', door: 'fileEfccTip', note: 'Walk into the zonal command in person.' },
    { key: 'bank', label: 'Join the bank queue', emoji: '🏦', kind: 'view', door: 'bankWithdraw', note: 'ATM or POS agent — scarcity days price both.' },
  ],
  'university-area': [
    { key: 'gym', label: 'Hit the campus gym', emoji: '💪', kind: 'needs', door: 'workout', effects: { energy: -14, mood: 8, health: 6, hunger: -8 } },
    { key: 'hustles', label: 'Search for hustles', emoji: '📋', kind: 'earn', door: 'searchHustles', note: 'Tutorials, photography, moving-day gigs.' },
    { key: 'network', label: 'Meet the students', emoji: '🎓', kind: 'view', note: 'Every second person has an idea that needs one more partner.' },
  ],
  'food-area': [
    { key: 'eat', label: 'Eat a proper meal', emoji: '🍲', kind: 'spend', door: 'eatMeal', note: 'Mama\u2019s menu rides the day\u2019s market price.' },
    { key: 'night-out', label: 'Night out at the lounge', emoji: '🍾', kind: 'spend', cost: 2500, door: 'nightOut', effects: { energy: -6, mood: 14, hunger: -4 } },
    { key: 'hustles', label: 'Search for hustles', emoji: '📋', kind: 'earn', door: 'searchHustles', note: 'Emergency deliveries — somebody is always hungry.' },
  ],
  'transport-area': [
    { key: 'gigs', label: 'Check the gig board', emoji: '🧰', kind: 'earn', door: 'runGig', note: 'Your garage becomes today\u2019s work.' },
    { key: 'garage', label: 'Visit the garage', emoji: '🔧', kind: 'view', note: 'Buy, sell or fuel your ride — the park controls the yards.' },
    { key: 'paving', label: 'Give to the paving pool', emoji: '🧱', kind: 'spend', door: 'contributePaving', note: 'The town union paved it once — they remember who helped.' },
  ],

  /* -------------------------------- the schools ------------------------------- */
  'ful-felele': [
    { key: 'lecture', label: 'Sit a lecture at the Twin Theatre', emoji: '🎓', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'library', label: 'Read at the e-learning centre', emoji: '📚', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'network', label: 'Greet the faculty crowd', emoji: '🤝', kind: 'view', note: 'The permanent site rewards whoever shows their face.' },
  ],
  'ful-adankolo': [
    { key: 'lecture', label: 'Sit a lecture', emoji: '🎓', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'library', label: 'Read in the library', emoji: '📚', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'campus-walk', label: 'Walk the old campus', emoji: '🚶', kind: 'view', note: 'The university\u2019s first home — modest, proud, remembered.' },
  ],
  'ksp-felele': [
    { key: 'workshop', label: 'Hang around the workshops', emoji: '🔧', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'lecture', label: 'Sit a lecture', emoji: '📐', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'poly-gist', label: 'Hear the poly gist', emoji: '🗣️', kind: 'view', note: 'Poly students know every shortcut in town.' },
  ],
  'salem-university': [
    { key: 'chapel-hour', label: 'Join the chapel hour', emoji: '🙏', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'library', label: 'Study in the hall', emoji: '📚', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'walk', label: 'Walk the quiet campus', emoji: '🌳', kind: 'view', note: 'The calmest compound on the Felele side.' },
  ],
  'college-nursing': [
    { key: 'demo', label: 'Watch the clinical demo', emoji: '🩺', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'notes', label: 'Swap lecture notes', emoji: '📝', kind: 'view', note: 'Nursing students trade notes like currency.' },
    { key: 'gates', label: 'Respect the gate hour', emoji: '🚪', kind: 'view', note: 'The matron closes the gate sharp — every day, no gist.' },
  ],
  'crowther-memorial': [
    { key: 'class', label: 'Sit a class', emoji: '📏', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'assembly', label: 'Watch the assembly ground', emoji: '🏫', kind: 'view', note: 'Old college discipline — lines straight, voices loud.' },
    { key: 'history', label: 'Ask about Bishop Crowther', emoji: '🕊️', kind: 'view', note: 'The school wears a founding father\u2019s name with pride.' },
  ],
  'gyb-model-adankolo': [
    { key: 'class', label: 'Sit a class', emoji: '📏', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'sciences', label: 'Peek at the science labs', emoji: '🔬', kind: 'view', note: 'Model-school laboratories, well kept and serious.' },
    { key: 'gist', label: 'Hear the school gist', emoji: '🗣️', kind: 'view', note: 'Teenagers run the loudest news network in Adankolo.' },
  ],
  'faithview-academy': [
    { key: 'class', label: 'Sit a class', emoji: '📏', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'prep', label: 'Sit the prep hour', emoji: '📚', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'avenue', label: 'Walk Faithview Avenue', emoji: '🏘️', kind: 'view', note: 'The academy gave the whole avenue its name.' },
  ],
  'al-azhar-college': [
    { key: 'class', label: 'Sit a class', emoji: '📏', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'study', label: 'Study in the hall', emoji: '📚', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'courtyard', label: 'Rest in the courtyard', emoji: '🕌', kind: 'view', note: 'The courtyard stays cool long after the sun gives up.' },
  ],
  'baptist-high': [
    { key: 'class', label: 'Sit a class', emoji: '📏', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'track', label: 'Run the field track', emoji: '🏃', kind: 'needs', door: 'workout', effects: { energy: -14, mood: 8, health: 6, hunger: -8 } },
    { key: 'field', label: 'Watch the field games', emoji: '⚽', kind: 'view', note: 'Inter-house sports turn the whole street out.' },
  ],
  'julitola-intl': [
    { key: 'class', label: 'Sit a class', emoji: '📏', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'parents', label: 'Hear the parents’ gist', emoji: '🚗', kind: 'view', note: 'Pickup time carries more news than any radio bulletin.' },
    { key: 'pickup', label: 'Join the pickup-time crowd', emoji: '🚙', kind: 'view', note: 'The car park at closing time is its own small market.' },
  ],
  'christfield-school': [
    { key: 'class', label: 'Sit a class', emoji: '📏', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'gist', label: 'Hear the school gist', emoji: '🗣️', kind: 'view', note: 'Small school, big stories.' },
    { key: 'choir', label: 'Hear the choir warm up', emoji: '🎵', kind: 'view', note: 'The warm-ups carry further than the morning bell.' },
  ],

  /* ------------------------------ the G2 spaces ------------------------------- */
  adankolo: [
    { key: 'read', label: 'Read at the community study room', emoji: '📖', kind: 'needs', door: 'study', effects: { energy: -7, mood: 3, hunger: -6 } },
    { key: 'hustles', label: 'Search for hustles', emoji: '📋', kind: 'earn', door: 'searchHustles', note: 'Lodge-to-lecture runs, typing gigs, lesson notes.' },
    { key: 'stroll', label: 'Stroll the old campus road', emoji: '🚶', kind: 'view', note: 'Half the ward claims a cousin in the university.' },
  ],
  emiwoziri: [
    { key: 'landing-hustles', label: 'Ask about landing work', emoji: '📋', kind: 'earn', door: 'searchHustles', note: 'Sand landings and net seasons hire extra hands when the boats come in.' },
    { key: 'nets', label: 'Sit with the net menders', emoji: '🕸️', kind: 'view', note: 'They fix the nets and the day\u2019s gossip at the same pace.' },
    { key: 'ferry', label: 'Ask about the crossing', emoji: '🛶', kind: 'view', door: 'takeFerry', note: 'The canoe ferry runs when the road is cut — jetty law.' },
    { key: 'sand-watch', label: 'Watch the sand landing', emoji: '⏳', kind: 'view', note: 'Dugout canoes ride low; every sack is counted twice.' },
  ],
  filele: [
    { key: 'farm-talk', label: 'Talk farm work with the elders', emoji: '🌿', kind: 'view', note: 'Yam season decides the whole village\u2019s mood.' },
    { key: 'hustles', label: 'Search for hustles', emoji: '📋', kind: 'earn', door: 'searchHustles', note: 'Harvest hands and keke loads — the village pays in kind.' },
    { key: 'ridge-view', label: 'Look back at the ridge', emoji: '⛰️', kind: 'view', note: 'From here you see how Patti leans over the town.' },
  ],
  numai: [
    { key: 'frontyard', label: 'Join the front-yard league', emoji: '⚽', kind: 'needs', door: 'workout', effects: { energy: -14, mood: 8, health: 6, hunger: -8 } },
    { key: 'hustles', label: 'Search for hustles', emoji: '📋', kind: 'earn', door: 'searchHustles', note: 'Fence repairs, errand runs, goat herding (seriously).' },
    { key: 'gossip', label: 'Collect the compound gist', emoji: '🗣️', kind: 'view', note: 'By evening every household knows every household.' },
  ],
  kpatakpoli: [
    { key: 'well', label: 'Join the well queue', emoji: '🪣', kind: 'needs', door: 'workout', effects: { energy: -14, mood: 8, health: 6, hunger: -8 } },
    { key: 'hustles', label: 'Search for hustles', emoji: '📋', kind: 'earn', door: 'searchHustles', note: 'The village hires hands when the rains come.' },
    { key: 'compound', label: 'Take the compound evening air', emoji: '🌇', kind: 'view', note: 'Benches outside, radios low, moons bright.' },
  ],
  kpato: [
    { key: 'timber', label: 'Help load the timber lorries', emoji: '🪵', kind: 'earn', door: 'searchHustles', note: 'Cash for the day when the lorries come.' },
    { key: 'roast', label: 'Try the roadside roast', emoji: '🍢', kind: 'spend', door: 'eatMeal', note: 'Plantain and fish, smoked over open coals.' },
    { key: 'road-watch', label: 'Watch the Otukpo road', emoji: '🛣️', kind: 'view', note: 'Everything heading out of Kogi east passes this dust.' },
  ],
  'township-stadium': [
    { key: 'drill', label: 'Run the track', emoji: '🏃', kind: 'needs', door: 'workout', effects: { energy: -14, mood: 8, health: 6, hunger: -8 } },
    { key: 'stands', label: 'Climb the oval stands', emoji: '🏟️', kind: 'view', note: 'Even empty, the bowl has a voice.' },
    { key: 'hustles', label: 'Search for hustles', emoji: '📋', kind: 'earn', door: 'searchHustles', note: 'Matchday means crowd work, stall hands, ball boys.' },
  ],
  'maigari-palace': [
    { key: 'greet', label: 'Pay your respect at the gate', emoji: '🤲', kind: 'view', note: 'Greet the elders properly — manners open the courtyard.' },
    { key: 'history', label: 'Ask the palace history', emoji: '📜', kind: 'view', note: 'The throne\u2019s memory is longer than the state\u2019s.' },
    { key: 'hustles', label: 'Search for hustles', emoji: '📋', kind: 'earn', door: 'searchHustles', note: 'Festival days bring errand work at the grounds.' },
  ],
  'pati-ridge-hill': [
    { key: 'hike', label: 'Take the quiet trail', emoji: '🥾', kind: 'needs', door: 'workout', effects: { energy: -14, mood: 8, health: 6, hunger: -8 } },
    { key: 'trail-hustles', label: 'Ask about trail work', emoji: '🧭', kind: 'earn', door: 'searchHustles', note: 'Weekend hikers pay for a guide who knows the quiet shoulder.' },
    { key: 'sundown', label: 'Watch the sun go down', emoji: '🌇', kind: 'view', note: 'The ridge keeps the last light longer than the town below.' },
    { key: 'pause', label: 'Rest on the shoulder', emoji: '🌬️', kind: 'view', note: 'Wind, grass, and a city laid out like a mat weave.' },
  ],
  'sokamms-motel': [
    { key: 'motel-hustles', label: 'Ask about motel shifts', emoji: '🧹', kind: 'earn', door: 'searchHustles', note: 'The manager always needs one more pair of honest hands.' },
    { key: 'nap', label: 'Take a short nap', emoji: '😴', kind: 'needs', door: 'rest', arg: 'nap', effects: { energy: 22, hunger: -8, mood: 4, health: 2 } },
    { key: 'sleep', label: 'Sleep till morning', emoji: '🌙', kind: 'needs', door: 'rest', arg: 'sleep', effects: { energy: 100, hunger: -22, mood: 12, health: 8 } },
    { key: 'bath', label: 'Freshen up', emoji: '🚿', kind: 'needs', door: 'relaxIndoors', arg: 'bath', effects: { mood: 5, energy: 5, hunger: -3 } },
    { key: 'gist', label: 'Sit at the gist corner', emoji: '🗣️', kind: 'view', note: 'The night guard hears everything that enters Lokoja.' },
  ],
}
