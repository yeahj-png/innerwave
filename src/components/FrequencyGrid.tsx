import React from 'react';
import { Card } from "@/components/ui/card";
import { FrequencyOption } from '@/types/frequency';

interface FrequencyGridProps {
  frequencies: FrequencyOption[];
  selectedFrequency: string | null;
  onFrequencySelect: (id: string) => void;
}

export function FrequencyGrid({ frequencies, selectedFrequency, onFrequencySelect }: FrequencyGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 max-w-screen-md mx-auto">
      {frequencies.map((freq) => (
        <Card
          key={freq.id}
          className={`p-4 sm:p-5 bg-neutral-800 hover:bg-neutral-700/80 transition-all duration-200 cursor-pointer rounded-xl ${
            selectedFrequency === freq.id
              ? 'ring-1 ring-indigo-500 bg-indigo-500/5'
              : 'ring-0 hover:ring-1 hover:ring-neutral-600'
          }`}
          onClick={() => onFrequencySelect(freq.id)}
        >
          <h3 className="text-sm font-semibold mb-1">{freq.label}</h3>
          <p className="text-sm text-neutral-400 leading-relaxed tracking-wide">{freq.description}</p>
        </Card>
      ))}
    </div>
  );
} 