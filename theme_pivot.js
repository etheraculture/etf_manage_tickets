const fs = require('fs');

let css = fs.readFileSync('frontend/src/styles/global.css', 'utf8');

const newRoot = `
:root {
  /* BACKGROUNDS */
  --color-bg-dark: #F8FAFC;
  --color-bg-darker: #F1F5F9;
  --color-bg-card: #FFFFFF;
  --color-bg-card-hover: #F8FAFC;
  
  /* BORDERS */
  --color-border: #E2E8F0;
  --color-border-focus: #CBD5E1;
  
  /* BRAND PRIMARY (Slate 900 / Enterprise Black) */
  --color-teal: #0F172A;
  --color-teal-light: #334155;
  --color-teal-dark: #000000;
  --color-teal-glow: transparent;

  /* ACCENT */
  --color-accent-orange: #EA580C;
  --color-accent-orange-light: #F97316;
  
  /* TEXT */
  --color-white: #0F172A; /* Testi principali ora sono scuri */
  --color-true-white: #FFFFFF; /* Per il testo sui bottoni scuri */
  --color-gray-100: #1E293B;
  --color-gray-200: #334155;
  --color-gray-300: #475569;
  --color-gray-400: #64748B;
  --color-gray-500: #94A3B8;
  --color-gray-600: #CBD5E1;
  --color-gray-800: #F1F5F9;

  /* FEEDBACK */
  --color-success: #16A34A;
  --color-success-bg: #DCFCE7;
  --color-warning: #D97706;
  --color-warning-bg: #FEF3C7;
  --color-error: #DC2626;
  --color-error-bg: #FEE2E2;

  /* TYPOGRAPHY */
  --font-display: 'Inter', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, sans-serif;

  /* SPACING */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* BORDERS */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 50%;

  /* SHADOWS (Flat / Minimal) */
  --shadow-sm: 0 1px 2px 0 rgba(0,0,0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0, 0.05), 0 2px 4px -2px rgba(0,0,0,0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0, 0.05), 0 4px 6px -4px rgba(0,0,0,0.05);
  --shadow-teal: none;
  
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
`;

// 1. Applica nuovo :root
css = css.replace(/:root\s*\{[\s\S]*?\n\}/, newRoot.trim());

// 2. Inverti le trame scure: tutto ciò che era rgba(255, 255, 255, alpha) per i bordi chiari su sfondo scuro
// lo convertiamo in rgba(0, 0, 0, alpha) per bordi scuri su sfondo chiaro
css = css.replace(/rgba\(255,\s*255,\s*255,\s*(0\.\d+)\)/g, 'rgba(0, 0, 0, $1)');

// 3. I gradienti lineari vengono abbattuti a sfondi solidi (flat design)
// Mappiamo i bottoni e i nav ai loro colori primari
css = css.replace(/background:\s*linear-gradient[^;]+var\(--color-teal\)[^;]+;/g, 'background: var(--color-teal);');
css = css.replace(/background:\s*linear-gradient[^;]+var\(--color-bg-dark\)[^;]+;/g, 'background: var(--color-bg-card);');
css = css.replace(/background:\s*linear-gradient\s*\([^;]+;/g, 'background: var(--color-bg-card);');
css = css.replace(/background:\s*radial-gradient\s*\([^;]+;/g, 'background: transparent;');

// 4. Correggi alcune peculiarità hardcoded di dark mode
// Alcuni testi come h1 usavano white, e va bene perché "--color-white" ora è il nero per la light mode.
// MA i testi dentro i bottoni (primari) devono rimanere bianchi puri (--color-true-white).
css = css.replace(/color:\s*var\(--color-white\);/g, 'color: var(--color-true-white);');

// Fissiamo il testo globale per il body (che era white)
css = css.replace(/color:\s*var\(--color-true-white\);(\s*\/\* test globale \*\/)?/g, 'color: var(--color-white);');

// 5. Elimina lo styling custom esagerato (border dashed vs solid)
css = css.replace(/border-bottom:\s*1px\s*dashed/g, 'border-bottom: 1px solid');
css = css.replace(/border-top:\s*1px\s*dashed/g, 'border-top: 1px solid');

// 6. Fix specific per tabelle e modern-card
// Modern card usa background che è stato azzerato, assicuriamoci che sia var(--color-bg-card)
css = css.replace(/\.modern-card\s*\{[\s\S]*?\}/g, (match) => {
  let res = match.replace(/background:[^;]+;/, 'background: var(--color-bg-card);');
  res = res.replace(/border:[^;]+;/, 'border: 1px solid var(--color-border);');
  return res;
});

// Admin-main background cleanup
css = css.replace(/\.app-container\s*\{[\s\S]*?\}/g, match => match.replace(/background:[^;]+;/, 'background: var(--color-bg-dark);'));

// Write modified CSS
fs.writeFileSync('frontend/src/styles/global.css', css);
console.log('Light Theme Enterprise CSS generato con successo!');
