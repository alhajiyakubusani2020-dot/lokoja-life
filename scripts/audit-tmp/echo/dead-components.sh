#!/bin/bash
# Team Echo — dead component finder: a component is "referenced" if its basename
# (minus extension) appears in an import statement anywhere in src (excluding itself).
cd /home/z/my-project
for f in $(find src/components/game -name '*.tsx' | sort); do
  base=$(basename "$f" .tsx)
  [ "$base" = "index" ] && continue
  refs=$(rg -c "from ['\"].*/${base}['\"]|from ['\"]\./${base}['\"]|from ['\"]\.\./${base}['\"]|from ['\"]@/components/game.*${base}['\"]" src --glob '!'"$f" 2>/dev/null | awk -F: '{s+=$2} END {print s+0}')
  if [ "$refs" -eq 0 ]; then
    # double-check: dynamic or lazy import by name
    dyn=$(rg -c "import\(.*${base}|lazy(.*${base}" src --glob '!' "$f" 2>/dev/null | awk -F: '{s+=$2} END {print s+0}')
    if [ "$dyn" -eq 0 ]; then
      echo "UNREFERENCED: $f"
    fi
  fi
done
echo "--- scan complete"
