/**
 * LOKOJA LIFE — M23 W2: THE GREEN (the flora shader)
 * ---------------------------------------------------
 * The whole vegetation layer breathes through ONE shared shader state:
 *  • WIND — a vertex-shader sway (two sine bands + a slow drift, the
 *    classic three-frequency gust curve) whose phase is derived from the
 *    instance's world position inside the shader itself, so every tree
 *    and grass tuft swings on its own clock at ZERO CPU cost. No
 *    per-frame matrix writes, no allocation, no CPU phase tables.
 *  • WEATHER — the M6 weather law the city already obeys reaches the
 *    leaves: harmattan golds the crowns (the dry-season savanna look),
 *    the rain family deepens them toward lush. The dry target eases in
 *    over ~2s when the day rolls — vegetation never pops.
 *
 * The injection is `onBeforeCompile` over MeshStandardMaterial so the
 * standard lighting/shadow pipeline survives untouched. Trees and grass
 * share the same uniform OBJECTS (uTime/uDry), so one per-frame write
 * drives every flora draw call. The leaf mask (aLeaf) keeps the gold off
 * the wood; the sway weight (aSway) keeps the ground rigid.
 *
 * LAWS OF THIS FILE:
 *  - Zero per-frame allocation; the only per-frame work is two uniform
 *    writes inside stepFlora.
 *  - No React: the dry target reads atmoLive.weather (the M19 live
 *    weather the AtmosphereController already publishes every frame).
 *  - The shader never invents data: aSway/aLeaf come baked from the
 *    species geometry (flora-species.ts) and the grass tuft builder.
 */

import * as THREE from 'three'
import type { Weather } from '@/game/types'
import { atmoLive } from './atmosphere'

/** live flora state — the clock keeper writes, the shader reads */
export const floraLive = {
  /** shader clock (seconds, accumulates) */
  time: 0,
  /** eased dryness 0..1 (1 = harmattan gold, 0 = flood-season lush) */
  dry: 0.45,
}

/**
 * Weather → dryness target. The harmattan is THE dry season (full gold);
 * the rain family (rain/storm/flood) reads as the wet end; sunny/cloudy
 * hold the savanna middle. An unknown weather falls back to the middle —
 * a config mistake can never gold the whole town by surprise.
 */
const WEATHER_DRY: Record<Weather, number> = {
  harmattan: 1,
  sunny: 0.45,
  'night-clear': 0.45,
  cloudy: 0.3,
  rain: 0.08,
  storm: 0.04,
  flood: 0,
}

export function dryTargetOf(weather: Weather): number {
  return WEATHER_DRY[weather] ?? 0.45
}

/** the shared uniform objects — every flora material points at THESE */
const uTime = { value: 0 }
const uDry = { value: 0.45 }

/**
 * Inject the wind + weather shader into a MeshStandardMaterial.
 * `amp` scales the sway in world units (trees ~0.16, grass ~0.26) and
 * keys the program cache so materials with different amps never share a
 * (wrongly-scaled) program.
 */
export function applyFloraShader(mat: THREE.MeshStandardMaterial, amp: number): void {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime
    shader.uniforms.uDry = uDry
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nattribute float aSway;\nattribute float aLeaf;\nvarying float vLeaf;\nuniform float uTime;',
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
  #ifdef USE_INSTANCING
    float flPhase = instanceMatrix[3][0] * 0.73 + instanceMatrix[3][2] * 0.57;
  #else
    float flPhase = 0.0;
  #endif
  float flSway = aSway * ( sin(uTime * 1.35 + flPhase) * 0.5
    + sin(uTime * 2.62 + flPhase * 1.618 + 1.3) * 0.3
    + sin(uTime * 0.51 + flPhase * 0.377) * 0.2 );
  transformed.x += flSway * ${amp.toFixed(4)};
  transformed.z += flSway * ${(amp * 0.62).toFixed(4)};
  vLeaf = aLeaf;`,
      )
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying float vLeaf;\nuniform float uDry;',
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
  {
    float flDry = clamp(uDry * vLeaf, 0.0, 1.0);
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.63, 0.52, 0.25), flDry * 0.55);
    diffuseColor.rgb *= mix(1.05, 1.0, uDry);
  }`,
      )
  }
  mat.customProgramCacheKey = () => `flora-${amp.toFixed(3)}`
}

/**
 * The ONE flora clock — called every frame by FloraTrees' keeper. Eases
 * dry toward the live weather's target (~2s full swing), advances the
 * sway clock, publishes both to the shared uniforms.
 */
export function stepFlora(dt: number): void {
  const d = Math.min(dt, 0.1) // a hitched frame must not lurch the ease
  floraLive.time += d
  const target = dryTargetOf(atmoLive.weather)
  floraLive.dry += (target - floraLive.dry) * Math.min(1, d * 0.55)
  uTime.value = floraLive.time
  uDry.value = floraLive.dry
}
