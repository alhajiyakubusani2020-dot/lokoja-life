/**
 * CHARLIE PH2.5 — verbatim slice extractor for the god-store split.
 * Run ONCE while src/game/store/useGameStore.ts is still the monolith:
 *   bun scripts/audit-tmp/charlie25/extract-slices.ts
 * Generates src/game/store/{shared.ts,slices/*.ts} by moving exact line
 * ranges. Asserts full member coverage before writing anything.
 */
import * as fs from 'node:fs'
import * as path from 'node:path'

const ROOT = '/home/z/my-project'
const SRC = path.join(ROOT, 'src/game/store/useGameStore.ts')
const OUT = path.join(ROOT, 'src/game/store')
const lines = fs.readFileSync(SRC, 'utf8').split('\n') // 0-based; line N = lines[N-1]

type Range = [number, number] // 1-based inclusive

const SLICES: Record<string, { name: string; type: string; ranges: Range[]; head?: string[] }> = {
  ui: {
    name: 'uiSlice', type: 'UiSlice',
    ranges: [[1246, 1246], [1249, 1249], [1268, 1268], [1283, 1284], [1305, 1305], [4227, 4245], [4270, 4303], [5550, 5560]],
  },
  saveBoot: {
    name: 'saveBootSlice', type: 'SaveBootSlice',
    ranges: [[1247, 1248], [1262, 1264], [1267, 1267], [1291, 1303], [1307, 1484], [4531, 4786], [5471, 5548]],
    head: [
      '/** M16 — the online listener wires itself exactly once. */',
      'let cloudQueueWired = false',
      '',
    ],
  },
  player: {
    name: 'playerSlice', type: 'PlayerSlice',
    ranges: [[1251, 1251], [1261, 1261], [1486, 1621], [2165, 2249], [3486, 3560], [3898, 3912], [4202, 4218], [4220, 4225], [4247, 4268]],
  },
  world: {
    name: 'worldSlice', type: 'WorldSlice',
    ranges: [[1252, 1252], [1256, 1257], [1286, 1286], [2381, 2635], [2637, 2904], [3562, 3757]],
  },
  economy: {
    name: 'economySlice', type: 'EconomySlice',
    ranges: [[1253, 1253], [1255, 1255], [1266, 1266], [1287, 1289], [1623, 1741], [1743, 1835], [1837, 1913], [2251, 2379], [3759, 3896], [3914, 3998], [4000, 4189], [4191, 4200]],
  },
  vehicles: {
    name: 'vehiclesSlice', type: 'VehiclesSlice',
    ranges: [[1254, 1254], [1915, 1996], [1998, 2163], [3476, 3484]],
  },
  ladder: {
    name: 'ladderSlice', type: 'LadderSlice',
    ranges: [[1258, 1260], [2906, 3298]],
  },
  social: {
    name: 'socialSlice', type: 'SocialSlice',
    ranges: [[1265, 1265], [3300, 3371], [3373, 3474], [4466, 4529]],
  },
  lifestyle: {
    name: 'lifestyleSlice', type: 'LifestyleSlice',
    ranges: [[1273, 1275], [4305, 4334], [4336, 4464]],
  },
  pulse: {
    name: 'pulseSlice', type: 'PulseSlice',
    ranges: [[1269, 1269], [1281, 1282], [4788, 4879], [5400, 5469]],
  },
  net: {
    name: 'netSlice', type: 'NetSlice',
    ranges: [[1270, 1272], [1276, 1280], [4881, 5201], [5203, 5291], [5293, 5398]],
    head: [
      '/** THE ONE APPLICATION LAW (hardening) — the ack-applied tradeIds: the 12s',
      ' * sync\'s broadcast of the SAME trade must never pay a second time. Module',
      ' * scope: the book outlives any single sync pass. */',
      'const appliedTrades = new Set<string>()',
      '',
    ],
  },
}

const SHARED_RANGE: Range = [648, 1243]

