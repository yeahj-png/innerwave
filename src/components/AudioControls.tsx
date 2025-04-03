import { useState, useEffect } from 'react';
import { Clock, Play, Pause, Volume2, Timer, X } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgress } from './CircularProgress';

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
  const [showTimerEndingToast, setShowTimerEndingToast] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);

  // Update session duration when playing
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying]);

  // Reset session duration when stopping
  useEffect(() => {
    if (!isPlaying) {
      setSessionDuration(0);
    }
  }, [isPlaying]);

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

  // Calculate timer progress percentage
  const getTimerProgress = () => {
    if (!selectedTimer || !timeRemaining) return 0;
    const totalSeconds = selectedTimer * 60;
    return ((totalSeconds - timeRemaining) / totalSeconds) * 100;
  };

  // Show toast 5 seconds before timer ends
  useEffect(() => {
    if (timeRemaining === 5) {
      setShowTimerEndingToast(true);
      const timer = setTimeout(() => {
        setShowTimerEndingToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  // Format session duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Current frequency display */}
      {selectedFrequency && (
        <div className="fixed bottom-24 sm:bottom-20 left-0 w-full bg-neutral-900/95 backdrop-blur-sm text-center py-3 text-sm border-t border-neutral-800/50 z-40">
          <div className="flex items-center justify-center gap-2">
            <span className="text-neutral-300">Playing {selectedFrequency.label}</span>
            {timeRemaining && (
              <span className="text-indigo-400 font-medium">
                ({formatTimeRemaining()} remaining)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Timer ending toast */}
      <AnimatePresence>
        {showTimerEndingToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-36 sm:bottom-32 left-0 right-0 mx-auto w-max z-50 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-lg"
          >
            <p className="text-sm font-medium">Timer ending in 5 seconds</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Controls Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-neutral-900 border-t border-neutral-800 shadow-inner">
        {/* Timer progress bar */}
        {timeRemaining && (
          <div className="w-full h-1 bg-neutral-800">
            <div 
              className="h-full bg-indigo-400 transition-all duration-1000 ease-linear"
              style={{ width: `${getTimerProgress()}%` }}
            />
          </div>
        )}
        
        <div className="max-w-screen-md mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Play Button with Progress Ring */}
            <div className="relative flex-shrink-0">
              {timeRemaining && (
                <>
                  <CircularProgress 
                    progress={getTimerProgress()}
                    size={56}
                    className="sm:hidden"
                  />
                  <CircularProgress 
                    progress={getTimerProgress()}
                    size={48}
                    className="hidden sm:block"
                  />
                </>
              )}
              <Button
                variant="default"
                size="icon"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg h-14 w-14 sm:h-12 sm:w-12 flex-shrink-0 transition-all duration-300 relative z-10"
                onClick={onPlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 sm:h-5 sm:w-5" />
                ) : (
                  <Play className="h-6 w-6 sm:h-5 sm:w-5 ml-0.5" />
                )}
              </Button>
              {isPlaying && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs text-neutral-500">
                    {formatDuration(sessionDuration)}
                    {timeRemaining && ` / ${formatDuration(selectedTimer! * 60)}`}
                  </span>
                </div>
              )}
            </div>

            {/* Controls Group */}
            <div className="flex items-center gap-4 flex-grow pt-0 pb-2">
              {/* Timer */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex flex-col items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`relative h-11 w-11 sm:h-9 sm:w-9 rounded-full transition-all duration-200 flex-shrink-0 ${
                        timeRemaining ? 'text-indigo-400 bg-indigo-500/10' : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <Timer className="h-5 w-5 sm:h-4 sm:w-4" />
                      {timeRemaining && (
                        <span className="absolute -top-1 -right-1 text-xs bg-indigo-600 rounded-full px-1.5 py-0.5">
                          {formatTimeRemaining()}
                        </span>
                      )}
                    </Button>
                    <span className="text-xs text-neutral-500 text-center mt-1">Timer</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-72 sm:w-48 p-4 sm:p-2">
                  <div className="flex items-center justify-between mb-3 sm:mb-2">
                    <h3 className="text-sm font-medium">Set Timer</h3>
                    <PopoverClose className="rounded-full p-1.5 hover:bg-neutral-800">
                      <X className="h-4 w-4" />
                    </PopoverClose>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-2">
                    {timerPresets.map(mins => (
                      <Button
                        key={mins}
                        variant={selectedTimer === mins ? "default" : "outline"}
                        className="w-full min-h-[44px] text-sm transition-colors duration-200"
                        onClick={() => onTimerSelect(selectedTimer === mins ? null : mins)}
                      >
                        {mins}m
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 flex-grow">
                <Volume2 className="h-5 w-5 sm:h-4 sm:w-4 text-neutral-300 flex-shrink-0" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Slider
                        value={[volume]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="relative flex items-center select-none touch-none w-full [&>[data-thumb]]:h-6 [&>[data-thumb]]:w-6 sm:[&>[data-thumb]]:h-4 sm:[&>[data-thumb]]:w-4 [&>[data-thumb]]:border-2 [&>[data-thumb]]:border-indigo-500 [&>[data-thumb]]:bg-white [&>[data-thumb]]:rounded-full [&>[data-track]]:h-2 sm:[&>[data-track]]:h-1.5 [&>[data-track]]:bg-neutral-600 [&>[data-range]]:bg-indigo-500"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs font-normal">Volume: {volume}%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Perfect Fifth Toggle */}
              {selectedCategory === 'solfeggio' && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-400 font-normal">5th</span>
                  <Switch
                    checked={perfectFifth}
                    onCheckedChange={handlePerfectFifthToggle}
                    className="data-[state=checked]:bg-indigo-600 h-6 w-11"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Session progress bar */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 w-full h-1">
            <div className="h-full bg-indigo-500/60 rounded transition-all duration-1000 ease-linear"
              style={{ 
                width: timeRemaining 
                  ? `${getTimerProgress()}%`
                  : '100%'
              }}
            />
          </div>
        )}
      </div>
    </>
  );
} 