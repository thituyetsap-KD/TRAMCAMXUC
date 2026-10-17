import React from 'react';

// 1. Happy Sun Face (Vui vẻ)
export const HappySunIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sun rays */}
    <g className="animate-spin" style={{ transformOrigin: '50% 50%', animationDuration: '24s' }}>
      <circle cx="50" cy="10" r="4.5" fill="#FBBF24" />
      <circle cx="78" cy="22" r="4.5" fill="#FBBF24" />
      <circle cx="90" cy="50" r="4.5" fill="#FBBF24" />
      <circle cx="78" cy="78" r="4.5" fill="#FBBF24" />
      <circle cx="50" cy="90" r="4.5" fill="#FBBF24" />
      <circle cx="22" cy="78" r="4.5" fill="#FBBF24" />
      <circle cx="10" cy="50" r="4.5" fill="#FBBF24" />
      <circle cx="22" cy="22" r="4.5" fill="#FBBF24" />
    </g>
    {/* Sun face body */}
    <circle cx="50" cy="50" r="32" fill="url(#sunGrad)" filter="drop-shadow(0 4px 6px rgba(251, 191, 36, 0.4))" />
    {/* Rosy cheeks */}
    <circle cx="34" cy="56" r="5" fill="#F87171" opacity="0.6" />
    <circle cx="66" cy="56" r="5" fill="#F87171" opacity="0.6" />
    {/* Big happy eyes */}
    <path d="M32 46 C34 40, 40 40, 42 46" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M58 46 C60 40, 66 40, 68 46" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" />
    {/* Big happy smile */}
    <path d="M38 56 C44 67, 56 67, 62 56" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" fill="#DC2626" />
    {/* Little tongue */}
    <path d="M44 62 C48 66, 52 66, 56 62" fill="#FCA5A5" />
    <defs>
      <linearGradient id="sunGrad" x1="20" y1="20" x2="80" y2="80">
        <stop stopColor="#FDE68A" />
        <stop offset="1" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
  </svg>
);

// 2. Sad Droplet Face (Buồn bã)
export const SadDropletIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 18 C50 18, 22 50, 22 68 C22 84, 34 92, 50 92 C66 92, 78 84, 78 68 C78 50, 50 18, 50 18 Z"
      fill="url(#dropletGrad)"
      filter="drop-shadow(0 4px 6px rgba(56, 189, 248, 0.35))"
    />
    {/* Soft cheeks */}
    <circle cx="36" cy="68" r="4.5" fill="#93C5FD" opacity="0.7" />
    <circle cx="64" cy="68" r="4.5" fill="#93C5FD" opacity="0.7" />
    {/* Sad eyes */}
    <ellipse cx="38" cy="58" rx="3.5" ry="4.5" fill="#0C4A6E" />
    <circle cx="37" cy="56" r="1.5" fill="#FFFFFF" />
    <ellipse cx="62" cy="58" rx="3.5" ry="4.5" fill="#0C4A6E" />
    <circle cx="61" cy="56" r="1.5" fill="#FFFFFF" />
    {/* Sad eyebrows tilted up */}
    <path d="M33 50 C37 47, 43 51, 43 51" stroke="#0C4A6E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M67 50 C63 47, 57 51, 57 51" stroke="#0C4A6E" strokeWidth="2.5" strokeLinecap="round" />
    {/* Gentle sad mouth */}
    <path d="M43 74 C47 70, 53 70, 57 74" stroke="#0C4A6E" strokeWidth="3" strokeLinecap="round" />
    {/* Little tear drop */}
    <path d="M68 64 C70 64, 72 67, 72 69 C72 71, 70 72, 68 72 C66 72, 65 71, 65 69 C65 67, 67 64, 68 64 Z" fill="#60A5FA" />
    <defs>
      <linearGradient id="dropletGrad" x1="30" y1="20" x2="70" y2="90">
        <stop stopColor="#BAE6FD" />
        <stop offset="1" stopColor="#38BDF8" />
      </linearGradient>
    </defs>
  </svg>
);

