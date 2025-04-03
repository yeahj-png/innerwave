import React from 'react';

export function EqualizerIcon() {
  return (
    <div className="flex items-center gap-0.5 h-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-indigo-500 rounded-full animate-pulse"
          style={{
            height: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );
} 