// every store-body member start line (state keys + action keys) — coverage proof
const MEMBER_STARTS = [
  1246, 1247, 1248, 1249, 1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 1259, 1260, 1261, 1262,
  1263, 1264, 1265, 1266, 1267, 1268, 1269, 1270, 1271, 1272, 1273, 1274, 1275, 1276, 1277, 1278,
  1279, 1280, 1281, 1282, 1283, 1284, 1286, 1287, 1288, 1289, 1293, 1305, 1312, 1336, 1420, 1479,
  1488, 1556, 1572, 1609, 1627, 1663, 1702, 1730, 1745, 1772, 1813, 1839, 1871, 1882, 1915, 2000,
  2050, 2076, 2142, 2165, 2174, 2188, 2207, 2251, 2276, 2350, 2385, 2428, 2453, 2489, 2514, 2541,
  2567, 2607, 2640, 2669, 2701, 2718, 2740, 2764, 2823, 2877, 2909, 2935, 2970, 2997, 3018, 3046,
  3065, 3086, 3104, 3129, 3147, 3164, 3182, 3214, 3232, 3251, 3281, 3300, 3350, 3375, 3412, 3453,
  3476, 3491, 3564, 3761, 3809, 3846, 3898, 3915, 4001, 4036, 4066, 4076, 4153, 4171, 4193, 4202,
  4220, 4229, 4238, 4248, 4271, 4279, 4288, 4297, 4308, 4326, 4339, 4364, 4380, 4396, 4417, 4442,
  4467, 4494, 4512, 4535, 4622, 4657, 4664, 4775, 4786, 4791, 4800, 4826, 4838, 4869, 4885, 4951,
  4968, 4988, 5001, 5009, 5018, 5027, 5033, 5047, 5058, 5070, 5082, 5091, 5101, 5110, 5135, 5147,
  5160, 5184, 5192, 5208, 5257, 5283, 5295, 5325, 5335, 5344, 5366, 5381, 5395, 5403, 5471, 5507,
  5552, 5559,
]

// ---- coverage assertion: every member start inside exactly one range ----
{
  const owner = new Map<number, string>()
  for (const [key, cfg] of Object.entries(SLICES)) {
    for (const [a, b] of cfg.ranges) {
      for (let n = a; n <= b; n++) {
        if (owner.has(n)) throw new Error(`line ${n} double-owned by ${owner.get(n)} and ${key}`)
        owner.set(n, key)
      }
    }
  }
  const missing = MEMBER_STARTS.filter((n) => !owner.has(n))
  if (missing.length) throw new Error(`member starts not covered: ${missing.join(',')}`)
  // every line in a range must be blank / comment / part of the store object —
  // prove no stray top-level statement got dragged along: lines must be blank,
  // a comment, or start with 2 spaces (object members / nesting) or close a block.
  for (const [n, key] of owner) {
    const t = lines[n - 1]
    if (t.trim() === '' || /^\s*(\/\/|\/\*|\*)/.test(t) || /^\s/.test(t) || /^[)}\],]/.test(t)) continue
    throw new Error(`line ${n} (${key}) looks non-object: ${JSON.stringify(t)}`)
  }
  console.log(`coverage OK: ${MEMBER_STARTS.length} members, ${owner.size} lines mapped`)
}