// 3. Anxious Face (Lo lắng)
export const AnxiousCloudIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cloud body */}
    <path
      d="M30 68 C22 68, 16 62, 16 54 C16 46, 22 41, 29 41 C31 31, 40 24, 51 24 C62 24, 71 31, 73 41 C79 41, 85 46, 85 53 C85 61, 79 68, 70 68 Z"
      fill="url(#cloudGrad)"
      filter="drop-shadow(0 4px 6px rgba(168, 85, 247, 0.3))"
    />
    {/* Worry sweat drop */}
    <path d="M78 34 C80 34, 82 37, 82 39 C82 41, 80 42, 78 42 C76 42, 75 41, 75 39 C75 37, 77 34, 78 34 Z" fill="#818CF8" />
    {/* Cheeks */}
    <circle cx="34" cy="54" r="4.5" fill="#DDD6FE" />
    <circle cx="66" cy="54" r="4.5" fill="#DDD6FE" />
    {/* Worried eyes */}
    <circle cx="39" cy="48" r="4" fill="#3B0764" />
    <circle cx="38" cy="46" r="1.5" fill="#FFFFFF" />
    <circle cx="61" cy="48" r="4" fill="#3B0764" />
    <circle cx="60" cy="46" r="1.5" fill="#FFFFFF" />
    {/* Wavy nervous mouth */}
    <path d="M42 59 Q46 56, 50 59 T58 59" stroke="#3B0764" strokeWidth="2.5" strokeLinecap="round" />
    {/* Little worry eyebrows */}
    <path d="M35 42 L43 45" stroke="#3B0764" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M65 42 L57 45" stroke="#3B0764" strokeWidth="2.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="cloudGrad" x1="25" y1="25" x2="75" y2="75">
        <stop stopColor="#EDE9FE" />
        <stop offset="1" stopColor="#C084FC" />
      </linearGradient>
    </defs>
  </svg>
);

// 4. Angry Peach Face (Tức giận)
export const AngryPeachIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Little steam puffs */}
    <path d="M22 28 Q18 20, 24 16" stroke="#FB7185" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M78 28 Q82 20, 76 16" stroke="#FB7185" strokeWidth="2.5" strokeLinecap="round" />
    {/* Round puffy body */}
    <circle cx="50" cy="54" r="32" fill="url(#angryGrad)" filter="drop-shadow(0 4px 6px rgba(244, 63, 94, 0.4))" />
    {/* Red blushing cheeks */}
    <circle cx="32" cy="58" r="6" fill="#E11D48" opacity="0.6" />
    <circle cx="68" cy="58" r="6" fill="#E11D48" opacity="0.6" />
    {/* Slanted angry eyebrows */}
    <path d="M31 42 L44 47" stroke="#4C0519" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M69 42 L56 47" stroke="#4C0519" strokeWidth="3.5" strokeLinecap="round" />
    {/* Sharp angry eyes */}
    <circle cx="39" cy="50" r="3.5" fill="#4C0519" />
    <circle cx="61" cy="50" r="3.5" fill="#4C0519" />
    {/* Pouting mouth */}
    <path d="M42 66 C46 62, 54 62, 58 66" stroke="#4C0519" strokeWidth="3.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="angryGrad" x1="30" y1="25" x2="70" y2="85">
        <stop stopColor="#FECDD3" />
        <stop offset="1" stopColor="#F43F5E" />
      </linearGradient>
    </defs>
  </svg>
);

// 5. Speechless Sprout Face (Khó nói thành lời)
export const SpeechlessBeanIcon: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sprout head */}
    <path d="M50 24 C50 16, 42 16, 42 22 C42 28, 50 28, 50 28" stroke="#059669" strokeWidth="2.5" fill="#A7F3D0" />
    <circle cx="50" cy="55" r="31" fill="url(#sproutGrad)" filter="drop-shadow(0 4px 6px rgba(16, 185, 129, 0.35))" />
    {/* Cheeks */}
    <circle cx="33" cy="58" r="5" fill="#6EE7B7" opacity="0.7" />
    <circle cx="67" cy="58" r="5" fill="#6EE7B7" opacity="0.7" />
    {/* Innocent dots for eyes */}
    <circle cx="38" cy="52" r="3.5" fill="#064E3B" />
    <circle cx="62" cy="52" r="3.5" fill="#064E3B" />
    {/* Speech bubble on top right */}
    <g transform="translate(64, 20)">
      <rect x="0" y="0" width="22" height="15" rx="5" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />
      <polygon points="4,15 9,15 2,20" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />
      <circle cx="6" cy="7.5" r="1.5" fill="#059669" />
      <circle cx="11" cy="7.5" r="1.5" fill="#059669" />
      <circle cx="16" cy="7.5" r="1.5" fill="#059669" />
    </g>
    {/* Flat straight mouth */}
    <line x1="44" y1="63" x2="56" y2="63" stroke="#064E3B" strokeWidth="3" strokeLinecap="round" />
    <defs>
      <linearGradient id="sproutGrad" x1="30" y1="25" x2="70" y2="85">
        <stop stopColor="#A7F3D0" />
        <stop offset="1" stopColor="#34D399" />
      </linearGradient>
    </defs>
  </svg>
);

