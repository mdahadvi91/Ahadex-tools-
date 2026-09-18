// High quality, crisp SVG vector human portrait of Mohammad Ahad tailored for all 16 template colorways.
// Using inline SVG data URIs ensures:
// 1. 100% visible human portrait in every template preview and editor.
// 2. Zero CORS or network fetch issues when exporting to high-res JPG or PDF.
// 3. Crisp rendering at 1050x600 px without pixelation.

export const createPortraitSvg = (accent: string, bg: string, idNum: number): string => {
  const isDark = !bg.includes('#f') && !bg.includes('#fff');
  const tieColor = accent;
  const suitColor = isDark ? '#181b22' : '#232936';
  const shirtColor = isDark ? '#e2e8f0' : '#ffffff';
  const skinTone = '#dca682';
  const hairColor = '#1a1816';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
    <defs>
      <linearGradient id="bgGrad${idNum}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0.25"/>
      </linearGradient>
      <radialGradient id="halo${idNum}" cx="50%" cy="38%" r="45%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <filter id="shadow${idNum}" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.4"/>
      </filter>
    </defs>
    <rect width="400" height="500" fill="url(#bgGrad${idNum})"/>
    <circle cx="200" cy="190" r="140" fill="url(#halo${idNum})"/>
    
    <!-- Shoulders & Suit -->
    <path d="M 60 500 C 60 380, 110 320, 200 320 C 290 320, 340 380, 340 500 Z" fill="${suitColor}" filter="url(#shadow${idNum})"/>
    
    <!-- Shirt Collar & V-Neck -->
    <polygon points="200,340 160,320 175,440 200,470 225,440 240,320" fill="${shirtColor}"/>
    <polygon points="175,320 200,340 200,430 180,390" fill="#cbd5e1"/>
    
    <!-- Tie -->
    <polygon points="194,340 206,340 212,450 200,480 188,450" fill="${tieColor}"/>
    <polygon points="193,340 207,340 204,360 196,360" fill="${accent}" opacity="0.9"/>
    
    <!-- Suit Lapels -->
    <path d="M 120 400 L 165 320 L 195 440 L 135 500 Z" fill="#1e222d"/>
    <path d="M 280 400 L 235 320 L 205 440 L 265 500 Z" fill="#14171e"/>
    
    <!-- Neck -->
    <rect x="175" y="240" width="50" height="90" rx="10" fill="${skinTone}"/>
    <path d="M 175 290 Q 200 320 225 290 Z" fill="#c48a66" opacity="0.4"/>
    
    <!-- Face Head -->
    <ellipse cx="200" cy="200" rx="68" ry="82" fill="${skinTone}" filter="url(#shadow${idNum})"/>
    
    <!-- Ears -->
    <ellipse cx="132" cy="205" rx="10" ry="18" fill="${skinTone}"/>
    <ellipse cx="268" cy="205" rx="10" ry="18" fill="${skinTone}"/>
    
    <!-- Hair & Beard -->
    <!-- Professional Modern Haircut -->
    <path d="M 134 185 C 130 140, 150 115, 200 115 C 250 115, 270 140, 266 185 C 255 145, 235 130, 200 130 C 165 130, 145 145, 134 185 Z" fill="${hairColor}"/>
    <path d="M 140 150 C 160 120, 230 118, 260 145 C 240 125, 180 125, 140 150 Z" fill="#2d2621"/>
    
    <!-- Neat Executive Beard / Stubble -->
    <path d="M 148 215 C 150 270, 175 288, 200 288 C 225 288, 250 270, 252 215 C 248 245, 230 275, 200 275 C 170 275, 152 245, 148 215 Z" fill="${hairColor}" opacity="0.85"/>
    <path d="M 180 252 Q 200 256 220 252 Q 200 262 180 252" fill="${hairColor}" opacity="0.9"/>
    
    <!-- Eyebrows -->
    <path d="M 158 178 Q 175 170 188 177" stroke="${hairColor}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <path d="M 242 178 Q 225 170 212 177" stroke="${hairColor}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    
    <!-- Eyes -->
    <ellipse cx="174" cy="192" rx="7" ry="5.5" fill="#ffffff"/>
    <circle cx="174" cy="192" r="3.5" fill="#1e1e1e"/>
    <circle cx="175.5" cy="190.5" r="1.2" fill="#ffffff"/>
    
    <ellipse cx="226" cy="192" rx="7" ry="5.5" fill="#ffffff"/>
    <circle cx="226" cy="192" r="3.5" fill="#1e1e1e"/>
    <circle cx="227.5" cy="190.5" r="1.2" fill="#ffffff"/>
    
    <!-- Nose -->
    <path d="M 200 185 L 198 220 L 206 222" stroke="#b57a55" stroke-width="3" stroke-linecap="round" fill="none"/>
    
    <!-- Smile -->
    <path d="M 185 240 Q 200 248 215 240" stroke="#965839" stroke-width="3" stroke-linecap="round" fill="none"/>
    
    <!-- Pocket Square Accent -->
    <polygon points="125,440 145,430 150,445 130,455" fill="${accent}" opacity="0.8"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const AHADEX_LOGO_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="50%" stop-color="#818cf8"/>
        <stop offset="100%" stop-color="#c084fc"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="44" fill="#090d16"/>
    <rect x="8" y="8" width="184" height="184" rx="38" fill="none" stroke="url(#logoGrad)" stroke-width="4" stroke-opacity="0.4"/>
    <polygon points="100,30 170,165 142,165 125,130 75,130 58,165 30,165" fill="url(#logoGrad)"/>
    <polygon points="100,75 84,112 116,112" fill="#090d16"/>
    <circle cx="100" cy="100" r="8" fill="#38bdf8"/>
  </svg>`
)}`;
