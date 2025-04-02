import { useEffect, useState } from 'react';

interface MeditationVisualProps {
  isPlaying: boolean;
  frequency?: number;
}

const getAnimationDuration = (frequency: number): number => {
  // Convert frequency to animation duration
  // Lower frequencies = slower pulse, higher frequencies = faster pulse
  if (frequency <= 4) return 4; // Delta waves (slow)
  if (frequency <= 8) return 3; // Theta waves
  if (frequency <= 14) return 2; // Alpha waves
  if (frequency <= 30) return 1.5; // Beta waves
  return 1; // Gamma waves (fast)
};

export function MeditationVisual({ isPlaying, frequency = 10 }: MeditationVisualProps) {
  const [animationDuration, setAnimationDuration] = useState(2);

  useEffect(() => {
    if (frequency) {
      setAnimationDuration(getAnimationDuration(frequency));
    }
  }, [frequency]);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Main pulsing circle */}
        <div
          className={`relative transition-all duration-1000 ease-in-out ${
            isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{ transform: 'translateY(-15vh)' }}
        >
          {/* Inner circles with different opacities and sizes */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10"
            style={{
              width: '40vmin',
              height: '40vmin',
              animationName: isPlaying ? 'pulse' : 'none',
              animationDuration: `${animationDuration}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/5"
            style={{
              width: '50vmin',
              height: '50vmin',
              animationName: isPlaying ? 'pulse' : 'none',
              animationDuration: `${animationDuration * 1.2}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: '-1s',
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/3"
            style={{
              width: '60vmin',
              height: '60vmin',
              animationName: isPlaying ? 'pulse' : 'none',
              animationDuration: `${animationDuration * 1.4}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: '-2s',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.95);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.95);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
} 