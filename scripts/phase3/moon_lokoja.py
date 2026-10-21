#!/usr/bin/env python3
"""
LOKOJA MOON GEOMETRY - reproducible companion to scripts/phase3/solar_lokoja.py
Rule-zero evidence standard: deterministic computation, cross-validated against
timeanddate.com 2026 Lagos phase table (anchors: Full Sep 26 2026 ~17:49 WAT,
Third Quarter Oct 3 2026 ~14:25 WAT, New May 16 2026, Blue Moon May 31 2026).

Method (Meeus, truncated):
  - Sun/moon ecliptic longitudes with the 4 dominant lunar perturbations
    (evection, variation, yearly equation, annual + a2 term).
  - Phase angle -> illumination fraction (1-cos i)/2.
  - Topocentric-ish altitude at Lokoja (7.790N, 6.753E) via hour angle
    (geocentric; parallax ~1 deg ignored, stated in output).
Output: research/phase3/moon-output.txt
"""
import math
from datetime import datetime, timedelta, timezone

LAT, LON = 7.790, 6.753  # game origin, matches solar_lokoja.py
WAT = timezone(timedelta(hours=1))

def jd(dt_utc):
    y, m = dt_utc.year, dt_utc.month
    d = dt_utc.day + (dt_utc.hour + dt_utc.minute/60 + dt_utc.second/3600)/24
    if m <= 2:
        y -= 1; m += 12
    A = y // 100
    B = 2 - A + A // 4
    return int(365.25*(y+4716)) + int(30.6001*(m+1)) + d + B - 1524.5

def sun_moon(jde):
    T = (jde - 2451545.0)/36525.0
    # Sun
    L0 = (280.46646 + 36000.76983*T + 0.0003032*T*T) % 360
    M = math.radians((357.52911 + 35999.05029*T - 0.0001537*T*T) % 360)
    C = (1.914602 - 0.004817*T - 0.000014*T*T)*math.sin(M) \
        + (0.019993 - 0.000101*T)*math.sin(2*M) + 0.000289*math.sin(3*M)
    sun_lon = (L0 + C) % 360
    # Moon mean elements
    Lp = (218.3164477 + 481267.88123421*T - 0.0015786*T*T + T*T*T/538841) % 360
    D = (297.8501921 + 445267.1114034*T - 0.0018819*T*T + T*T*T/545868) % 360
    Mp = (134.9633964 + 477198.8675055*T + 0.0087414*T*T + T*T*T/69699) % 360
    Ms = M % 360
    F = (93.2720950 + 483202.0175233*T - 0.0036539*T*T) % 360
    # dominant perturbations of lunar longitude (degrees)
    lon = Lp \
        + 6.288774*math.sin(math.radians(Mp)) \
        + 1.274027*math.sin(math.radians(2*D - Mp)) \
        + 0.658314*math.sin(math.radians(2*D)) \
        + 0.213618*math.sin(math.radians(2*Mp)) \
        - 0.185116*math.sin(math.radians(Ms)) \
        - 0.114332*math.sin(math.radians(2*F)) \
        + 0.058793*math.sin(math.radians(2*(D - Mp))) \
        + 0.057066*math.sin(math.radians(2*D - Ms - Mp)) \
        + 0.053322*math.sin(math.radians(2*D + Mp)) \
        + 0.045758*math.sin(math.radians(2*D - Ms))
    lon %= 360
    # elongation & phase angle
    elong = (lon - sun_lon) % 360
    i = math.radians(180.0 - elong)
    illum = (1 - math.cos(i))/2
    # ecliptic -> equatorial (obliquity J2000-ish)
    eps = math.radians(23.4393 - 0.0130*T)
    lam, beta = math.radians(lon), math.radians(0.0)  # ecliptic latitude ignored (<0.3 deg effect on alt)
    ra = math.degrees(math.atan2(math.sin(lam)*math.cos(eps) - math.tan(beta)*math.sin(eps), math.cos(lam))) % 360
    dec = math.degrees(math.asin(math.sin(eps)*math.sin(lam)*math.cos(beta) + math.cos(eps)*math.sin(beta)))
    return illum, ra, dec, elong

def altitude(dt_wat, ra, dec):
    jde = jd(dt_wat.astimezone(timezone.utc))
    T = (jde - 2451545.0)/36525.0
    gmst = (280.46061837 + 360.98564736629*(jde - 2451545.0) + 0.000387933*T*T) % 360
    lst = (gmst + LON) % 360
    H = math.radians((lst - ra) % 360)
    phi, delta = math.radians(LAT), math.radians(dec)
    alt = math.degrees(math.asin(math.sin(phi)*math.sin(delta) + math.cos(phi)*math.cos(delta)*math.cos(H)))
    return alt

# --- Part A: 2026 phase calendar (find extrema of elongation) ---
# scan in 20-min steps; extrema when elong crosses 0/90/180/270 within tolerance
events = []
t = datetime(2026, 1, 1, tzinfo=WAT)
end = datetime(2027, 1, 1, tzinfo=WAT)
step = timedelta(minutes=20)
prev_e, prev_t = None, None
def phase_of(el):
    if el < 22.5: return "New"
    if el < 67.5: return "Waxing Crescent"
    if el < 112.5: return "First Quarter"
    if el < 157.5: return "Waxing Gibbous"
    if el < 202.5: return "Full"
    if el < 247.5: return "Waning Gibbous"
    if el < 292.5: return "Last Quarter"
    if el < 337.5: return "Waning Crescent"
    return "New"