// ---- import universe (name → module + optional alias), from the monolith's imports ----
const IMPORTS: [string, string[], ('type' | 'value')?][] = [
  ['../../types', ['ActiveOpportunity', 'AvatarConfig', 'ChatOutcome', 'CivicState', 'GameNotification', 'GameSave', 'GameSettings', 'Gender', 'OwnedVehicle', 'PlayerState', 'Reward', 'Screen', 'SkillId', 'Transaction', 'TransactionCategory', 'TransportId', 'VehicleModel', 'WorldState', 'FleetState', 'ChaosState', 'GoalState', 'OnboardingState', 'AccountState', 'CalendarState', 'RiversState', 'EducationState', 'HousingState', 'JapaState', 'ShieldState', 'FortressState', 'PulseState', 'FestivalDay', 'WeddingDay', 'ShopUpgradeId'], 'type'],
  ['../../data/config', ['STARTING', 'NEEDS', 'TRAVEL', 'WORK', 'HUSTLE', 'AUTOSAVE', 'WORLD3D', 'INTERIOR', 'MEAL_BY_KEY', 'TIME', 'WEATHER_META', 'SOCIAL', 'GOALS', 'CHILL', 'FORTRESS', 'BIZ', 'CIVIC', 'FLEET', 'CHAOS', 'FESTIVALS', 'RIVERS', 'LADDER', 'SHIELD', 'ELDER', 'PULSE']],
  ['../../systems/world3d', ['walkingEnergyCost', 'describeWalkSettle']],
  ['../../data/avatar', ['DEFAULT_AVATAR']],
  ['../../data/vehicles', ['VEHICLE_BY_MODEL', 'generatePlate']],
  ['../../systems/wheels', ['plateOk', 'paintOk']],
  ['../../data/npcChat', ['NPC_CHAT']],
  ['../../data/npcs', ['NPC_BY_ID']],
  ['../../data/locations', ['LOCATION_BY_ID']],
  ['../../data/jobs', ['JOB_BY_ID']],
  ['../../systems/needs', ['applyNeedsDelta', 'applySlotDecay']],
  ['../../systems/progression', ['processXp:addXp', 'formatNaira']],
  ['../../systems/economy', ['recordTransaction', 'pushTransaction', 'canAfford', 'rewardCash', 'describeReward']],
  ['../../systems/skills', ['applySkillXp:addSkillXp', 'SKILL_META']],
  ['../../systems/work', ['checkRequirements', 'cooldownRemaining', 'resolveJob']],
  ['../../systems/social', ['canChat', 'relationshipFor', 'tierFor', 'pickLine', 'afterChat', 'canGift', 'canHangout', 'afterGift', 'afterHangout', 'favorRollsToday', 'giftById', 'TIER_META']],
  ['../../systems/seasons', ['weatherBlocksLocation', 'isNightMarketOpen', 'nightMealPrice', 'mealAvailableAt', 'NIGHT_MARKET_LOCATION_ID']],
  ['../../systems/opportunities', ['generateHustleOffers', 'hustleDefFor', 'pruneExpiredOpportunities', 'resolveOpportunity', 'makeOpportunityInstance', 'isEligible']],
  ['../../systems/save', ['SaveSystem']],
  ['../../systems/device', ['refreshDeviceProfile']],
  ['../../systems/audio', ['audio', 'syncAudioWithSettings']],
  ['../menu-store', ['useMenuStore', 'menuSetScreen']],
  ['../../systems/world', ['nextSlot', 'rollNewDayWeather', 'weatherForSlot', 'advanceWorldClock', 'absoluteSlot']],
  ['../../systems/travel', ['calculateTravel', 'rollTravelEvent']],
  ['../../systems/garage', ['personalModelOf', 'resaleValue', 'transportAllowed']],
  ['../../systems/civic', ['freshCivicState', 'civicDayRoll', 'nepaSettleCost', 'nepaApplyPayment', 'kgirsSettleCost', 'kgirsApplyPayment', 'efccFileTip', 'efccRewardFor', 'marketMealPrice', 'marketForDay']],
  ['../../systems/biz', ['bizDayRoll', 'bizDef', 'bizOwned', 'bizUpgradeCost', 'bizCollect', 'freshBusiness', 'staffCapFor']],
  ['../../systems/chaos', ['chaosDayRoll', 'freshChaosState', 'liquidityMultFor', 'fuelMultFor', 'isScarcityDay', 'atmRemaining', 'applyAtmDraw', 'posFeeFor', 'canContribute', 'applyContribution', 'blackoutAt', 'setDebugScarcity']],
  ['../../systems/goals', ['bumpGoal', 'freshGoalState']],
  ['../../systems/rivers', ['riverLevelFor', 'freshRiversState', 'riversDayRoll', 'zoneCut', 'walkwayOpen', 'segmentsLeft', 'canLaySegment', 'laySegmentApply', 'setTollTierApply', 'canContributeRescue', 'contributeRescueApply', 'floodBizFactor', 'riverMarketMult', 'availableFerryGigs', 'ferryFareBetween', 'runFerryApply', 'setDebugRiverLevel', 'cutZonesFor', 'JETTY_ID']],
  ['../../systems/binarydelta', ['deltaPushFields']],
  ['../../systems/live', ['freshLiveState', 'sanitizeChat', 'emoteById']],
  ['../../systems/nation', ['freshNationState', 'recordInflation', 'recordModeration', 'crowdToggle', 'moderationScore', 'inflationTrend', 'setLiveSnapshot', 'type:NationState']],
  ['../../systems/nation-sim', ['type:CrowdSnapshot', 'type:WorldPulse']],
  ['../../systems/nation-bridge', ['startNationSim', 'stopNationSim']],
  ['../../systems/flags', ['readFlags', 'setFlag', 'type:FlagKey']],
  ['../../systems/telemetry', ['freshTelemetryBook', 'recordTelemetry', 'telemetryPayload', 'telemetryDayRoll', 'type:TelemetryBook']],
  ['../../systems/citypack', ['freshForgeState', 'forgeCity', 'forgeVoteLaw:forgeVote', 'applyVote', 'recordBuild', 'voteWinner', 'PILOT_LADDER', 'CITY_SLA_MINUTES', 'type:OsmExtract']],
  ['../../systems/story', ['freshStoryState', 'currentTask', 'canCarrySand', 'canPayNotebook', 'canPayFever', 'canSponsorStory:canSponsor', 'canGraduate', 'applyCarry', 'applyNotebook', 'applyFever', 'applySponsor', 'applyWhiteCoat', 'coatDay', 'STORY', 'type:StoryChapter']],
  ['../../systems/patti', ['freshPattiState', 'PATTI_SECRETS', 'nearestSecret', 'discover', 'type:PattiSecret']],
  ['../../systems/wardrobe', ['freshWardrobeState', 'shopBuy', 'equipWalkLaw:equipWalk', 'grantDrop', 'walkRigFor', 'WALK_BY_KEY', 'PREMIUM_BY_KEY']],
  ['../../systems/music', ['music', 'moodForTimeOfDay']],
  ['../../systems/haptics', ['haptics']],
  ['../../systems/pulse', ['freshPulseState', 'pulseForDay', 'markPulseRead', 'type:PulseItem']],
  ['../../systems/teleport', ['encodeTeleport', 'decodeTeleport', 'postcardFor', 'type:TeleportMoment']],
  ['../../systems/calendar', ['freshCalendarState', 'calendarDayRoll', 'calendarMarketMult', 'festivalForDay', 'weddingForCycle', 'attendSprayFor', 'canAttendFestival', 'canBuyRam', 'buyRamApply', 'canShareMeat', 'shareMeatApply', 'canSponsor', 'sponsorApply', 'canBet', 'betApply', 'canBuyAsoEbi', 'buyAsoEbiApply', 'canAttendWedding', 'attendWeddingApply', 'canContributePaving', 'contributePavingApply', 'pavedMinutesMult', 'isIftarHour', 'type:RegattaResult']],
  ['../../systems/guest', ['gateVerdict', 'applyGrace', 'freshAccountState', 'freshOnboardingState', 'validateHandle', 'validatePin', 'validateContact', 'ageBandForYear', 'mergeVerdict', 'backupPayload', 'BACKUP_KEY']],
  ['../../systems/education', ['freshEducationState', 'canEnroll', 'enrollApply', 'isLectureWindow', 'isExamWindow', 'isStrikeDay', 'strikeDaysLeft', 'canAttendLecture', 'attendLectureApply', 'earnsDeansGrant', 'grantApply', 'canSitExam', 'examApply', 'examScore', 'canAttendConvocation', 'convocationApply', 'absoluteSemesterIndex']],
  ['../../systems/housing', ['freshHousingState', 'homeComfort', 'canBuyProperty', 'buyPropertyApply', 'canFurnish', 'furnishApply', 'housingDayRoll', 'canPayRent', 'payRentApply', 'canResolveWahala', 'resolveWahalaApply', 'propertyFor']],
  ['../../systems/japa', ['freshJapaState', 'canRequestNimc', 'requestNimcApply', 'canCollectNimc', 'collectNimcApply', 'canRequestPassport', 'requestPassportApply', 'canCollectPassport', 'collectPassportApply', 'canTryAgent', 'tryAgentApply', 'canClearKgirs', 'clearanceApply', 'canGetPoliceCertificate', 'policeCertificateApply', 'canTakeFlight', 'takeFlightApply', 'remittanceLands', 'remittanceApply', 'escortAvailable', 'canRunEscort', 'runEscortApply', 'sirenMinutesMult', 'papersComplete']],
  ['../../systems/fleet', ['gigBoard', 'gigLabel']],
  ['../../systems/fortress', ['freshFortressState', 'incomeGuard', 'velocityGuard', 'chainNext', 'verifyPayload', 'configFingerprint', 'CHAIN_SEED']],
  ['../../systems/shield', ['freshShieldState', 'crimeAllowed', 'shieldCanHustle:canHustle', 'canJapa', 'CRIME_REFUSALS', 'canPlayScammer', 'scamRound', 'scamAnswerApply', 'validateParentPin', 'localPinHash', 'makeLocalSalt', 'tierGateVerdict', 'type:CrimeContentId']],
  ['../../data/hustles', ['HUSTLE_BY_ID']],
]

