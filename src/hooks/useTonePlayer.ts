import { useCallback, useEffect, useRef } from 'react';

interface OscillatorWithGain {
  oscillator: OscillatorNode;
  gain: GainNode;
  panner?: StereoPannerNode;
}

interface NoiseNode {
  bufferSource: AudioBufferSourceNode;
  gain: GainNode;
}

interface CurrentToneState {
  frequency: number;
  carrierLeft?: number;
  carrierRight?: number;
  playPerfectFifth: boolean;
  isIsochronic?: boolean;
}

const FADE_DURATION = 0.1; // 100ms fade in/out
const CARRIER_FREQUENCY = 400; // Base carrier frequency for isochronic tones
const NOISE_BUFFER_SIZE = 44100 * 2; // 2 seconds of audio at 44.1kHz

export function useTonePlayer() {
  // Use refs to persist audio context and nodes between renders
  const audioContextRef = useRef<AudioContext | null>(null);
  const mainOscillatorsRef = useRef<OscillatorWithGain[]>([]);
  const fifthOscillatorsRef = useRef<OscillatorWithGain[]>([]);
  const noiseNodeRef = useRef<NoiseNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const volumeRef = useRef<number>(0.5); // Default volume
  const isPlayingRef = useRef<boolean>(false);
  const currentToneRef = useRef<CurrentToneState | null>(null);
  const isochronicIntervalRef = useRef<number | null>(null);
  const previousFrequencyRef = useRef<CurrentToneState | null>(null);

  // Initialize or get audio context
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.connect(audioContextRef.current.destination);
      masterGainRef.current.gain.value = volumeRef.current;
    }
    return audioContextRef.current;
  }, []);

  // Generate pink noise
  const createPinkNoise = useCallback((ctx: AudioContext) => {
    const bufferSize = NOISE_BUFFER_SIZE;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      
      // Pink noise filter
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0; // Start silent
    
    source.connect(gainNode);
    gainNode.connect(masterGainRef.current!);
    
    source.start();
    
    return { bufferSource: source, gain: gainNode };
  }, []);

  // Cleanup specific oscillators with fade out
  const cleanupOscillators = useCallback((oscillators: OscillatorWithGain[]) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const currentTime = ctx.currentTime;
    
    oscillators.forEach(({ oscillator, gain, panner }) => {
      gain.gain.setValueAtTime(gain.gain.value, currentTime);
      gain.gain.linearRampToValueAtTime(0, currentTime + FADE_DURATION);
      
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
        gain.disconnect();
        if (panner) panner.disconnect();
      }, FADE_DURATION * 1100);
    });
  }, []);

  // Create an isochronic tone oscillator
  const createIsochronicOscillator = useCallback((
    ctx: AudioContext,
    beatFrequency: number,
    carrierFrequency: number = CARRIER_FREQUENCY
  ) => {
    const oscillator = ctx.createOscillator();
    const oscillatorGain = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = carrierFrequency;
    
    oscillator.connect(oscillatorGain);
    oscillatorGain.connect(masterGainRef.current!);
    
    // Start with 0 gain
    oscillatorGain.gain.setValueAtTime(0, ctx.currentTime);
    
    // Start the oscillator
    oscillator.start();
    
    // Calculate timing constants
    const cycleDuration = 1 / beatFrequency; // Full cycle duration in seconds
    const fadeTime = 0.005; // 5ms fade time for both in and out
    const onTime = cycleDuration / 2 - fadeTime; // Time to stay at full volume
    
    // Set up the isochronic pulsing
    const pulseInterval = setInterval(() => {
      if (!isPlayingRef.current) return;
      
      const now = ctx.currentTime;
      
      // Cancel any scheduled values
      oscillatorGain.gain.cancelScheduledValues(now);
      
      // Fade in
      oscillatorGain.gain.setValueAtTime(0, now);
      oscillatorGain.gain.linearRampToValueAtTime(volumeRef.current, now + fadeTime);
      
      // Fade out
      oscillatorGain.gain.setValueAtTime(volumeRef.current, now + fadeTime + onTime);
      oscillatorGain.gain.linearRampToValueAtTime(0, now + fadeTime + onTime + fadeTime);
      
    }, 1000 / beatFrequency); // Schedule next cycle
    
    isochronicIntervalRef.current = pulseInterval as unknown as number;
    
    return { oscillator, gain: oscillatorGain };
  }, []);

  // Stop all audio and cleanup with optional fade duration
  const stopAll = useCallback((fadeDuration: number = FADE_DURATION) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Clear isochronic interval if it exists
    if (isochronicIntervalRef.current !== null) {
      clearInterval(isochronicIntervalRef.current);
      isochronicIntervalRef.current = null;
    }

    // Store current state before cleanup
    previousFrequencyRef.current = currentToneRef.current;

    // Fade out all oscillators
    const currentTime = ctx.currentTime;
    [...mainOscillatorsRef.current, ...fifthOscillatorsRef.current].forEach(({ gain }) => {
      gain.gain.setValueAtTime(gain.gain.value, currentTime);
      gain.gain.linearRampToValueAtTime(0, currentTime + fadeDuration);
    });

    // Clean up after fade
    setTimeout(() => {
      cleanupOscillators(mainOscillatorsRef.current);
      cleanupOscillators(fifthOscillatorsRef.current);
      mainOscillatorsRef.current = [];
      fifthOscillatorsRef.current = [];
    }, fadeDuration * 1100);
    
    // Cleanup noise with fade
    if (noiseNodeRef.current) {
      const { gain, bufferSource } = noiseNodeRef.current;
      gain.gain.setValueAtTime(gain.gain.value, currentTime);
      gain.gain.linearRampToValueAtTime(0, currentTime + fadeDuration);
      
      setTimeout(() => {
        bufferSource.stop();
        bufferSource.disconnect();
        gain.disconnect();
      }, fadeDuration * 1100);
      
      noiseNodeRef.current = null;
    }

    isPlayingRef.current = false;
    currentToneRef.current = null;
  }, [cleanupOscillators]);

  // Create an oscillator with smooth gain transitions and optional panning
  const createOscillator = useCallback((
    ctx: AudioContext,
    freq: number,
    pan: number = 0,
    initialGain: number = 1
  ) => {
    const oscillator = ctx.createOscillator();
    const oscillatorGain = ctx.createGain();
    let panner: StereoPannerNode | undefined;
    
    oscillator.type = 'sine';
    oscillator.frequency.value = freq;
    
    // Add stereo panning if needed
    if (pan !== 0) {
      panner = ctx.createStereoPanner();
      panner.pan.value = pan;
      oscillator.connect(panner);
      panner.connect(oscillatorGain);
    } else {
      oscillator.connect(oscillatorGain);
    }
    
    // Start with 0 gain and ramp up
    oscillatorGain.gain.setValueAtTime(0, ctx.currentTime);
    oscillatorGain.gain.linearRampToValueAtTime(
      initialGain * volumeRef.current,
      ctx.currentTime + FADE_DURATION
    );
    
    oscillatorGain.connect(masterGainRef.current!);
    oscillator.start();
    
    return { oscillator, gain: oscillatorGain, panner };
  }, []);

  // Create a stereo oscillator pair with proper panning
  const createStereoPair = useCallback((
    ctx: AudioContext,
    leftFreq: number,
    rightFreq: number,
    initialGain: number = 1
  ) => {
    // Create shared gain node for the stereo pair
    const stereoGain = ctx.createGain();
    stereoGain.gain.setValueAtTime(0, ctx.currentTime);
    stereoGain.gain.linearRampToValueAtTime(
      initialGain * volumeRef.current,
      ctx.currentTime + FADE_DURATION
    );
    stereoGain.connect(masterGainRef.current!);

    // Create left channel
    const leftOsc = ctx.createOscillator();
    const leftPanner = ctx.createStereoPanner();
    leftOsc.type = 'sine';
    leftOsc.frequency.value = leftFreq;
    leftPanner.pan.value = -1;
    leftOsc.connect(leftPanner);
    leftPanner.connect(stereoGain);
    leftOsc.start();

    // Create right channel
    const rightOsc = ctx.createOscillator();
    const rightPanner = ctx.createStereoPanner();
    rightOsc.type = 'sine';
    rightOsc.frequency.value = rightFreq;
    rightPanner.pan.value = 1;
    rightOsc.connect(rightPanner);
    rightPanner.connect(stereoGain);
    rightOsc.start();

    return [
      { oscillator: leftOsc, gain: stereoGain, panner: leftPanner },
      { oscillator: rightOsc, gain: stereoGain, panner: rightPanner }
    ];
  }, []);

  // Create fifth oscillators based on current state
  const createFifthOscillators = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx || !currentToneRef.current) return;

    const { frequency, carrierLeft, carrierRight } = currentToneRef.current;

    // Clean up any existing fifth oscillators
    cleanupOscillators(fifthOscillatorsRef.current);
    fifthOscillatorsRef.current = [];

    if (carrierLeft && carrierRight) {
      // For custom carrier frequencies
      const fifthPair = createStereoPair(
        ctx,
        carrierLeft * 1.5,
        carrierRight * 1.5,
        0.5
      );
      fifthOscillatorsRef.current.push(...fifthPair);
    } else if (frequency < 40) {
      // For binaural beats
      const fifthPair = createStereoPair(
        ctx,
        CARRIER_FREQUENCY * 1.5,
        (CARRIER_FREQUENCY + frequency) * 1.5,
        0.5
      );
      fifthOscillatorsRef.current.push(...fifthPair);
    } else {
      // For regular frequencies
      const fifthOsc = createOscillator(ctx, frequency * 1.5, 0, 0.5);
      fifthOscillatorsRef.current.push(fifthOsc);
    }
  }, [cleanupOscillators, createOscillator, createStereoPair]);

  // Play a tone at the specified frequency with optional fade in
  const play = useCallback((
    frequency: number,
    playPerfectFifth: boolean = false,
    carrierLeft?: number,
    carrierRight?: number,
    includePinkNoise?: boolean,
    isIsochronic: boolean = false,
    fadeInDelay: number = 0,
    fadeInDuration: number = FADE_DURATION
  ) => {
    const ctx = getAudioContext();
    
    // Store current tone state
    currentToneRef.current = { 
      frequency, 
      carrierLeft, 
      carrierRight,
      playPerfectFifth,
      isIsochronic 
    };
    isPlayingRef.current = true;

    // Delay the start if requested
    setTimeout(() => {
      if (isIsochronic) {
        // For isochronic tones, use a single oscillator with amplitude modulation
        const isochronicOsc = createIsochronicOscillator(ctx, frequency);
        mainOscillatorsRef.current.push(isochronicOsc);
      } else if (carrierLeft && carrierRight) {
        // Handle custom carrier frequencies for binaural beats
        const stereoPair = createStereoPair(ctx, carrierLeft, carrierRight);
        mainOscillatorsRef.current.push(...stereoPair);
      } else if (frequency < 40) { // If frequency is in brainwave range
        const stereoPair = createStereoPair(ctx, CARRIER_FREQUENCY, CARRIER_FREQUENCY + frequency);
        mainOscillatorsRef.current.push(...stereoPair);
      } else {
        const mainOsc = createOscillator(ctx, frequency);
        mainOscillatorsRef.current.push(mainOsc);
      }

      // Add perfect fifth if requested
      if (playPerfectFifth) {
        createFifthOscillators();
      }

      // Add pink noise if requested
      if (includePinkNoise) {
        noiseNodeRef.current = createPinkNoise(ctx);
        noiseNodeRef.current.gain.gain.setValueAtTime(0, ctx.currentTime);
        noiseNodeRef.current.gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + fadeInDuration);
      }
    }, fadeInDelay);
  }, [getAudioContext, createOscillator, createStereoPair, createFifthOscillators, createPinkNoise, createIsochronicOscillator]);

  // Handle perfect fifth toggle
  const togglePerfectFifth = useCallback((enabled: boolean) => {
    if (!isPlayingRef.current || !currentToneRef.current) return;

    currentToneRef.current.playPerfectFifth = enabled;

    if (enabled) {
      createFifthOscillators();
    } else {
      cleanupOscillators(fifthOscillatorsRef.current);
      fifthOscillatorsRef.current = [];
    }
  }, [createFifthOscillators, cleanupOscillators]);

  // Set volume (0 to 1)
  const setVolume = useCallback((volume: number) => {
    const ctx = audioContextRef.current;
    if (!ctx || !masterGainRef.current) return;

    const normalizedVolume = Math.max(0, Math.min(1, volume));
    volumeRef.current = normalizedVolume;
    
    // Smoothly transition to new volume
    masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ctx.currentTime);
    masterGainRef.current.gain.linearRampToValueAtTime(
      normalizedVolume,
      ctx.currentTime + FADE_DURATION
    );
  }, []);

  // Add a new method for smooth frequency transition
  const transitionToFrequency = useCallback((
    frequency: number,
    playPerfectFifth: boolean = false,
    carrierLeft?: number,
    carrierRight?: number,
    includePinkNoise?: boolean,
    isIsochronic: boolean = false
  ) => {
    const FADE_OUT = 0.1; // 100ms fade out
    const TRANSITION_GAP = 0.05; // 50ms gap
    const FADE_IN = 0.1; // 100ms fade in

    stopAll(FADE_OUT);
    play(
      frequency,
      playPerfectFifth,
      carrierLeft,
      carrierRight,
      includePinkNoise,
      isIsochronic,
      (FADE_OUT + TRANSITION_GAP) * 1000,
      FADE_IN
    );
  }, [stopAll, play]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (isochronicIntervalRef.current !== null) {
        clearInterval(isochronicIntervalRef.current);
        isochronicIntervalRef.current = null;
      }
    };
  }, [stopAll]);

  return {
    play,
    stop: stopAll,
    setVolume,
    togglePerfectFifth,
    transitionToFrequency,
  };
} 