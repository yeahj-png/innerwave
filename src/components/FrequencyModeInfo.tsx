import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

interface FrequencyModeInfoProps {
  mode: string;
}

const modeDescriptions: Record<string, string> = {
  binaural: "Two slightly different tones played in each ear, producing a perceived third beat. Requires headphones for optimal effect.",
  isochronic: "Single tone pulsed on and off at regular intervals to stimulate brainwave states. Works with speakers or headphones.",
  monaural: "Two tones mixed before reaching the ear, creating a direct, pulsating beat. Headphones optional.",
  solfeggio: "Ancient sacred frequencies believed to have healing and transformative properties. Each frequency corresponds to specific effects.",
  schumann: "Earth's natural electromagnetic frequencies, known as the 'heartbeat of the planet'. The primary resonance is 7.83 Hz.",
  noise: "Different types of noise with varying frequency distributions. Useful for masking unwanted sounds and promoting focus.",
};

export function FrequencyModeInfo({ mode }: FrequencyModeInfoProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          className="p-1.5 rounded-full hover:bg-neutral-700/50 transition-colors cursor-default"
          onClick={(e) => e.stopPropagation()}
          title="More info"
        >
          <Info className="w-4 h-4 text-neutral-400 hover:text-indigo-400 transition-colors" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-neutral-400 leading-relaxed tracking-wide">
          {modeDescriptions[mode]}
        </p>
      </PopoverContent>
    </Popover>
  );
} 