// shared.ts exports the moved module-level machinery
const SHARED_IMPORTS: [string, string[]] = [
  ['../shared', ['scheduleAutosave', 'commitCivicDays', 'bumpOnboarding', 'applyArrival', 'dayTally', 'shareText', 'payStreetCredit', 'slotDecay', 'LEDGER_CAP', 'cloudSaveGate', 'warnSaveFailure', 'startNationBridge', 'nationBridge', 'nextNotificationId', 'nextPulseId', 'clearNationBridge']],
]

// names that must NEVER be imported as values from the wire module (lazy law)
const BANNED = ['useWireStore', 'wireSendVehiclePatch']

const getText = (r: Range): string[] => lines.slice(r[0] - 1, r[1])
const isCommentLine = (t: string): boolean => /^\s*(\/\/|\/\*|\*|\*\/)/.test(t)

function joinRanges(ranges: Range[]): string[] {
  const out: string[] = []
  ranges.forEach(([a, b], i) => {
    if (i > 0) out.push('')
    out.push(...getText([a, b]))
  })
  // trim trailing blank lines
  while (out.length && out[out.length - 1].trim() === '') out.pop()
  return out
}

function neededImports(body: string, universe: [string, string[], ('type' | 'value')?][], opts: { includeShared?: boolean; depthFor?: 'slice' | 'store' } = {}): string {
  const uses = (name: string): boolean => {
    // a use = not a property access (`.name`), not a property KEY (`name:`);
    // `...name` (spread) DOES count as a use.
    const re = new RegExp(`\\b${name}\\b`, 'g')
    for (const m of body.matchAll(re)) {
      const i = m.index
      if (body.slice(i + m[0].length).startsWith(':')) continue // member key / label
      // walk back over the dot-run before the identifier
      let j = i - 1
      let dots = 0
      while (j >= 0 && body[j] === '.') { dots++; j-- }
      if (dots === 1) continue // member access — not the imported binding
      if (j >= 0 && /[\w$]/.test(body[j])) continue // part of a bigger word
      return true
    }
    return false
  }
  const depth = (mod: string): string =>
    opts.depthFor === 'store' ? (mod === '../../types' ? '../types' : mod.replace(/^\.\.\/\.\.\//, '../')) : mod
  const valueGroups = new Map<string, string[]>()
  const typeGroups = new Map<string, string[]>()
  for (const [mod, names, kind] of universe) {
    for (const entry of names) {
      const isType = entry.startsWith('type:') || kind === 'type'
      const imported = entry.startsWith('type:') ? entry.slice(5) : entry
      const [importedName, alias] = imported.includes(':') ? [imported.split(':')[1], imported.split(':')[0]] : [imported, undefined]
      const local = alias ?? importedName
      if (BANNED.includes(local)) continue
      if (!uses(local)) continue
      const rendered = alias ? `${importedName} as ${alias}` : importedName
      const g = isType ? typeGroups : valueGroups
      if (!g.has(mod)) g.set(mod, [])
      g.get(mod)!.push(rendered)
    }
  }
  if (opts.includeShared) {
    for (const [mod, names] of SHARED_IMPORTS) {
      const vals = names.filter((n) => uses(n))
      if (vals.length) {
        if (!valueGroups.has(mod)) valueGroups.set(mod, [])
        valueGroups.get(mod)!.push(...vals)
      }
    }
  }
  const emit = (g: Map<string, string[]>, kw: string): string[] =>
    [...g].sort((a, b) => a[0].localeCompare(b[0])).map(([mod, names]) =>
      names.length > 2 ? `${kw} {\n  ${names.join(',\n  ')},\n} from '${depth(mod)}'` : `${kw} { ${names.join(', ')} } from '${depth(mod)}'`)
  return [...emit(valueGroups, 'import'), ...emit(typeGroups, 'import type')].join('\n')
}

function pathFix(text: string): string {
  // slice depth (src/game/store/slices/*): one level deeper than the monolith
  return text
    .replaceAll("import('../types')", "import('../../types')")
    .replaceAll("import('../systems/", "import('../../systems/")
    .replaceAll("import('../data/", "import('../../data/")
    .replaceAll("import('./", "import('../")
}

fs.mkdirSync(path.join(OUT, 'slices'), { recursive: true })

for (const [key, cfg] of Object.entries(SLICES)) {
  const bodyLines = joinRanges(cfg.ranges)
  let body = pathFix(bodyLines.join('\n'))
  // PH2.5 mechanical re-homes of module-level mutable state (see shared.ts):
  body = body
    .replace(
      '    notificationId += 1\n    const notification: GameNotification = { ...n, id: notificationId }',
      '    // PH2.5: notificationId now lives in shared.ts — this is the same +1\n    const notification: GameNotification = { ...n, id: nextNotificationId() }',
    )
    .replaceAll('pulse: { id: ++pulseId, amount: paid }', 'pulse: { id: nextPulseId(), amount: paid }')
    .replace(/(\n +)nationBridge = null(\n)/g, '$1// PH2.5: the bridge book lives in shared.ts$1clearNationBridge()$2')
  const imports = neededImports(body, IMPORTS, { includeShared: true })
  const saveBootWire = key === 'saveBoot' ? "import { useGameStore } from '../useGameStore' // PH2.5: the boot online-listener reads the composed hook (closure-only, cycle-safe)\n" : ''
  const header = [
    '/**',
    ` * ${key.toUpperCase()} SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).`,
    ` * Source lines: ${cfg.ranges.map(([a, b]) => `${a}-${b}`).join(', ')}.`,
    ' * Zero logic changes — this file only re-homes the original object members',
    ' * (state initializers + actions) into one zustand slice of the composed store.',
    ' */',
    "import type { StateCreator } from 'zustand'",
    `import type { GameStore, ${cfg.type} } from '../types'`,
    imports,
    saveBootWire,
  ].filter(Boolean).join('\n')
  const moduleHead = cfg.head ? cfg.head.join('\n') + '\n' : ''
  const tail = body.endsWith(',') ? '' : ','
  const file = `${header}\n\n${moduleHead}export const ${cfg.name}: StateCreator<GameStore, [], [], ${cfg.type}> = (set, get) => ({\n${body}${tail}\n})\n`
  fs.writeFileSync(path.join(OUT, 'slices', `${key}.ts`), file)
  console.log(`slices/${key}.ts: ${bodyLines.length} lines`)
}

// ---- shared.ts: module-level state + helpers, lines 648-1243 verbatim ----
{
  // shared.ts sits at store depth — the monolith's relative paths are already right
  const raw = joinRanges([SHARED_RANGE]).join('\n')
  let body = raw
  // appliedTrades + cloudQueueWired moved to net.ts / saveBoot.ts module scope
  body = body.replace(
    /\/\*\* THE ONE APPLICATION LAW \(hardening\) — the ack-applied tradeIds: the 12s\n \* sync's broadcast of the SAME trade must never pay a second time\. Module\n \* scope: the book outlives any single sync pass\. \*\/\nconst appliedTrades = new Set<string>\(\)\n\/\*\* M16 — the online listener wires itself exactly once\. \*\/\nlet cloudQueueWired = false\n/,
    '/* appliedTrades moved to slices/net.ts; cloudQueueWired moved to slices/saveBoot.ts (PH2.5) */\n',
  )
  // exported surface: everything slices or the composition file needs.
  const EXPORT_NAMES = ['applyArrival', 'dayTally', 'shareText', 'payStreetCredit', 'LEDGER_CAP', 'slotDecay', 'bumpOnboarding', 'civicRollForDays', 'commitCivicDays', 'warnSaveFailure', 'CloudSaveProbe', 'cloudSaveGate', 'scheduleAutosave', 'startNationBridge', 'useGameStoreRef', 'nationBridge']
  for (const name of EXPORT_NAMES) {
    body = body.replace(new RegExp(`^((?:async )?(?:function|const|let|type|interface) ${name}\\b)`, 'm'), 'export $1')
  }
  // CivicAgg + civicRollForDays stay private to shared (commitCivicDays owns them)
  body = body.replace(/^export (interface CivicAgg)/m, '$1').replace(/^export (function civicRollForDays)/m, '$1')
  const sharedHelpers = [
    '',
    '/* PH2.5: the three counters below moved here from the monolith\'s module scope;',
    ' * slices cannot assign imported bindings, so the increments/assigns became',
    ' * these mechanical wrappers. Same arithmetic, same live book. */',
    'export function nextNotificationId(): number {',
    '  notificationId += 1',
    '  return notificationId',
    '}',
    '',
    'export function nextPulseId(): number {',
    '  pulseId += 1',
    '  return pulseId',
    '}',
    '',
    'export function clearNationBridge(): void {',
    '  nationBridge = null',
    '}',
  ].join('\n')
  const imports = neededImports(body, IMPORTS, { depthFor: 'store' })
  const header = [
    '/**',
    ' * SHARED STORE INTERNALS — moved VERBATIM from useGameStore.ts (PH2.5 split).',
    ' * Source lines: 648-1243. The module-level mutable state (autosave timer,',
    ' * id counters, the nation bridge, the self-referencing store ref) and the',
    ' * cross-domain helpers (arrival, share, civic day-roll, autosave, pull gate)',
    ' * live here so every slice imports ONE internals module (no slice↔slice',
    ' * cycles). The composition file binds useGameStoreRef after create().',
    ' */',
    "import type { GameStore } from './types'",
    imports,
  ].filter(Boolean).join('\n')
  const file = `${header}\n\n${body}${sharedHelpers}\n`
  fs.writeFileSync(path.join(OUT, 'shared.ts'), file)
  console.log(`shared.ts: ${bodyLines(body).length} lines`)
}

function bodyLines(s: string): string[] { return s.split('\n') }
console.log('DONE')
