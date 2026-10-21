import json, statistics

months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

def load(f):
    d = json.load(open(f))['daily']
    return d['time'], d['river_discharge']

def clim(f, label):
    t, q = load(f)
    bym = {m: [] for m in range(1,13)}
    for i, v in enumerate(q):
        if v is None: continue
        bym[int(t[i][5:7])].append(v)
    print(f'{label} — monthly mean discharge m3/s (GloFAS v4, 1985-2024):')
    print('  ' + '  '.join(f'{months[m-1]}={statistics.mean(bym[m]):.0f}' for m in range(1,13)))
    # peak day per year
    byy = {}
    for i, v in enumerate(q):
        if v is None: continue
        y = t[i][:4]
        if y not in byy or v > byy[y][1]: byy[y] = (t[i], v)
    print('  Annual peak date/value:')
    for y in sorted(byy):
        if int(y) >= 2010:
            print(f'   {y}: {byy[y][0]}  {byy[y][1]:.0f} m3/s')
    # minimum
    mn = min(v for v in q if v is not None)
    print(f'  40y minimum: {mn:.0f} m3/s')
    # low-water date climatology: day of year of annual minimum
    lowd = {}
    for i, v in enumerate(q):
        if v is None: continue
        y = t[i][:4]
        if y not in lowd or v < lowd[y][1]: lowd[y] = (t[i], v)
    doys = [int(lowd[y][0][5:7])*30 for y in lowd]
    print(f'  annual minimum month histogram:', {months[m-1]: sum(1 for y in lowd if int(lowd[y][0][5:7])==m) for m in range(1,13)})

clim('q_niger.json', 'NIGER upstream (7.790N 6.700E)')
print()
clim('q_benue.json', 'BENUE upstream (7.900N 7.000E)')
print()
clim('q_down.json', 'NIGER downstream of confluence (7.700N 6.740E)')
