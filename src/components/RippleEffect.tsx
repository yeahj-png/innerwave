import React, { useEffect, useState } from 'react';

interface RippleEffectProps {
  x: number;
  y: number;
}

export function RippleEffect({ x, y }: RippleEffectProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="absolute rounded-full bg-indigo-500/20 pointer-events-none"
      style={{
        left: x,
        top: y,
        width: '100px',
        height: '100px',
        transform: 'translate(-50%, -50%)',
        animation: 'ripple 0.5s ease-out forwards',
      }}
    />
  );
} 