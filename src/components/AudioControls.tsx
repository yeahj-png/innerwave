import { useState } from 'react';
import { Clock, Play, Pause, Volume2 } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FrequencyOption {
  id: string;
  label: string;
  description: string;
  hz: number;
}

interface AudioControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onPerfectFifthChange: (enabled: boolean) => void;
  selectedFrequency: FrequencyOption | null;
  selectedTimer: number | null;
  timeRemaining: number | null;
  onTimerSelect: (minutes: number | null) => void;
  selectedCategory: string | null;
  className?: string;
}

const timerPresets = [5, 10, 15, 30];

export function AudioControls({
  isPlaying,
  onPlayPause,
  onVolumeChange,
  onPerfectFifthChange,
  selectedFrequency,
  selectedTimer,
  timeRemaining,
  onTimerSelect,
  selectedCategory,
  className = '',
}: AudioControlsProps) {
  const [volume, setVolume] = useState(30);
  const [perfectFifth, setPerfectFifth] = useState(false);

  // Handle volume change
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    onVolumeChange(newVolume / 100);
  };

  // Handle perfect fifth toggle
  const handlePerfectFifthToggle = (checked: boolean) => {
    setPerfectFifth(checked);
    onPerfectFifthChange(checked);
  };

  // Format time remaining
  const formatTimeRemaining = () => {
    if (!timeRemaining) return null;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Current frequency display */}
      {selectedFrequency && (
        <div className="fixed bottom-20 left-0 w-full bg-neutral-900/95 backdrop-blur-sm text-center py-2 text-sm text-neutral-400 border-t border-neutral-800/50 z-40">
          Playing {selectedFrequency.label}
          {timeRemaining && (
            <span className="ml-2 text-indigo-400">
              ({formatTimeRemaining()} remaining)
            </span>
          )}
        </div>
      )}

      {/* Audio Controls Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-neutral-900 border-t border-neutral-800 shadow-inner">
        <div className="max-w-screen-md mx-auto px-4 py-4">
          <div className="flex items-center gap-6">
            {/* Play Button */}
            <Button
              variant="default"
              size="icon"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg h-12 w-12 flex-shrink-0 transition-all duration-300"
              onClick={onPlayPause}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>

            {/* Controls Group */}
            <div className="flex items-center gap-6 flex-1 min-w-0">
              {/* Timer */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`relative h-9 w-9 rounded-full transition-all duration-200 flex-shrink-0 ${
                      timeRemaining ? 'text-indigo-400 bg-indigo-500/10' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                    {timeRemaining && (
                      <span className="absolute -top-1 -right-1 text-xs bg-indigo-600 rounded-full px-1.5 py-0.5">
                        {formatTimeRemaining()}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {timerPresets.map(mins => (
                      <Button
                        key={mins}
                        variant={selectedTimer === mins ? "default" : "outline"}
                        className="w-full h-9 text-sm transition-colors duration-200"
                        onClick={() => onTimerSelect(selectedTimer === mins ? null : mins)}
                      >
                        {mins}m
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 flex-1 min-w-[140px]">
                <Volume2 className="h-4 w-4 text-neutral-300 flex-shrink-0" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Slider
                        value={[volume]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="relative flex items-center select-none touch-none w-full [&>[data-thumb]]:h-4 [&>[data-thumb]]:w-4 [&>[data-thumb]]:border-2 [&>[data-thumb]]:border-indigo-500 [&>[data-thumb]]:bg-white [&>[data-thumb]]:rounded-full [&>[data-track]]:h-1.5 [&>[data-track]]:bg-neutral-600 [&>[data-range]]:bg-indigo-500"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs font-medium">Volume: {volume}%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Perfect Fifth Toggle */}
              {selectedCategory === 'solfeggio' && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-400">5th</span>
                  <Switch
                    checked={perfectFifth}
                    onCheckedChange={handlePerfectFifthToggle}
                    className="data-[state=checked]:bg-indigo-600"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 