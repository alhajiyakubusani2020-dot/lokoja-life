#!/usr/bin/env python3
"""
LOKOJA LIFE — Phase 3 Prelude: reproducible solar geometry for the Lighting Bible.
Location: Lokoja (game origin): 7.790 N, 6.753 E — TZ Africa/Lagos (UTC+1), no DST.
Algorithm: NOAA Solar Calculator spreadsheet equations (general solar calc).
Cross-validation: Team 1 sourced sunrise-sunset.org API for the same coordinates
(research/phase3/team-1-geography.md §2.10) — this script must land within ~2 min.
Run: python3 scripts/phase3/solar_lokoja.py
"""
import math
from datetime import date, timedelta

LAT, LON, TZ = 7.790, 6.753, 1.0
RAD = math.pi / 180.0

def solar_params(d: date):
    yday = d.timetuple().tm_yday
    gamma = 2 * math.pi / 365.0 * (yday - 1)
    eqtime = 229.18 * (0.000075 + 0.001868 * math.cos(gamma) - 0.032077 * math.sin(gamma)
                       - 0.014615 * math.cos(2 * gamma) - 0.040849 * math.sin(2 * gamma))  # minutes
    decl = (0.006918 - 0.399912 * math.cos(gamma) + 0.070257 * math.sin(gamma)
            - 0.006758 * math.cos(2 * gamma) + 0.000907 * math.sin(2 * gamma)
            - 0.002697 * math.cos(3 * gamma) + 0.00148 * math.sin(3 * gamma))  # radians
    return eqtime, decl

def ha_deg(zenith_deg, decl):
    cos_ha = (math.cos(zenith_deg * RAD) / (math.cos(LAT * RAD) * math.cos(decl))
              - math.tan(LAT * RAD) * math.tan(decl))
    return math.degrees(math.acos(max(-1.0, min(1.0, cos_ha))))

def fmt(minutes):
    if minutes is None: return "—"
    t = int(round(minutes)) % 1440
    return f"{t//60:02d}:{t%60:02d}"

def report(d: date):
    eq, decl = solar_params(d)
    noon_utc = 720 - 4 * LON - eq            # minutes UTC
    sunrise_utc = noon_utc - 4 * ha_deg(90.833, decl)
    sunset_utc  = noon_utc + 4 * ha_deg(90.833, decl)
    ct_a_utc = noon_utc - 4 * ha_deg(96.0, decl)
    ct_b_utc = noon_utc + 4 * ha_deg(96.0, decl)
    to_local = lambda m: m + TZ * 60
    noon_el = 90 - abs(LAT - math.degrees(decl))
    return {"eq": eq, "dec": math.degrees(decl),
            "sr": to_local(sunrise_utc), "ss": to_local(sunset_utc),
            "noon": to_local(noon_utc), "noon_el": noon_el,
            "ct_a": to_local(ct_a_utc), "ct_b": to_local(ct_b_utc),
            "day": (sunset_utc - sunrise_utc)}

def elev_az(d: date, hour: float):
    eq, decl = solar_params(d)
    st_minutes = hour * 60 + eq + 4 * LON - TZ * 60   # true solar time (min)
    ha = (st_minutes / 4.0 - 180.0) * RAD             # hour angle, deg->rad (0 at noon)
    latr = LAT * RAD
    sin_el = math.sin(latr) * math.sin(decl) + math.cos(latr) * math.cos(decl) * math.cos(ha)
    el = math.asin(max(-1, min(1, sin_el))) / RAD
    cos_az = (math.sin(decl) - math.sin(latr) * sin_el) / (math.cos(latr) * math.cos(el * RAD))
    az = math.acos(max(-1, min(1, cos_az))) / RAD
    az_final = (360 - az) if ha > 0 else az           # az from NORTH, clockwise
    return el, az_final

KEY = [("Dec solstice 2025", date(2025, 12, 21)), ("Equinox Mar 2026", date(2026, 3, 20)),
       ("Jun solstice 2026", date(2026, 6, 21)), ("Equinox Sep 2026", date(2026, 9, 23))]

print("LOKOJA SOLAR GEOMETRY — 7.790N 6.753E, Africa/Lagos (UTC+1) — computed", date.today().isoformat())
print("\n## A. Key dates (WAT). Cross-check target (sunrise-sunset.org, same coords):")
print("   Dec21 06:40:52/18:21:12 · Mar20 06:37:02/18:43:51 · Jun21 06:17:29/18:52:08")
print("| Date | Dec (deg) | Civil AM | Sunrise | Solar noon (noon elev) | Sunset | Civil PM | Day length |")
print("|---|---|---|---|---|---|---|---|")
for label, d in KEY:
    r = report(d)
    dl = int(round(r["day"]))
    print(f"| {label} ({d}) | {r['dec']:+.2f} | {fmt(r['ct_a'])} | {fmt(r['sr'])} | "
          f"{fmt(r['noon'])} ({r['noon_el']:.1f}°) | {fmt(r['ss'])} | {fmt(r['ct_b'])} | {dl//60}h{dl%60:02d}m |")

# zenith transit dates: declination crosses +7.790deg
print("\n## A2. Zenith-transit dates 2026 (|dec| crosses +7.790°)")
hits, prev = [], None
for n in range(0, 365):
    d = date(2026, 1, 1) + timedelta(days=n)
    dec = solar_params(d)[1] / RAD
    if prev is not None and (prev - LAT) * (dec - LAT) < 0:
        hits.append(d.isoformat())
    prev = dec
print("   ", ", ".join(hits))

print("\n## B. Hourly sun elevation / azimuth (degrees from true north, WAT, mid-hour)")
for label, d in [("Jun solstice", date(2026, 6, 21)), ("Equinox Mar", date(2026, 3, 20)),
                 ("Dec solstice", date(2025, 12, 21))]:
    print(f"\n### {label} ({d})")
    hours = list(range(5, 20))
    els, azs = [], []
    for h in hours:
        el, az = elev_az(d, h + 0.5)
        els.append(f"{el:5.1f}")
        azs.append(f"{az:5.1f}")
    print("|      | " + " | ".join(f"{h:02d}" for h in hours) + " |")
    print("| Elev | " + " | ".join(els) + " |")
    print("| Azim | " + " | ".join(azs) + " |")

print("\n## C. Golden-hour windows (sun -4°..+6°, approx = first/last 45-50 min of daylight)")
for label, d in KEY:
    r = report(d)
    print(f" {label}: AM ~{fmt(r['sr'])}–{fmt(r['sr']+50)} · PM ~{fmt(r['ss']-55)}–{fmt(r['ss'])} "
          f"(civil twilight ends {fmt(r['ct_b'])})")