// 6. Cute Logo Heart with Hugging Hands
export const LogoStationHeart: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="2" />
    {/* Big Pink Heart */}
    <path
      d="M50 78 C50 78, 20 58, 20 38 C20 26, 30 18, 42 18 C47 18, 50 22, 50 22 C50 22, 53 18, 58 18 C70 18, 80 26, 80 38 C80 58, 50 78, 50 78 Z"
      fill="url(#logoHeartGrad)"
      filter="drop-shadow(0 3px 5px rgba(244, 63, 94, 0.4))"
    />
    {/* Cute smiling face on heart */}
    <circle cx="39" cy="38" r="2.5" fill="#881337" />
    <circle cx="61" cy="38" r="2.5" fill="#881337" />
    <path d="M44 45 C47 49, 53 49, 56 45" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="34" cy="43" r="3" fill="#FDA4AF" />
    <circle cx="66" cy="43" r="3" fill="#FDA4AF" />
    <defs>
      <linearGradient id="logoHeartGrad" x1="25" y1="20" x2="75" y2="75">
        <stop stopColor="#FB7185" />
        <stop offset="1" stopColor="#E11D48" />
      </linearGradient>
    </defs>
  </svg>
);

// 7. Hero Kids Hugging Heart Illustration (Matches the top banner art in the user's mockup!)
export const KidsHuggingHeartIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 540 240" className="w-full h-auto max-h-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Soft Rainbow in background */}
      <path d="M40 210 C70 80, 220 50, 360 100" stroke="#FECDD3" strokeWidth="14" strokeLinecap="round" opacity="0.6" />
      <path d="M45 210 C75 90, 220 62, 355 108" stroke="#FEF08A" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
      <path d="M50 210 C80 100, 220 74, 350 116" stroke="#BAE6FD" strokeWidth="10" strokeLinecap="round" opacity="0.6" />
      <path d="M55 210 C85 110, 220 86, 345 124" stroke="#BBF7D0" strokeWidth="8" strokeLinecap="round" opacity="0.6" />

      {/* Floating little clouds and sparkles */}
      <g opacity="0.8">
        <circle cx="70" cy="50" r="14" fill="#FFFFFF" />
        <circle cx="85" cy="45" r="18" fill="#FFFFFF" />
        <circle cx="102" cy="50" r="14" fill="#FFFFFF" />
        <polygon points="120,30 123,38 131,41 123,44 120,52 117,44 109,41 117,38" fill="#FBBF24" />
        <polygon points="410,35 412,41 418,43 412,45 410,51 408,45 402,43 408,41" fill="#FBBF24" />
      </g>

      {/* Primary School building in the background right */}
      <g transform="translate(380, 60)">
        {/* Flag on roof */}
        <line x1="60" y1="10" x2="60" y2="35" stroke="#94A3B8" strokeWidth="2.5" />
        <polygon points="60,10 78,16 60,22" fill="#EF4444" />
        {/* Roof triangle */}
        <polygon points="60,30 10,65 110,65" fill="#FB923C" />
        {/* Main building block */}
        <rect x="18" y="65" width="84" height="75" rx="4" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="2" />
        {/* Clock circle */}
        <circle cx="60" cy="52" r="10" fill="#FFFFFF" stroke="#F97316" strokeWidth="2" />
        <line x1="60" y1="52" x2="60" y2="47" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="60" y1="52" x2="64" y2="52" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        {/* School Windows */}
        <rect x="26" y="74" width="16" height="18" rx="2" fill="#7DD3FC" />
        <rect x="78" y="74" width="16" height="18" rx="2" fill="#7DD3FC" />
        <rect x="26" y="102" width="16" height="18" rx="2" fill="#7DD3FC" />
        <rect x="78" y="102" width="16" height="18" rx="2" fill="#7DD3FC" />
        {/* Door */}
        <rect x="49" y="100" width="22" height="40" rx="3" fill="#D97706" />
        {/* School banner: Trường học hạnh phúc */}
        <rect x="8" y="125" width="104" height="16" rx="4" fill="#38BDF8" />
        <text x="60" y="136" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
          Trường học hạnh phúc
        </text>
      </g>

      {/* Big Warm Pink Heart in Center */}
      <g transform="translate(145, 75)">
        <path
          d="M65 105 C65 105 5 75 5 45 C5 22 24 10 43 10 C54 10 65 18 65 18 C65 18 76 10 87 10 C106 10 125 22 125 45 C125 75 65 105 65 105 Z"
          fill="url(#centerBigHeart)"
          filter="drop-shadow(0 6px 12px rgba(244, 63, 94, 0.45))"
        />
        {/* Cute Face on the Heart */}
        <path d="M48 45 C50 40, 56 40, 58 45" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M72 45 C74 40, 80 40, 82 45" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M59 55 C63 60, 67 60, 71 55" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="43" cy="50" r="4.5" fill="#FDA4AF" />
        <circle cx="87" cy="50" r="4.5" fill="#FDA4AF" />
      </g>

      {/* Boy Student on the left (blue shirt, backpack, hugging heart) */}
      <g transform="translate(90, 70)">
        {/* Backpack strap */}
        <path d="M22 75 C10 75, 8 105, 14 125" stroke="#0284C7" strokeWidth="7" strokeLinecap="round" />
        {/* Boy body */}
        <path d="M25 72 C35 68, 65 68, 70 85 C68 105, 58 128, 25 125 Z" fill="#0284C7" />
        {/* Boy Arm hugging heart */}
        <path d="M48 85 C60 85, 82 92, 95 86" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
        {/* Boy Head */}
        <circle cx="46" cy="46" r="24" fill="#FED7AA" />
        {/* Dark Hair */}
        <path d="M24 44 C22 28, 38 18, 54 20 C64 22, 68 32, 68 45 C62 38, 54 36, 46 36 C38 36, 30 40, 24 44 Z" fill="#1E293B" />
        <path d="M24 40 C28 32, 36 28, 48 30" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        {/* Happy Face */}
        <circle cx="42" cy="45" r="2.5" fill="#1E293B" />
        <circle cx="58" cy="45" r="2.5" fill="#1E293B" />
        <path d="M46 54 C50 58, 54 58, 58 54" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="36" cy="50" r="3.5" fill="#FCA5A5" />
        <circle cx="64" cy="50" r="3.5" fill="#FCA5A5" />
      </g>

      {/* Girl Student on the right (yellow dress, pigtails, hugging heart) */}
      <g transform="translate(230, 72)">
        {/* Girl body (Yellow shirt) */}
        <path d="M25 75 C30 68, 60 68, 65 85 C62 108, 45 125, 20 120 Z" fill="#FBBF24" />
        {/* Girl Arm hugging heart */}
        <path d="M35 86 C25 86, 5 90, -5 86" stroke="#FED7AA" strokeWidth="12" strokeLinecap="round" />
        {/* Girl Head */}
        <circle cx="44" cy="46" r="24" fill="#FED7AA" />
        {/* Hair and side buns/pigtails */}
        <circle cx="18" cy="40" r="10" fill="#78350F" />
        <circle cx="68" cy="40" r="10" fill="#78350F" />
        <path d="M22 42 C24 26, 40 18, 56 22 C64 25, 68 35, 66 45 C60 36, 50 34, 42 34 C34 34, 26 38, 22 42 Z" fill="#78350F" />
        {/* Happy Face */}
        <circle cx="36" cy="45" r="2.5" fill="#1E293B" />
        <circle cx="52" cy="45" r="2.5" fill="#1E293B" />
        <path d="M40 54 C44 58, 48 58, 52 54" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="30" cy="50" r="3.5" fill="#FCA5A5" />
        <circle cx="58" cy="50" r="3.5" fill="#FCA5A5" />
        {/* Cute hair clips */}
        <circle cx="24" cy="30" r="3" fill="#EC4899" />
        <circle cx="62" cy="30" r="3" fill="#EC4899" />
      </g>

      <defs>
        <linearGradient id="centerBigHeart" x1="10" y1="10" x2="110" y2="100">
          <stop stopColor="#FDA4AF" />
          <stop offset="0.6" stopColor="#F43F5E" />
          <stop offset="1" stopColor="#E11D48" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// 8. The 4 Wooden Signs: "Lắng nghe", "Thấu hiểu", "Yêu thương", "Đồng hành"
