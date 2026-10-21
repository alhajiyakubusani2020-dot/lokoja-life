// CLI shim — same approach as ../charlie/bootstrap-shim: the repo's
// scripts/geo/bootstrap.ts hardcodes the absolute path, re-export it so
// the F3 verify scripts live in audit-tmp without edits to it.
export * from '../../../scripts/geo/bootstrap'
