// Team Echo audit — WCAG contrast for actual Lokoja token pairs (measured, not guessed)
// Tokens quoted verbatim from src/app/globals.css lines 132-151
const L = (hex, x, y) => {
  const c = [1, 3, 5].map((i) => {
    let v = parseInt(hex.substr(i, 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [l1, l2] = [L(a), L(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// tokens from globals.css
const T = {
  gold: '#e8a317',        // --lko-gold          (line 135)
  goldDeep: '#8a5a00',    // --lko-gold-deep     (line 136)
  goldSoft: '#fdf0d5',    // --lko-gold-soft     (line 137)
  cream: '#fbf3e4',       // --lko-cream         (line 141)
  surface: '#fffdf7',     // --lko-surface       (line 147)
  ink: '#22271f',         // --lko-ink           (line 143)
  inkSoft: '#6b6a5c',     // --lko-ink-soft      (line 144)
  green: '#146b3a',       // --lko-green         (line 132)
  greenSoft: '#e3f0e6',   // --lko-green-soft    (line 134)
  terra: '#c4562a',       // --lko-terra         (line 138)
};

const pairs = [
  ['ink on surface', T.ink, T.surface],
  ['ink-soft on surface', T.inkSoft, T.surface],
  ['ink-soft on cream', T.inkSoft, T.cream],
  ['gold on cream', T.gold, T.cream],
  ['gold on surface', T.gold, T.surface],
  ['gold-deep on gold-soft', T.goldDeep, T.goldSoft],
  ['green on green-soft', T.green, T.greenSoft],
  ['white on green', '#ffffff', T.green],
  ['terra on surface', T.terra, T.surface],
  ['gold-deep on surface', T.goldDeep, T.surface],
];
for (const [name, a, b] of pairs) {
  const r = ratio(a, b);
  const aa = r >= 4.5 ? 'PASS AA (normal)' : r >= 3 ? 'FAIL AA normal / PASS large' : 'FAIL AA (even large)';
  console.log(`${name.padEnd(26)} ${a} vs ${b}  →  ${r.toFixed(2)}:1   ${aa}`);
}
