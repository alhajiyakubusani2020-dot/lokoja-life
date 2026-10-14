const mem: Record<string, string> = {}
;(globalThis as Record<string, unknown>).window = {
  localStorage: {
    getItem: (k: string) => mem[k] ?? null,
    setItem: (k: string, v: string) => { mem[k] = v },
    removeItem: (k: string) => { delete mem[k] },
  },
}
const { SaveSystem } = await import('/home/z/my-project/src/game/systems/save')
SaveSystem.setFortKey('dbg-key-0123456789abcdef-01234567')
const { freshCalendarState } = await import('/home/z/my-project/src/game/systems/calendar')
const { freshRiversState } = await import('/home/z/my-project/src/game/systems/rivers')
const save = {
  version: 16, createdAt: 1, updatedAt: 2,
  player: { name: 'Dbg', gender: 'female' as const, ageBand: 'adult' as const, avatar: { skinTone: 'a', hairColor: 'a', hairstyle: 'a', clothingStyle: 'a', clothingColor: 'a' }, cash: 5000, needs: { health: 100, energy: 90, hunger: 80, mood: 70 }, skills: { hustle: 2, smart: 2, social: 2 }, skillXp: { hustle: 0, smart: 0, social: 0 }, reputation: 10, level: 2, xp: 0, homeId: 'home', jobId: null, activeOpportunities: [], cooldowns: {}, transactions: [], stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 }, inventory: [], businesses: [], missions: {}, achievements: [], discoveries: [], vehicles: [], bankBalance: 0, relationships: {} },
  world: { day: 1, timeOfDay: 'morning' as const, weather: 'sunny' as const, currentLocation: 'home' },
  civic: await (async () => (await import('/home/z/my-project/src/game/systems/civic')).freshCivicState())(),
  chaos: (await import('/home/z/my-project/src/game/systems/chaos')).freshChaosState(),
  calendar: freshCalendarState(), rivers: freshRiversState(),
  education: (await import('/home/z/my-project/src/game/systems/education')).freshEducationState(),
  housing: (await import('/home/z/my-project/src/game/systems/housing')).freshHousingState(),
  japa: (await import('/home/z/my-project/src/game/systems/japa')).freshJapaState(),
  goals: (await import('/home/z/my-project/src/game/systems/goals')).freshGoalState(),
  onboarding: (await import('/home/z/my-project/src/game/systems/guest')).freshOnboardingState(),
  account: (await import('/home/z/my-project/src/game/systems/guest')).freshAccountState(),
  shield: (await import('/home/z/my-project/src/game/systems/shield')).freshShieldState(),
  cityPulse: (await import('/home/z/my-project/src/game/systems/pulse')).freshPulseState(),
  fortress: (await import('/home/z/my-project/src/game/systems/fortress')).freshFortressState(),
  fleet: { day: 1, done: [] },
  settings: { sound: true, graphics: 'auto' as const, chill: false, elder: false },
} as Parameters<typeof SaveSystem.write>[0]
console.log('write1:', SaveSystem.write(save), SaveSystem.writeVerdict(), 'shadow?', !!mem['lokoja-life:save-b'])
console.log('write2:', SaveSystem.write(save), SaveSystem.writeVerdict(), 'shadow?', !!mem['lokoja-life:save-b'])
console.log('write3:', SaveSystem.write(save), SaveSystem.writeVerdict())
