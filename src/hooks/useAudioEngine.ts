import { useState, useEffect, useRef } from 'react';
import { AudioEngine } from '../audio/core/AudioEngine';
import type { AudioState, EffectParameters } from '../types/audio.types';
import { getDefaultParameters } from '../presets/presetDefinitions';

export const useAudioEngine = () => {
  const engineRef = useRef<AudioEngine | null>(null);
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    pitchSemitones: 0
  });
  const [effectParameters, setEffectParameters] = useState<EffectParameters>(
    getDefaultParameters()
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize engine
  useEffect(() => {
    engineRef.current = new AudioEngine();
    engineRef.current.onStateChangeListener(setAudioState);

    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  const loadFile = async (file: File) => {
    if (!engineRef.current) return;
    await engineRef.current.loadAudioFile(file);
    setIsLoaded(true);
  };

  const play = () => {
    engineRef.current?.play();
  };

  const pause = () => {
    engineRef.current?.pause();
  };

  const stop = () => {
    engineRef.current?.stop();
  };

  const updateEffect = (effectId: keyof EffectParameters, value: number) => {
    engineRef.current?.updateEffect(effectId, value);
    setEffectParameters(prev => ({ ...prev, [effectId]: value }));
  };

  const setPitch = (semitones: number) => {
    engineRef.current?.setPitch(semitones);
  };

  const loadCrackle = async (filename: string) => {
    await engineRef.current?.loadCrackle(filename);
  };

  const exportWAV = async (filename?: string, onProgress?: (progress: number) => void) => {
    await engineRef.current?.exportToWAV(filename, onProgress);
  };

  return {
    audioState,
    effectParameters,
    isLoaded,
    loadFile,
    play,
    pause,
    stop,
    updateEffect,
    setPitch,
    loadCrackle,
    exportWAV
  };
};
