import json, statistics

d = json.load(open('om_daily.json'))['daily']
n = len(d['time'])
months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

def vals(key, i):
    v = d[key][i]
    return v if v is not None else None

bym = {m: [] for m in range(1, 13)}      # mean temp
bymx = {m: [] for m in range(1, 13)}     # max temp
bymn = {m: [] for m in range(1, 13)}     # min temp
rainm = {m: [] for m in range(1, 13)}    # daily rain
byyear = {}
for i in range(n):
    t = d['time'][i]; y = int(t[:4]); mo = int(t[5:7])
    v = vals('temperature_2m_mean', i)
    if v is not None: bym[mo].append(v)
    v = vals('temperature_2m_max', i)
    if v is not None: bymx[mo].append(v)
    v = vals('temperature_2m_min', i)
    if v is not None: bymn[mo].append(v)
    r = d['precipitation_sum'][i] or 0
    rainm[mo].append(r)
    byyear.setdefault(y, [0.0, 0.0, 0])
    byyear[y][0] += vals('temperature_2m_mean', i) or 0
    byyear[y][1] += r
    byyear[y][2] += 1

print('Lokoja (7.790N, 6.753E) — ERA5 reanalysis, daily 2015-2024')
print('Mon  Tmean  Tmax  Tmin  RainTotal(mm,10y avg)  WetDays>=1mm(avg)')
for mo in range(1, 13):
    wet = 0
    for y in range(2015, 2025):
        cnt = sum(1 for j in range(n) if d['time'][j].startswith(f'{y}-{mo:02d}') and (d['precipitation_sum'][j] or 0) >= 1)
        wet += cnt
    print(f'{months[mo-1]}  {statistics.mean(bym[mo]):5.1f} {statistics.mean(bymx[mo]):5.1f} {statistics.mean(bymn[mo]):5.1f} {statistics.mean(rainm[mo]):7.1f}  {wet/10:5.1f}')

print()
print('Annual totals per year (rain mm, mean T):')
for y in sorted(byyear):
    t_, r_, c_ = byyear[y]
    print(f'{y}: rain {r_:7.1f} mm, meanT {t_/c_:5.2f}')

# wettest day top 10
days = sorted(range(n), key=lambda j: -(d['precipitation_sum'][j] or 0))[:10]
print()
print('Top-10 wettest days:')
for j in days:
    print(d['time'][j], round(d['precipitation_sum'][j] or 0, 1), 'mm')

# dry-season length: consecutive months with <25mm avg
print()
# first/last rain per year
for y in range(2015, 2025):
    first = last = None
    for j in range(n):
        if not d['time'][j].startswith(str(y)): continue
        if (d['precipitation_sum'][j] or 0) >= 10:
            if first is None: first = d['time'][j]
            last = d['time'][j]
    print(f'{y}: first >=10mm rain {first}, last {last}')
