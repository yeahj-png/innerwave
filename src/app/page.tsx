// touched to force git update

'use client';

import React, { useState, useEffect, useRef, ComponentProps } from 'react';
import { Card } from "@/components/ui/card";
import { Brain, Waves, Activity, Music, Radio, Wind } from "lucide-react";
import { useTonePlayer } from '@/hooks/useTonePlayer';
import { AudioControls } from '@/components/AudioControls';
import { MeditationVisual } from '@/components/MeditationVisual';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AboutDialog } from '@/components/AboutDialog';
import { FrequencyModeInfo } from '@/components/FrequencyModeInfo';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Timer, X, ChevronDown, ChevronUp, Info, Music2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface FrequencyOption {
  id: string;
  label: string;
  description: string;
  hz: number;
  carrierLeft?: number;
  carrierRight?: number;
  includePinkNoise?: boolean;
  isIsochronic?: boolean;
}

const frequencyPresets: Record<string, FrequencyOption[]> = {
  'binaural': [
    { 
      id: 'focus',
      label: "Focus (Monroe Inspired)",
      description: "Expanded awareness with 5 Hz binaural beat + pink noise",
      hz: 5,
      carrierLeft: 210,
      carrierRight: 215,
      includePinkNoise: true
    },
    { 
      id: 'delta', 
      label: "Delta (0.5–4 Hz)", 
      description: "Deep sleep, healing via 3 Hz binaural beat", 
      hz: 3,
      carrierLeft: 210,
      carrierRight: 213
    },
    { 
      id: 'theta', 
      label: "Theta (4–8 Hz)", 
      description: "Meditation, creativity via 6 Hz binaural beat", 
      hz: 6,
      carrierLeft: 210,
      carrierRight: 216
    },
    { 
      id: 'alpha', 
      label: "Alpha (8–14 Hz)", 
      description: "Relaxation via 5 Hz binaural beat", 
      hz: 10,
      carrierLeft: 210,
      carrierRight: 215
    },
    { 
      id: 'beta', 
      label: "Beta (14–30 Hz)", 
      description: "Focus, alertness via 15 Hz binaural beat", 
      hz: 20,
      carrierLeft: 210,
      carrierRight: 225
    },
    { 
      id: 'gamma', 
      label: "Gamma (40 Hz)", 
      description: "High-level cognition and insight via 40 Hz binaural beat",
      hz: 40,
      carrierLeft: 400,
      carrierRight: 440
    },
  ],
  'isochronic': [
    { 
      id: 'delta_iso',
      label: "Delta Isochronic",
      description: "Deep sleep and healing (0.5-4 Hz)",
      hz: 2,
      isIsochronic: true
    },
    { 
      id: 'theta_iso',
      label: "Theta Isochronic",
      description: "Deep meditation and creativity (4-8 Hz)",
      hz: 6,
      isIsochronic: true
    },
    { 
      id: 'alpha_iso',
      label: "Alpha Isochronic",
      description: "Relaxation and stress reduction (8-12 Hz)",
      hz: 10,
      isIsochronic: true
    },
    { 
      id: 'beta_iso',
      label: "Beta Isochronic",
      description: "Focus and concentration (12-30 Hz)",
      hz: 15,
      isIsochronic: true
    },
    { 
      id: 'gamma_iso',
      label: "Gamma Isochronic",
      description: "Peak performance and cognition (30-100 Hz)",
      hz: 40,
      isIsochronic: true
    }
  ],
  'monaural': [
    { id: 'delta_mon', label: "Delta Monaural", description: "Deep healing states", hz: 2 },
    { id: 'theta_mon', label: "Theta Monaural", description: "Deep meditation", hz: 6 },
    { id: 'alpha_mon', label: "Alpha Monaural", description: "Stress reduction", hz: 10 },
    { id: 'beta_mon', label: "Beta Monaural", description: "Enhanced concentration", hz: 20 },
  ],
  'solfeggio': [
    { id: '144', label: "144 Hz", description: "Sacred geometry resonance", hz: 144 },
    { id: '174', label: "174 Hz", description: "Pain relief, grounding", hz: 174 },
    { id: '285', label: "285 Hz", description: "Tissue regeneration", hz: 285 },
    { id: '396', label: "396 Hz", description: "Liberation from fear", hz: 396 },
    { id: '417', label: "417 Hz", description: "Facilitating change", hz: 417 },
    { id: '528', label: "528 Hz", description: "DNA repair, love frequency", hz: 528 },
    { id: '639', label: "639 Hz", description: "Connecting relationships", hz: 639 },
    { id: '741', label: "741 Hz", description: "Awakening intuition", hz: 741 },
    { id: '852', label: "852 Hz", description: "Returning to spiritual order", hz: 852 },
    { id: '888', label: "888 Hz", description: "Infinite abundance", hz: 888 },
    { id: '963', label: "963 Hz", description: "Pineal gland activation, unity", hz: 963 },
    { id: '1111', label: "1111 Hz", description: "Ascension, divine alignment", hz: 1111 }
  ],
  'schumann': [
    { id: '7.83', label: "7.83 Hz", description: "Primary resonance, grounding", hz: 7.83 },
    { id: '14.3', label: "14.3 Hz", description: "Secondary resonance", hz: 14.3 },
    { id: '20.8', label: "20.8 Hz", description: "Tertiary resonance", hz: 20.8 },
    { id: '27.3', label: "27.3 Hz", description: "Fourth resonance", hz: 27.3 },
  ],
  'noise': [
    { id: 'white', label: "White Noise", description: "Full frequency spectrum", hz: 1000 },
    { id: 'pink', label: "Pink Noise", description: "Balanced frequency reduction", hz: 500 },
    { id: 'brown', label: "Brown Noise", description: "Strong bass frequencies", hz: 100 },
    { id: 'grey', label: "Grey Noise", description: "Perceptually flat spectrum", hz: 800 },
  ],
};

