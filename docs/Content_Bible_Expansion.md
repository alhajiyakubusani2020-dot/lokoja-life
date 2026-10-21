# LOKOJA LIFE — CONTENT BIBLE EXPANSION
### Permanent expansion rules: multiplayer content & future cities · v1.0 · 2026-10-22
> **Authority.** This book EXPANDS `docs/Content_Bible.md` v2.2 (canonical, unmodified). The canon's
> playbooks P1–P15, wire rulebook, save law, performance caps, copy laws, and red lines remain THE
> content law; this file adds the two domains the canon does not cover — **multiplayer content** and
> **future cities** — plus the evidence-citation path that binds research to content PRs. It Binds to
> `MULTIPLAYER_PLAN.md` (M24 plan, zero code) without amending it. Extensions marked **[EXT]**.

---

## PART I — THE CITATION PATH FOR ALL NEW CONTENT [EXT]

1. A content PR (new NPC, building, dish, job, festival, district content) must cite the bible line
   it implements; the bible line must cite a source (URL + date + confidence), a repo anchor, or an
   open-question flag (`Phase3_Research.md` standards, carried into law).
2. NIGERIA-GENERIC material may dress, but copy must never present it as Lokoja-specific fact.
3. Contradictions ship as content (NPC disputes) or stay unresolved in the contradiction register
   (`Phase3_Research.md` Part E) — never silently won.
4. Prices carry an implicit 2026 anchor and a Bible amendment path; naira constants change only via
   config with dated anchors (W5 pattern).

## PART II — MULTIPLAYER CONTENT STANDARDS [EXT]

The M24 plan's architecture is law-shaped and is adopted here as doctrine (no code yet — Content law
precedes implementation):

1. **The relay doctrine:** the server *distributes, never simulates* — same shape as the live laws
   (`systems/live.ts` is pure and headless; `/api/live/*` is a thin relay). New multiplayer content
   (games, trades, events) must fit this shape: deterministic client engines + thin server recording.
2. **Identity reuse:** the M9 identity (handle + PIN + ageBand + parent PIN) IS the multiplayer
   identity — no separate signup content may be designed.
3. **Safety tiers are content law:** kid = emotes-only; teen = 140 chars + word wall; adult = 280
   chars + link/phone/crypto stripping. Any new multiplayer surface (DMs, tables, co-op jobs) MUST
   re-apply the tier gates verbatim — no surface bypasses the wall.
4. **Money authority rule:** until server-authoritative wallets land (M24 gap #5), multiplayer
   content may record agreements (trades, stakes, contributions) but settlement stays each client's
   own honest engine (kobo-chain conservation). Content that would require double-spend authority is
   BLOCKED until that gap closes.
5. **Moderation content:** every social feature ships with its report/mute/block path in the same
   milestone (M24 gap #6) — a social surface without its ops door does not pass the Definition of Done.
6. **Co-presence content rules:** remote players are bodies in the world only where the crowd system
   already exists (density caps, district multipliers); remote avatars obey the same budget (no new
   animation rigs beyond the existing grammar).
7. **Real-culture rule for social content:** greetings, hospitality, and respect mechanics (05 §A.4)
   apply to player-to-player flavour the same as NPC flavour — the city's manners are the product.

## PART III — FUTURE CITIES STANDARD [EXT]

The engine may one day host cities other than Lokoja. The standard exists so a second city cannot
break the first one's identity:

1. **Research gate first.** A new city starts with a research phase EXACTLY shaped like this one:
   repo audit → independent specialist teams → red team → evidence consolidation → bibles. No
   city ships on stereotypes; "generic African city" content is forbidden the way it is forbidden
   here (no stock-photo logic).
2. **Bible clone procedure.** The canon stack (World / Experience / Art_Audio / Content + this
   phase's Environment / Lighting / Audio / Expansions) is forked per city; the Lokoja bibles stay
   untouched; shared systems (engine, economy chains, relay doctrine) stay single-source.
3. **Identity conservation per city.** Each city defines: its confluence-equivalent (the identity
   anchor), its Mount Patti (the viewpoint law), its zinc-equivalent (the material clock), its sound
   identity line, and its "stranger test" (a local must nod; a stranger must believe). Lokoja's
   definitions never transfer by copy-paste — they must be re-derived from the new city's evidence.
4. **Adjudication discipline.** The dossier pattern (A-numbered adjudications + X-numbered
   contradiction register) is the standing method; deviations from reality are conscious, logged
   decisions (the A7 regatta precedent is the model).
5. **Asset law scales down, not up.** Procedural-parameter-only art (A-2) holds for every city;
   reference libraries stay reference-only; zero binaries per city.
6. **Naming law:** city-specific named systems (streets, foods, festivals) come from the city's own
   research; engine-generic systems (kobo-chain, relay, weather scalars) never take a city's name.

## PART IV — CONTRIBUTOR ONBOARDING EXTENSION [EXT]

A new contributor's reading order: Design Constitution → Content_Bible v2.2 (P1–P15 + red lines) →
this file → the relevant domain bible (Environment/Lighting/Audio/World-Expansion) → the Dossier
adjudications (A1–A12) → `Master_Implementation_Roadmap.md` gates. After reading, the contributor can
answer: what is wired-or-dead, what needs evidence, what is blocked, and what gate their PR faces.

## PART V — RED LINES (additions, same force as canon Part X)

1. No multiplayer content that moves real-money value outside the conservation laws.
2. No social surface without moderation ops.
3. No second city built from templates, or before its research gate passes.
4. No content citing "research" that lacks a URL, repo anchor, or open-question flag.
5. No AI-generated reference imagery in any library (v2-cloth1 precedent: rejected on inspection).

## PART VI — GATES

1. Every content PR: bible-line citation present (Part I.1) — reviewer-enforced.
2. Multiplayer PRs: relay shape, tier gates, money rule, moderation door — all four or rejected.
3. Future-city proposals: research-gate plan + bible fork plan — before any design work.
4. This file cannot override Content_Bible canon; conflicts resolve in favour of canon and get
   logged in the contradiction register.