export const WoodenSignposts: React.FC<{ className?: string }> = ({ className = '' }) => {
  const signs = [
    { label: 'Lắng nghe', bg: 'bg-[#FDA4AF]', text: 'text-rose-950', border: 'border-rose-300' },
    { label: 'Thấu hiểu', bg: 'bg-[#FDE047]', text: 'text-amber-950', border: 'border-amber-300' },
    { label: 'Yêu thương', bg: 'bg-[#6EE7B7]', text: 'text-emerald-950', border: 'border-emerald-300' },
    { label: 'Đồng hành', bg: 'bg-[#7DD3FC]', text: 'text-sky-950', border: 'border-sky-300' },
  ];

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Wooden Post Behind */}
      <div className="absolute top-2 bottom-0 w-4 bg-[#B45309] rounded-sm shadow-sm" />
      {/* Wooden Sign Arrows */}
      <div className="relative z-10 flex flex-col gap-2.5 py-1">
        {signs.map((sign, idx) => (
          <div
            key={sign.label}
            style={{ transform: `rotate(${idx % 2 === 0 ? '-3deg' : '3deg'})` }}
            className={`px-4 py-1.5 rounded-lg shadow-md font-bold text-xs md:text-sm tracking-wide ${sign.bg} ${sign.text} border-2 ${sign.border} transition-transform hover:scale-105 cursor-default`}
          >
            {sign.label}
          </div>
        ))}
      </div>
      {/* Little green grass patch at base */}
      <div className="w-16 h-3 bg-emerald-500 rounded-full mt-1 shadow-sm" />
    </div>
  );
};
