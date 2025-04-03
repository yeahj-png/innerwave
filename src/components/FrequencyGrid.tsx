import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { FrequencyOption } from '@/types/frequency';
import { EqualizerIcon } from './EqualizerIcon';
import { useAudioStore } from '@/lib/store';
import { RippleEffect } from './RippleEffect';

interface FrequencyGridProps {
  frequencies: FrequencyOption[];
  selectedFrequency: string | null;
  onFrequencySelect: (id: string) => void;
}

export function FrequencyGrid({ frequencies, selectedFrequency, onFrequencySelect }: FrequencyGridProps) {
  const { isPlaying, currentFrequency } = useAudioStore();
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [clickedCardId, setClickedCardId] = useState<string | null>(null);
  
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, freqId: string) => {
    // Get click position relative to the card
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setClickPosition({ x, y });
    setClickedCardId(freqId);
    
    // Reset after animation completes
    setTimeout(() => {
      setClickPosition(null);
      setClickedCardId(null);
    }, 500);
    
    // Call the original handler
    onFrequencySelect(freqId);
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 max-w-screen-md mx-auto">
      {frequencies.map((freq) => {
        const isActive = isPlaying && selectedFrequency === freq.id;
        const isClicked = clickedCardId === freq.id;
        
        return (
          <Card
            key={freq.id}
            className={`relative p-4 sm:p-5 transition-all duration-200 ease-out cursor-pointer rounded-xl ${
              isActive
                ? 'bg-neutral-800/70 ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/10'
                : 'bg-neutral-800 hover:bg-neutral-700/80 ring-0 hover:ring-1 hover:ring-neutral-600'
            } ${isClicked ? 'scale-95' : ''}`}
            onClick={(e) => handleCardClick(e, freq.id)}
          >
            {isActive && (
              <div className="absolute top-3 right-3">
                <EqualizerIcon />
              </div>
            )}
            
            {clickPosition && clickedCardId === freq.id && (
              <RippleEffect x={clickPosition.x} y={clickPosition.y} />
            )}
            
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">{freq.label}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed tracking-wide">{freq.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
} 