# extrema: elongation stationary points at 0(new)/180(full) & crossing 90/270
while t < end:
    jde = jd(t.astimezone(timezone.utc))
    _,_,_,e = sun_moon(jde)
    if prev_e is not None:
        for target, name in ((0,"New"),(90,"First Quarter"),(180,"Full"),(270,"Last Quarter")):
            da_p = (prev_e - target + 180) % 360 - 180
            da_c = (e - target + 180) % 360 - 180
            if da_p * da_c < 0 and abs(da_c) < 30:
                # bisect on wrapped angular difference
                a, b = prev_t, t
                for _ in range(24):
                    m = a + (b-a)/2
                    jm = jd(m.astimezone(timezone.utc))
                    _,_,_,em = sun_moon(jm)
                    da = (em - target + 180) % 360 - 180
                    if da > 0: b = m
                    else: a = m
                events.append((a + (b-a)/2, name))
    prev_e, prev_t = e, t
    t += step

# --- Part B: nightly illumination + evening altitude at 18:30 / 21:00 WAT ---
rows = []
t = datetime(2026, 1, 1, tzinfo=WAT)
while t < end:
    out = {"date": t.date()}
    for hh, mm, key in ((18,30,"e1830"),(21,0,"e2100")):
        dt = t.replace(hour=hh, minute=mm)
        jde = jd(dt.astimezone(timezone.utc))
        illum, ra, dec, e = sun_moon(jde)
        alt = altitude(dt, ra, dec)
        out[key] = (illum, alt)
    rows.append(out)
    t += timedelta(days=1)

lines = []
A = lines.append
A("LOKOJA MOON GEOMETRY - 7.790N 6.753E, Africa/Lagos (UTC+1) - computed 2026-10-22")
A("Method: Meeus truncated lunar theory (8 longitude perturbations); geocentric altitude (parallax ~1 deg not applied, stated).")
A("Cross-validation anchors (timeanddate.com, Lagos): Full 2026-09-26 ~17:49 WAT; LQ 2026-10-03 ~14:25 WAT;")
A("  New 2026-05-16; Blue (second) Full 2026-05-31. Deltas in Part A must be <= ~40 min.")
A("")
A("## A. 2026 LUNAR PHASE CALENDAR (WAT)")
A("| Event | Date/Time (WAT) |")
A("|---|---|")
for dt, name in events:
    A(f"| {name} | {dt.strftime('%Y-%m-%d %H:%M')} |")
A("")
A("## B. MONTHLY NIGHT SUMMARY (illumination % / moon altitude deg at 18:30 & 21:00 WAT)")
A("| Month | 18:30 illum% | 18:30 alt | 21:00 illum% | 21:00 alt |")
A("|---|---|---|---|---|")
import collections
by_month = collections.defaultdict(list)
for r in rows: by_month[r["date"].month].append(r)
for mth in range(1, 13):
    rs = by_month[mth]
    i18 = sum(r["e1830"][0] for r in rs)/len(rs)*100
    a18 = sum(r["e1830"][1] for r in rs)/len(rs)
    i21 = sum(r["e2100"][0] for r in rs)/len(rs)*100
    a21 = sum(r["e2100"][1] for r in rs)/len(rs)
    A(f"| 2026-{mth:02d} | {i18:.0f} | {a18:+.0f} | {i21:.0f} | {a21:+.0f} |")
A("")
A("## C. DARK-MOON EVENINGS (illum <5% at both 18:30 and 21:00) - 'generator-lit compound nights'")
for r in rows:
    if r["e1830"][0] < 0.05 and r["e2100"][0] < 0.05:
        A(f"| {r['date']} | dark |")
A("")
A("## D. FULL-MOON EVENINGS (illum >97% at 18:30) - 'Patti silhouettes by moonlight'")
for r in rows:
    if r["e1830"][0] > 0.97:
        A(f"| {r['date']} | full at 18:30 ({r['e1830'][1]:+.0f} deg alt) |")

out = "\n".join(lines)
with open("research/phase3/moon-output.txt", "w") as f:
    f.write(out + "\n")
print(out)
print("\nVALIDATION CHECK (Part A vs timeanddate Lagos anchors):")
for dt, name in events:
    if dt.month == 9 and name == "Full": print(f"  computed Full Sep: {dt.strftime('%Y-%m-%d %H:%M')} WAT vs anchor 2026-09-26 17:49")
    if dt.month == 10 and name == "Last Quarter": print(f"  computed LQ Oct: {dt.strftime('%Y-%m-%d %H:%M')} vs anchor 2026-10-03 14:25")
    if dt.month == 5 and name in ("New","Full"): print(f"  computed {name} May: {dt.strftime('%Y-%m-%d %H:%M')} vs anchors New 05-16 / Full 05-31")
