/**
 * M21 — THE APP MANIFEST (scope kept honest — F4 FIX 8)
 * -----------------------------------------------------
 * The M21 law-suite subset: the 10 apps under contract test (gate 1 of
 * the content-breadth push). This is NOT the full phone registry — the
 * full 26-app union + titles grid lives in PhoneScreen.tsx:79.
 *
 * Historical claim retired: this header used to promise that each entry's
 * component file exports APP_ID / APP_TITLE / APP_GLYPH "proved by the law
 * suite, id by id" — 5 of the 10 files never honored those exports. The
 * real contract is simpler: the parent maps these ids into the phone
 * registry by import; this file owns only the honest list of the 10.
 */

export interface M21AppEntry {
  id: string
  title: string
  glyph: string
  path: string
}

export const M21_APPS: M21AppEntry[] = [
  { id: 'wardrobe', title: 'Wardrobe', glyph: '👕', path: './wardrobe-app' },
  { id: 'garage', title: 'Garage', glyph: '🛻', path: './garage-app' },
  { id: 'houses', title: 'Houses', glyph: '🏠', path: './houses-app' },
  { id: 'health', title: 'Health', glyph: '🩺', path: './health-app' },
  { id: 'school', title: 'School', glyph: '🎓', path: './school-app' },
  { id: 'career', title: 'Career', glyph: '💼', path: './career-app' },
  { id: 'contacts', title: 'Contacts', glyph: '📇', path: './contacts-app' },
  { id: 'patti', title: 'Mt Patti', glyph: '⛰️', path: './patti-app' },
  { id: 'story', title: 'Confluence Path', glyph: '📖', path: './story-app' },
  { id: 'whot', title: 'Whot!', glyph: '🃏', path: './whot-app' },
]
