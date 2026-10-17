#!/usr/bin/env python3
"""M23 W2 — splice the new species-guild FloraTrees into CityMesh.tsx.
Replaces lines 764..1012 (old makeFrondGeometry + Trees()) with the new
block. 1-indexed, inclusive. Idempotence guard: refuses if the marker
text is missing at the boundaries."""
import sys

PATH = '/home/z/my-project/src/components/game/world/CityMesh.tsx'
NEW = '/home/z/my-project/scripts/m23-new-trees.tsx.txt'

with open(PATH, encoding='utf-8') as f:
    lines = f.readlines()
with open(NEW, encoding='utf-8') as f:
    new_block = f.read()

# boundary sanity (1-indexed): 764 must be the trees header, 1012 the close
assert 'trees' in lines[763] and 'trees' in lines[763], f'line 764 mismatch: {lines[763]!r}'
assert lines[763].startswith('/* ---'), f'line 764 mismatch: {lines[763]!r}'
assert lines[1011].rstrip() == '}', f'line 1012 mismatch: {lines[1011]!r}'
assert 'makeFrondGeometry' in lines[766], f'line 767 mismatch: {lines[766]!r}'

out = lines[:763] + [new_block] + lines[1012:]
with open(PATH, 'w', encoding='utf-8') as f:
    f.writelines(out)
print(f'spliced: {len(lines)} -> {len(out)} lines')
