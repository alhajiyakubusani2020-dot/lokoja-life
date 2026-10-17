import './geo/bootstrap'
import { JUNCTION_CLUSTERS, TRAFFIC_LIGHTS, SPEED_BUMPS, DANFO_STOPS, junctionStats, lightPhaseAt, bumpHeightAt, bumpProfile } from '../src/game/world3d/junctions'
console.log(JSON.stringify(junctionStats()))
console.log('light spots:', TRAFFIC_LIGHTS.slice(0, 5).map(l => `(${l.x.toFixed(0)},${l.z.toFixed(0)}) off ${l.offset.toFixed(1)}`).join('  '))
console.log('bumps:', SPEED_BUMPS.slice(0, 5).map(b => `(${b.x.toFixed(0)},${b.z.toFixed(0)})`).join('  '))
console.log('stops:', DANFO_STOPS.map(s => `(${s.x.toFixed(0)},${s.z.toFixed(0)}) bays ${s.bays}`).join('  '))
// phase table boundaries
console.log('phase@0:', lightPhaseAt(0, 0), '| @11.9:', lightPhaseAt(0, 11.9), '| @12:', lightPhaseAt(0, 12), '| @14.9:', lightPhaseAt(0, 14.9), '| @15:', lightPhaseAt(0, 15), '| @29.9:', lightPhaseAt(0, 29.9), '| @30:', lightPhaseAt(0, 30))
console.log('bump profile: u=-1:', bumpProfile(-1).toFixed(4), 'u=0:', bumpProfile(0).toFixed(4), 'u=0.5:', bumpProfile(0.5).toFixed(4), 'u=1:', bumpProfile(1).toFixed(4))
console.log('bumpHeightAt at a bump centre:', bumpHeightAt(SPEED_BUMPS[0].x, SPEED_BUMPS[0].z).toFixed(4), '| 5u away:', bumpHeightAt(SPEED_BUMPS[0].x + 5, SPEED_BUMPS[0].z + 5).toFixed(4))
