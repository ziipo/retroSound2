// Audio effect parameters matching the Patina implementation
export interface EffectParameters {
  dropout: number;           // 0-1
  deterioration: number;     // 0-1
  crackle: number;           // 0-1
  warp: number;              // 0-1
  age: number;               // 200-8000 Hz
  riaa: number;              // 0-1
  stylus: number;            // 0-1 (stylus resonance)
  pinch: number;             // 0-1
  ghostEcho: number;         // 0-1
  wornStylus: number;        // 0-1
  innerGroove: number;       // 0-1
  spindle: number;           // 0-1 (spindle eccentricity/warp)
}

export interface PresetConfig {
  id: string;
  name: string;
  description: string;
  crackleFile: string;       // e.g., 'crackle13.wav'
  params: EffectParameters;
}

export type MasteringMode = 'neutral' | 'motown' | 'blueNote' | 'abbeyRoad';

export interface MasteringConfig {
  threshold: number;         // dB
  ratio: number;
  saturationMultiplier: number;
  eqMode: string;
}

export interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  pitchSemitones: number;    // -12 to +12
}