const categories: Category[] = [
  {
    id: 'binaural',
    title: 'Binaural Beats',
    description: 'Brain synchronization and deep meditation',
    icon: Brain
  },
  {
    id: 'isochronic',
    title: 'Isochronic Tones',
    description: 'Single-tone amplitude modulation for brainwave entrainment',
    icon: Activity
  },
  {
    id: 'monaural',
    title: 'Monaural Beats',
    description: 'Balanced brain wave patterns',
    icon: Activity
  },
  {
    id: 'solfeggio',
    title: 'Solfeggio Frequencies',
    description: 'Ancient healing frequencies',
    icon: Music
  },
  {
    id: 'schumann',
    title: 'Schumann Resonance',
    description: 'Earth\'s natural frequency',
    icon: Radio
  },
  {
    id: 'noise',
    title: 'White / Pink / Brown Noise',
    description: 'Ambient sound masking',
    icon: Wind
  }
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(true);
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null);
  const [selectedFrequencyData, setSelectedFrequencyData] = useState<FrequencyOption | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playPerfectFifth, setPlayPerfectFifth] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const { play, stop, setVolume, togglePerfectFifth, transitionToFrequency } = useTonePlayer();
  const timerIntervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const freqRef = useRef<HTMLDivElement>(null);

  const frequencies = selectedCategory ? frequencyPresets[selectedCategory] : null;
  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  // Handle timer countdown using requestAnimationFrame
  useEffect(() => {
    if (isPlaying && selectedTimer && !timerIntervalRef.current) {
      // Set initial time
      setTimeRemaining(selectedTimer * 60);
      lastTickRef.current = Date.now();
      
      // Start countdown using requestAnimationFrame
      const tick = () => {
        const now = Date.now();
        const delta = now - lastTickRef.current;
        
        if (delta >= 1000) { // Update every second
          setTimeRemaining(prev => {
            if (prev === null || prev <= 1) {
              // Stop playback when timer ends
              stop();
              setIsPlaying(false);
              setSelectedTimer(null);
              timerIntervalRef.current = null;
              return null;
            }
            lastTickRef.current = now;
            return prev - 1;
          });
        }
        
        timerIntervalRef.current = requestAnimationFrame(tick);
      };
      
      timerIntervalRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (timerIntervalRef.current) {
        cancelAnimationFrame(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isPlaying, selectedTimer, stop]);

  // Stop playing when changing categories
  useEffect(() => {
    stop();
    setIsPlaying(false);
    setSelectedTimer(null);
    setTimeRemaining(null);
    if (timerIntervalRef.current) {
      cancelAnimationFrame(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [selectedCategory, stop]);

  // Handle play/pause
  const handlePlayPause = () => {
    if (!selectedFrequencyData) return;

    if (isPlaying) {
      stop();
      setIsPlaying(false);
      // Pause timer but keep the remaining time
      if (timerIntervalRef.current) {
        cancelAnimationFrame(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    } else {
      play(
        selectedFrequencyData.hz,
        playPerfectFifth,
        selectedFrequencyData.carrierLeft,
        selectedFrequencyData.carrierRight,
        selectedFrequencyData.includePinkNoise,
        selectedFrequencyData.isIsochronic
      );
      setIsPlaying(true);
    }
  };

  // Handle frequency selection
  const handleFrequencySelect = (freqId: string) => {
    setSelectedFrequency(freqId);
    
    // Find the new frequency data
    const newFreqData = frequencies?.find(f => f.id === freqId);
    
    if (newFreqData) {
      setSelectedFrequencyData(newFreqData);
      
      // If already playing, smoothly transition to new frequency
      if (isPlaying) {
        transitionToFrequency(
          newFreqData.hz,
          playPerfectFifth,
          newFreqData.carrierLeft,
          newFreqData.carrierRight,
          newFreqData.includePinkNoise,
          newFreqData.isIsochronic
        );
      } else {
        stop();
        setSelectedTimer(null);
        setTimeRemaining(null);
        if (timerIntervalRef.current) {
          cancelAnimationFrame(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      }
    }
  };

  // Handle timer selection
  const handleTimerSelect = (minutes: number | null) => {
    setSelectedTimer(minutes);
    setTimeRemaining(minutes ? minutes * 60 : null);
    if (timerIntervalRef.current) {
      cancelAnimationFrame(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      if (timerIntervalRef.current) {
        cancelAnimationFrame(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [stop]);

  // Get current frequency number
  const getCurrentFrequency = (): number => {
    return selectedFrequencyData?.hz || 10; // default to 10Hz if no frequency selected
  };

  // Update the useEffect to set selectedFrequencyData
  useEffect(() => {
    if (selectedCategory && selectedFrequency && frequencyPresets[selectedCategory]) {
      const freqData = frequencyPresets[selectedCategory].find(f => f.id === selectedFrequency);
      setSelectedFrequencyData(freqData || null);
    } else {
      setSelectedFrequencyData(null);
    }
  }, [selectedCategory, selectedFrequency]);

  // Handle perfect fifth toggle
  const handlePerfectFifthToggle = (enabled: boolean) => {
    setPlayPerfectFifth(enabled);
    if (isPlaying) {
      togglePerfectFifth(enabled);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategories(false);
    setSelectedFrequency(null);
    stop();
    setIsPlaying(false);
    setSelectedTimer(null);
    setTimeRemaining(null);
  };

  // Add scroll into view effect
  useEffect(() => {
    if (!showCategories && freqRef.current) {
      freqRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showCategories]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-start animate-in fade-in duration-500">
      <AboutDialog />
      <MeditationVisual 
        isPlaying={isPlaying} 
        frequency={getCurrentFrequency()} 
      />
      
      <div className="text-center max-w-xl mx-auto px-4 pt-10 sm:pt-16 pb-6 sm:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-xl mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Innerwave
          </h1>
          <p className="text-base text-neutral-400 mt-2">
            Step into resonance and choose a sound to center, awaken, or expand.
          </p>
        </motion.div>
      </div>
      
      <AnimatePresence mode="wait">
        {selectedCategory === 'binaural' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full mb-6 px-4 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-center relative z-10"
          >
            <p className="text-sm md:text-base text-indigo-200">
              🎧 For best results with Binaural Beats, please use stereo headphones
            </p>
          </motion.div>
        )}

        {selectedCategory === 'isochronic' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full mb-6 px-4 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-center relative z-10"
          >
            <p className="text-sm md:text-base text-indigo-200">
              🔊 Isochronic tones work with any audio setup - no headphones required
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full space-y-6 relative z-10 pt-6 pb-20">
        {/* Category Header when collapsed */}
        <AnimatePresence>
          {!showCategories && selectedCategory && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-center justify-between mb-2 px-4"
            >
              <div className="flex items-center gap-3">
                {categories.find(c => c.id === selectedCategory)?.icon && (
                  <div className="p-2 bg-neutral-700 rounded-lg">
                    {React.createElement(categories.find(c => c.id === selectedCategory)!.icon, {
                      className: "w-5 h-5"
                    })}
                  </div>
                )}
                <h2 className="text-lg md:text-xl font-semibold">
                  {categories.find(c => c.id === selectedCategory)?.title}
                </h2>
              </div>
              <button
                onClick={() => setShowCategories(true)}
                className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
              >
                Change
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: showCategories ? 1 : 0,
            y: showCategories ? 0 : 10,
            height: showCategories ? "auto" : 0
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 sm:gap-y-8 px-4 max-w-3xl mx-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <Card
                  key={category.id}
                  className={`p-4 sm:p-5 bg-neutral-800 hover:bg-neutral-700/80 transition-all duration-200 cursor-pointer rounded-xl ${
                    isSelected ? 'ring-1 ring-indigo-500 bg-indigo-500/5' : 'ring-0 hover:ring-1 hover:ring-neutral-600'
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-neutral-700 rounded-lg cursor-default">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h2 className="font-medium text-base md:text-lg">{category.title}</h2>
                        <div className="cursor-default">
                          <FrequencyModeInfo mode={category.id} />
                        </div>
                      </div>
                      <p className="text-sm md:text-base text-neutral-400 mt-1">{category.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* Frequency Grid */}
        <AnimatePresence mode="wait">
          {selectedCategory && frequencies && !showCategories && (
            <motion.div
              ref={freqRef}
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 px-4 max-w-3xl mx-auto"
            >
              {frequencies.map((freq) => (
                <Card
                  key={freq.id}
                  className={`p-4 sm:p-5 bg-neutral-800 hover:bg-neutral-700/80 transition-all duration-200 cursor-pointer rounded-xl ${
                    selectedFrequency === freq.id
                      ? 'ring-1 ring-indigo-500 bg-indigo-500/5'
                      : 'ring-0 hover:ring-1 hover:ring-neutral-600'
                  }`}
                  onClick={() => handleFrequencySelect(freq.id)}
                >
                  <h3 className="text-sm font-semibold mb-1">{freq.label}</h3>
                  <p className="text-xs text-neutral-400">{freq.description}</p>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AudioControls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onVolumeChange={setVolume}
        onPerfectFifthChange={handlePerfectFifthToggle}
        selectedFrequency={selectedFrequencyData}
        selectedTimer={selectedTimer}
        timeRemaining={timeRemaining}
        onTimerSelect={handleTimerSelect}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}
