# LOKOJA LIFE — ECONOMY BIBLE
### The named money reference · v1.0 · 2026-10-22
> **Authority.** This book CONSOLIDATES and extends the economy rows of `Master_Dossier.md` (D1–D3),
> `World_Bible_Expansion.md` Part V, and `docs/phase3/01-RESEARCH-DOSSIER.md` §2.1/§4 (all binding,
> unmodified). Evidence: `research/phase3/team-6-economy.md` (wages, prices, rents, POS economy,
> anchor institutions), Phase3_Research Part C-3/C-4 (rent verification, keke range), Red Team
> verdicts o/p/y, repo anchors (`data/config.ts` ECONOMY/TRAVEL, `systems/economy.ts`,
> `systems/housing.ts`, `systems/ledger.ts`, fortress schema). Extensions are marked **[EXT]**.
>
> **The question this book answers:** what does money mean in Lokoja 2026 — what things cost, what
> people earn, how the street moves cash — and how does the game's naira stay honest?

---

## PART I — THE ONE-PARAGRAPH TRUTH

Lokoja's economy is a cash-and-hustle economy living on a state minimum wage of ₦72,500, squeezed by
rents that tripled in two years and food inflation near 20% — where the fastest-growing street trade
is the POS agent under an umbrella, the biggest building site is a ₦50bn market, and the dormouse
giant Ajaokuta still draws billions with zero projected revenue. The game's naira must feel like
THIS naira: dated, priced, and conserved to the kobo.

## PART II — THE ANCHOR TABLE (every value dated; the citation law)

| Anchor | Value | Date | Source |
|---|---|---|---|
| Kogi wage floor | **₦72,500/mo** | Oct 2024 | kogistate.gov.ng (RT-j, official fetch) |
| Jollof pot (SBM Index) | **₦26,178** | Oct 2026 | Businessday + 3 outlets (RT-o) |
| Food inflation | ~19.6% y/y | Sep 2026 | team-6 |
| Petrol (corridor) | ₦1,370–1,429/L | Oct 2026 | Daily Post (RT-n; Lokoja-specific unverified — labelled) |
| Room & parlour rent | ₦200k→**₦650k/yr**; self-cont ₦250–300k/yr | Aug 2026 | THISDAY full text (C-3, X13 resolved; MED) |
| Move-in rule | 1 yr upfront + 10% agency + caution ≈ **₦250k cash** | 2026 | Kogi Reports + team-6 |
| Okada fare (natl) | ₦920.95 | Feb 2026 | NBS Transport Fare Watch (RT-m) |
| Intercity drop | ₦8,108.81 | Feb 2026 | NBS (RT-m) |
| Mai ruwa water | ~₦200/4L | 2024 | Daily Trust full text (RT-h; A11-corrected list) |
| IGR (Kogi) | ₦43.9bn | 2025 | team-6 |
| Ajaokuta allocation | ₦6.04–6.5bn, zero projected revenue | 2026 | FIJ + Vanguard (RT-y) |
| Ultra-Modern Market | 25 ha, 7 markets, ₦50bn sukuk | 2026 | KSG full text + sukuk multi-outlet (RT-z) |
| POS cash-out cap | ₦100k/day (personal) | CBN rule | team-6 |

## PART III — THE GAME DELTAS (D1–D3 binding + W5 law)

| # | Repo today | Research says | The ruling |
|---|---|---|---|
| D1 | meals ₦220–700 (`config.ts:386-394`) | ≈2× too cheap vs 2026 food evidence | uplift ×1.5–2.5, MED flag, dated anchors |
| D2 | basic-room rent ≈₦10.7k/mo (`config.ts:170`) | cheapest real room ≈₦20.8–25k/mo | ≈×2.3 uplift + the move-in cash rule |
| D3 | biz staff wage ₦400/day (`config.ts:798`) | ≈1/6 of sourced minimum-wage day-rate | ₦1,200–2,500/day band |

W5 recalibration touches CONSTANTS ONLY; kobo-chain conservation batteries (F1/F2) rerun after
(M4 criterion). Every changed constant carries a dated-anchor comment; prices age via the Bible
amendment path (Content_Expansion I.4).

## PART IV — THE STREET ECONOMY [EXT — what NPCs and systems must model]

1. **The POS agent is the bank of the street:** umbrella + hand-painted "POS & DATA" sign
   (v3-market3, Unsplash — photographed in the wild); CBN caps; PND freezes; fraud-syndicate
   geography (Cantonment/Kpata/Nataco). The float-ledger hustle (W5) implements the documented trade.
2. **Rental pressure texture (C-3, new):** landlords preferring "Yahoo boys" tenants; tenants
   appealing for landlord-tenant regulation and housing estates — dialogue/hustle flavour, sourced.
3. **Market day economics:** 5-day Kpata pulse drives stall migration and price wobble; the market
   dB peak (17:00–19:00) is also the price-peak hour; fish stalls busy AND fish expensive (X12
   tension held).
4. **Anchor institutions as dialogue/quest furniture:** Obajana cement (Africa's largest, operating;
   Cottage Hospital commissioned 2026-07-10 — team-9), Ajaokuta (dormant-giant dialogue), KGIRS
   digital IGR (cash collection banned — matches the civic desk), Greater Lokoja Water Works
   restoration arc.
5. **Business ownership ladder (built):** biz purchase → staff hire (D3 wages) → solar fitting →
   fleet gig economy (park gig board, gig driving — m5/m24 evidence); all money through the fortress
   chain, `biz staffWagePerDay` constants via W5.

## PART V — THE CONSERVATION FRAMEWORK [EXT — the built law]

1. **Purse = server hash-chained ledger** (`WalletRow` + `LedgerRow`, `idemKey @unique` replay law,
   `chainHash` tamper chain, `version` optimistic lock — schema.prisma).
2. **Pocket = signed fortress chain** with velocity + income guards + HMAC envelope (save.ts,
   fortress.ts; ERA2 audit §1).
3. **The one-cap law:** the relay's day eye counts transfer+tip+refuel+repair (the W9 letter made
   TRUE, hardening commit `5aeafb6`); deposit day-cap 200k server-side.
4. **Known honest debts:** 5 direct-cash bypass sites (festival/ferry/travel + bank
   deposit/withdraw unsigned writes — ERA2 audit §5.A, still open, tracked); Content_Expansion II.4
   blocks double-spend-authority multiplayer content until server-authoritative wallets fully close it.
5. **Multiplayer money:** in-game naira only, forever; real P2P money transmission = CBN PSP
   territory, never touched (`MULTIPLAYER_PLAN.md` §3.4 honesty clause).

## PART VI — HONEST GAPS

Buka plate prices · stall-right prices · whole-house rent table · Lokoja-specific pump price ·
hotel naira rates (Fieldwork-class debts — Dossier Part III.4) · no verified 2026 population for
per-capita framing (stays qualitative, B2).

## PART VII — GATES

1. All price constants carry dated-anchor comments (M4 criterion; grep-verifiable).
2. Move-in rule ≈₦250k cash demonstrable in a fresh save (M4).
3. Kobo-chain conservation battery F1/F2 green after any W5 recalibration (M4).
4. POS float ledger round-trips (open → serve → close → reconcile).
5. No in-game copy states a rent/price without its anchor class (exact figure + year, or qualitative).
