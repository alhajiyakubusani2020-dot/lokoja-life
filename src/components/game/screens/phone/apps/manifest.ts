/**
 * M21 — THE APP MANIFEST
 * ----------------------
 * Ten new phone apps, gate 1 of the content-breadth push. The parent
 * maps these into the phone registry (PhoneScreen owns the union +
 * titles grid; this file owns only the honest list). Each entry's
 * component file exports APP_ID / APP_TITLE / APP_GLYPH — the law
 * suite proves the manifest agrees with the files, id by id.
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
