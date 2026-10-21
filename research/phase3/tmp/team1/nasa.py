import json, statistics

p = json.load(open('nasa_2024.json'))['properties']['parameter']
months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

def monthly(param):
    d = p[param]
    bym = {m: [] for m in range(1, 13)}
    for k, v in d.items():
        if v is None or v < -900: continue
        y, mo = int(k[:4]), int(k[4:6])
        bym[mo].append(v)
    return {m: (statistics.mean(bym[m]) if bym[m] else None) for m in range(1, 13)}

for param, label in [('AOD_55', 'Aerosol Optical Depth 550nm'), ('WS2M', 'Wind speed 2m (m/s)'), ('WS2M_MAX', 'Wind max 2m (m/s)'), ('RH2M', 'Relative humidity 2m (%)'), ('T2M', 'Temp 2m (C)'), ('PRECTOTCORR', 'Precip corr (mm/day)'), ('ALLSKY_SFC_SW_DWN', 'Solar insolation (kWh/m2/day)')]:
    m = monthly(param)
    row = ' '.join(f'{months[i]}={m[i+1]:.2f}' if m[i+1] is not None else f'{months[i]}=--' for i in range(12))
    print(f'{label}: {row}')

# wet/dry wind directions aren't in POWER; note it.
