import type { PresetConfig, EffectParameters } from '../types/audio.types';

/**
 * Preset Definitions
 * All 9 presets with exact parameter values from Patina
 */
export const PRESETS: PresetConfig[] = [
  {
    id: 'untouched',
    name: 'Untouched Tracks',
    description: 'Pristine vinyl with minimal aging',
    crackleFile: 'crackle01.wav',
    params: {
      dropout: 0,
      deterioration: 0,
      crackle: 0.05,
      warp: 0,
      age: 200,
      riaa: 0,
      stylus: 0,
      pinch: 0,
      ghostEcho: 0,
      wornStylus: 0,
      innerGroove: 0,
      spindle: 0
    }
  },
  {
    id: 'mellow-vintage',
    name: 'Mellow Vintage',
    description: 'Warm, well-preserved record',
    crackleFile: 'crackle13.wav',
    params: {
      dropout: 0,
      deterioration: 0.35,
      crackle: 0.21,
      warp: 0.29,
      age: 1200,
      riaa: 0.07,
      stylus: 0,
      pinch: 0.18,
      ghostEcho: 0,
      wornStylus: 0.08,
      innerGroove: 0.01,
      spindle: 0.01
    }
  },
  {
    id: 'dusty-basement',
    name: 'Dusty Basement Archive',
    description: 'Heavy wear and surface noise',
    crackleFile: 'crackle21.wav',
    params: {
      dropout: 0.5,
      deterioration: 0.5,
      crackle: 0.7,
      warp: 0.3,
      age: 3400,
      riaa: 0.28,
      stylus: 0.2,
      pinch: 0.3,
      ghostEcho: 0.29,
      wornStylus: 0.51,
      innerGroove: 0.18,
      spindle: 0
    }
  },
  {
    id: 'midnight-jazz',
    name: 'Midnight Jazz Vinyl',
    description: 'Smoky jazz club atmosphere',
    crackleFile: 'crackle09.wav',
    params: {
      dropout: 0.15,
      deterioration: 0.25,
      crackle: 0.35,
      warp: 0.15,
      age: 2800,
      riaa: 0.15,
      stylus: 0.12,
      pinch: 0.2,
      ghostEcho: 0.18,
      wornStylus: 0.22,
      innerGroove: 0.08,
      spindle: 0.05
    }
  },
  {
    id: 'parlor-melodies',
    name: 'Parlor Melodies',
    description: 'Early 1900s phonograph character',
    crackleFile: 'crackle17.wav',
    params: {
      dropout: 0.4,
      deterioration: 0.6,
      crackle: 0.8,
      warp: 0.45,
      age: 5200,
      riaa: 0.5,
      stylus: 0.35,
      pinch: 0.4,
      ghostEcho: 0.15,
      wornStylus: 0.65,
      innerGroove: 0.25,
      spindle: 0.12
    }
  },
  {
    id: 'experimental',
    name: 'Experimental Transmission',
    description: 'Heavily degraded, lo-fi character',
    crackleFile: 'crackle23.wav',
    params: {
      dropout: 0.7,
      deterioration: 0.75,
      crackle: 0.9,
      warp: 0.6,
      age: 6800,
      riaa: 0.65,
      stylus: 0.45,
      pinch: 0.55,
      ghostEcho: 0.42,
      wornStylus: 0.8,
      innerGroove: 0.5,
      spindle: 0.25
    }
  },
  {
    id: 'greenwich-loft',
    name: 'Greenwich Village Loft',
    description: 'Vintage folk recording aesthetic',
    crackleFile: 'crackle05.wav',
    params: {
      dropout: 0.2,
      deterioration: 0.3,
      crackle: 0.4,
      warp: 0.2,
      age: 3200,
      riaa: 0.22,
      stylus: 0.15,
      pinch: 0.25,
      ghostEcho: 0.12,
      wornStylus: 0.28,
      innerGroove: 0.1,
      spindle: 0.08
    }
  },
  {
    id: 'los-pamperos',
    name: 'Los Pamperos',
    description: 'South American vinyl archive',
    crackleFile: 'crackle11.wav',
    params: {
      dropout: 0.35,
      deterioration: 0.45,
      crackle: 0.6,
      warp: 0.35,
      age: 4100,
      riaa: 0.35,
      stylus: 0.25,
      pinch: 0.35,
      ghostEcho: 0.25,
      wornStylus: 0.42,
      innerGroove: 0.2,
      spindle: 0.15
    }
  },
  {
    id: 'vinyl-erosion',
    name: 'Vinyl Erosion',
    description: 'Maximum deterioration and character',
    crackleFile: 'crackle19.wav',
    params: {
      dropout: 0.85,
      deterioration: 0.9,
      crackle: 1.0,
      warp: 0.75,
      age: 7800,
      riaa: 0.8,
      stylus: 0.6,
      pinch: 0.7,
      ghostEcho: 0.55,
      wornStylus: 0.95,
      innerGroove: 0.65,
      spindle: 0.35
    }
  }
];

/**
 * Get preset by ID
 */
export const getPresetById = (id: string): PresetConfig | undefined => {
  return PRESETS.find(preset => preset.id === id);
};

/**
 * Get default effect parameters (Untouched Tracks)
 */
export const getDefaultParameters = (): EffectParameters => {
  return { ...PRESETS[0].params };
};
