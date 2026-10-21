// CLI shim: the repo's scripts/geo/bootstrap.ts already hardcodes the absolute
// path — re-export it so the census lives in audit-tmp without edits to it.
export * from '../../../scripts/geo/bootstrap'
