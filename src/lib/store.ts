import { create } from 'zustand';
import { StateCreator } from 'zustand';

interface AudioState {
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentFrequency: number | null;
  setCurrentFrequency: (frequency: number | null) => void;
  perfectFifthEnabled: boolean;
  setPerfectFifthEnabled: (enabled: boolean) => void;
}

type AudioStore = StateCreator<AudioState>;

export const useAudioStore = create<AudioState>((set: Parameters<AudioStore>[0]) => ({
  volume: 0.5,
  setVolume: (volume: number) => set({ volume }),
  isMuted: false,
  setIsMuted: (isMuted: boolean) => set({ isMuted }),
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  currentFrequency: null,
  setCurrentFrequency: (frequency: number | null) => set({ currentFrequency: frequency }),
  perfectFifthEnabled: false,
  setPerfectFifthEnabled: (enabled: boolean) => set({ perfectFifthEnabled: enabled }),
})); 