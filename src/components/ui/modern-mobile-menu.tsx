"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Home, Briefcase, Calendar, Shield, Settings } from 'lucide-react';

export type IconComponentType = React.ElementType<{ className?: string }>;

export interface InteractiveMenuItem {
  label: string;
  icon: IconComponentType;
  badge?: number;
  id?: string;
  href?: string;
  onClick?: () => void;
}

export interface InteractiveMenuProps {
  items?: InteractiveMenuItem[];
  accentColor?: string;
  activeIndex?: number;
  onTabChange?: (index: number, item: InteractiveMenuItem) => void;
  className?: string;
}

const defaultItems: InteractiveMenuItem[] = [
  { label: 'home', icon: Home },
  { label: 'strategy', icon: Briefcase },
  { label: 'period', icon: Calendar },
  { label: 'security', icon: Shield },
  { label: 'settings', icon: Settings },
];

const defaultAccentColor = 'hsl(146 65% 11%)';

const InteractiveMenu: React.FC<InteractiveMenuProps> = ({ 
  items, 
  accentColor, 
  activeIndex: externalActiveIndex, 
  onTabChange,
  className = ""
}) => {
  const finalItems = useMemo(() => {
    const isValid = items && Array.isArray(items) && items.length >= 2 && items.length <= 5;
    if (!isValid) {
      return defaultItems;
    }
    return items;
  }, [items]);

  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const activeIndex = externalActiveIndex !== undefined ? externalActiveIndex : internalActiveIndex;

  useEffect(() => {
    if (activeIndex >= finalItems.length) {
      if (externalActiveIndex === undefined) {
        setInternalActiveIndex(0);
      }
    }
  }, [finalItems, activeIndex, externalActiveIndex]);

  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const setLineWidth = () => {
      const activeItemElement = itemRefs.current[activeIndex];
      const activeTextElement = textRefs.current[activeIndex];

      if (activeItemElement && activeTextElement) {
        const textWidth = activeTextElement.offsetWidth;
        activeItemElement.style.setProperty('--lineWidth', `${textWidth}px`);
      }
    };

    setLineWidth();

    window.addEventListener('resize', setLineWidth);
    return () => {
      window.removeEventListener('resize', setLineWidth);
    };
  }, [activeIndex, finalItems]);

  const handleItemClick = (index: number) => {
    // Trigger subtle haptic vibration on supporting mobile devices
    if (typeof window !== 'undefined' && 'navigator' in window && typeof window.navigator.vibrate === 'function') {
      try {
        window.navigator.vibrate(12);
      } catch {
        // Ignore if vibration permission is restricted
      }
    }

    if (externalActiveIndex === undefined) {
      setInternalActiveIndex(index);
    }
    const clickedItem = finalItems[index];
    if (clickedItem.onClick) {
      clickedItem.onClick();
    }
    if (onTabChange) {
      onTabChange(index, clickedItem);
    }
  };

  const navStyle = useMemo(() => {
    const activeColor = accentColor || defaultAccentColor;
    return { '--component-active-color': activeColor } as React.CSSProperties;
  }, [accentColor]);

  return (
    <nav
      className={`menu ${className}`}
      role="navigation"
      style={navStyle}
    >
      {finalItems.map((item, index) => {
        const isActive = index === activeIndex;
        const isTextActive = isActive;
        const IconComponent = item.icon;

        return (
          <button
            key={item.id || item.label + index}
            className={`menu__item ${isActive ? 'active' : ''}`}
            onClick={() => handleItemClick(index)}
            ref={(el) => { itemRefs.current[index] = el; }}
            style={{ '--lineWidth': '0px' } as React.CSSProperties}
          >
            <div className="menu__icon">
              <IconComponent className="icon w-5 h-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[17px] h-[17px] bg-[#C83232] text-white rounded-full text-[9px] font-black flex items-center justify-center px-1 border-2 border-white shadow-sm">
                  {item.badge}
                </div>
              )}
            </div>
            <strong
              className={`menu__text ${isTextActive ? 'active' : ''}`}
              ref={(el) => { textRefs.current[index] = el; }}
            >
              {item.label}
            </strong>
          </button>
        );
      })}
    </nav>
  );
};

export { InteractiveMenu };

const lucideDemoMenuItems: InteractiveMenuItem[] = [
  { label: 'home', icon: Home },
  { label: 'strategy', icon: Briefcase },
  { label: 'period', icon: Calendar },
  { label: 'security', icon: Shield },
  { label: 'settings', icon: Settings },
];

const customAccentColor = 'hsl(146 65% 11%)';

const Default = () => {
  return <InteractiveMenu />;
};

const Customized = () => {
  return <InteractiveMenu items={lucideDemoMenuItems} accentColor={customAccentColor} />;
};

export { Default, Customized };
