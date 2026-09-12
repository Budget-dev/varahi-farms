import React from 'react';

interface JarProps {
  c1: string;
  c2: string;
  sub: string;
  className?: string;
  idSuffix: string;
}

export const JarIcon: React.FC<JarProps> = ({ c1, c2, sub, className, idSuffix }) => {
  return (
    <svg width="160" height="195" viewBox="0 0 160 195" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`jg${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="183" rx="54" ry="11" fill="#000" opacity=".12" />
      <rect x="26" y="62" width="108" height="120" rx="16" fill={c2} />
      <rect x="30" y="65" width="100" height="114" rx="14" fill={`url(#jg${idSuffix})`} />
      <rect x="38" y="88" width="84" height="60" rx="10" fill="rgba(255,255,255,.56)" />
      <text x="80" y="114" textAnchor="middle" fontSize="10" fontFamily="'Oswald', sans-serif" fill="#0D3520" fontWeight="bold">VIVAAN</text>
      <text x="80" y="128" textAnchor="middle" fontSize="8" fill="#1B5E3B">FARMS</text>
      <text x="80" y="140" textAnchor="middle" fontSize="7" fill="#237348">{sub}</text>
      <rect x="34" y="49" width="92" height="18" rx="7" fill={c2} opacity=".9" />
      <rect x="38" y="51" width="84" height="14" rx="5.5" fill={c1} opacity=".85" />
      <rect x="44" y="70" width="13" height="80" rx="6.5" fill="rgba(255,255,255,.24)" />
    </svg>
  );
};

export const ComboIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="185" height="185" viewBox="0 0 185 185" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="jca" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4EDE0" />
        <stop offset="100%" stopColor="#1B5E3B" />
      </linearGradient>
      <linearGradient id="jcb" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EBF5EE" />
        <stop offset="100%" stopColor="#0D3520" />
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="172" rx="40" ry="9" fill="#000" opacity=".12" />
    <ellipse cx="132" cy="174" rx="40" ry="9" fill="#000" opacity=".12" />
    <rect x="10" y="52" width="82" height="120" rx="13" fill="#0D3520" />
    <rect x="14" y="55" width="74" height="114" rx="11" fill="url(#jca)" />
    <rect x="24" y="76" width="54" height="46" rx="8" fill="rgba(255,255,255,0.56)" />
    <text x="51" y="97" textAnchor="middle" fontSize="8.5" fontFamily="'Oswald', sans-serif" fill="#0D3520" fontWeight="bold">VIVAAN</text>
    <text x="51" y="109" textAnchor="middle" fontSize="7" fill="#1B5E3B">A2 GIR COW</text>
    <rect x="18" y="42" width="66" height="14" rx="5.5" fill="#0D3520" />
    <rect x="22" y="44" width="58" height="10" rx="4" fill="#1B5E3B" />
    <rect x="93" y="57" width="82" height="118" rx="13" fill="#1B5E3B" />
    <rect x="97" y="60" width="74" height="112" rx="11" fill="url(#jcb)" />
    <rect x="107" y="80" width="54" height="46" rx="8" fill="rgba(255,255,255,0.5)" />
    <text x="134" y="101" textAnchor="middle" fontSize="8.5" fontFamily="'Oswald', sans-serif" fill="#0D3520" fontWeight="bold">VIVAAN</text>
    <text x="134" y="113" textAnchor="middle" fontSize="7" fill="#1B5E3B">BUFFALO</text>
    <rect x="101" y="47" width="66" height="14" rx="5.5" fill="#0D3520" />
    <rect x="105" y="49" width="58" height="10" rx="4" fill="#1B5E3B" />
  </svg>
);
