import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Free Express Shipping
export const ShippingIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.24-4.05A1 1 0 0 0 18 8.35H14V18Z" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
    <path d="M6 9h3" />
  </svg>
);

// 2. 100% Certified Pure & Lab Tested
export const PurityShieldIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// 3. Cash on Delivery (COD) Available
export const CodIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="14" x="2" y="5" rx="3" />
    <line x1="2" x2="22" y1="10" y2="10" />
    <circle cx="7" cy="15" r="1.5" />
    <path d="M14 15h4" />
  </svg>
);

// 4. Traditional Bilona Churning
export const BilonaChurnIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 10h12" />
    <path d="M7 10c0 5 1.5 10 5 10s5-5 5-10" />
    <ellipse cx="12" cy="10" rx="6" ry="2" />
    <line x1="12" y1="2" x2="12" y2="15" />
    <path d="M9 4h6" />
    <path d="M10 13l4 3" />
    <path d="M14 13l-4 3" />
  </svg>
);

// 5. Rich Aroma & Danedar Texture
export const AromaSparkleIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    <circle cx="19" cy="5" r="1" fill="currentColor" />
    <circle cx="5" cy="19" r="1" fill="currentColor" />
  </svg>
);

// 6. 100% Pure & Zero Preservatives
export const ZeroChemicalsIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" />
    <path d="m4.93 4.93 14.14 14.14" />
    <path d="M15 9h-3v6h3" />
  </svg>
);

// 7. Grass-Fed Ethical Farm Sourcing
export const FarmDirectIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 21h18" />
    <path d="M5 21V10l7-5 7 5v11" />
    <path d="M9 21v-6a3 3 0 0 1 6 0v6" />
    <circle cx="12" cy="9" r="1.5" />
  </svg>
);

// 8. Earthen Slow Firewood Simmering
export const SlowFireIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

// 9. Health & Vitality / Gut Immunity
export const HeartVitalityIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M12 9v6" />
    <path d="M9 12h6" />
  </svg>
);

// 10. Premium Glass Jar Packaging
export const GlassJarIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="7" y="2" width="10" height="3" rx="1" />
    <path d="M6 5h12v3l-1 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V10L6 8V5Z" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);

// 11. Rigorous Lab Testing
export const LabFlaskIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M10 2v7.31L4.1 19.34A2 2 0 0 0 5.76 22h12.48a2 2 0 0 0 1.66-2.66L14 9.31V2" />
    <path d="M8.5 2h7" />
    <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
    <circle cx="11" cy="16" r="1" fill="currentColor" />
  </svg>
);
