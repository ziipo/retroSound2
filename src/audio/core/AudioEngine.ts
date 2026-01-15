import { getAudioContext } from './audioContext';
import { loadAudioBuffer } from '../utils/bufferUtils';

// Import all effects
import { StereoBalanceEffect } from '../effects/StereoBalanceEffect';
import { VinylDamageProcessor } from '../effects/VinylDamageProcessor';
import { RIAAEmphasis } from '../effects/RIAAEmphasis';
import { AgeFilter } from '../effects/AgeFilter';
import { GhostEchoEffect } from '../effects/GhostEchoEffect';
import { WornStylusEffect } from '../effects/WornStylusEffect';
import { StylusResonance } from '../effects/StylusResonance';
import { PinchEffect } from '../effects/PinchEffect';
import { InnerGrooveDistortion } from '../effects/InnerGrooveDistortion';
import { SpindleEccentricity } from '../effects/SpindleEccentricity';

// Import processors
import { CrackleProcessor } from '../processors/CrackleProcessor';
import { MasterProcessor } from '../processors/MasterProcessor';
import { WAVExporter } from '../processors/WAVExporter';

import type { EffectParameters, MasteringMode, AudioState } from '../../types/audio.types';

/**
 * Audio Engine
 * Main audio graph orchestrator
 *
 * Effect chain order (from Patina):
 * source → stereoBalance → vinylDamage → riaa → ageFilter → ghostEcho →
 * wornStylus → stylusResonance → pinch → innerGroove → spindle → master → destination
 *
 * + crackleProcessor (mixed in parallel)
 */
export class AudioEngine {
  private context: AudioContext;
  private source: AudioBufferSourceNode | null = null;
  private audioBuffer: AudioBuffer | null = null;

  // Effect instances
  private effects: {
    stereoBalance: StereoBalanceEffect;
    vinylDamage: VinylDamageProcessor;
    riaa: RIAAEmphasis;
    ageFilter: AgeFilter;
    ghostEcho: GhostEchoEffect;
    wornStylus: WornStylusEffect;
    stylusResonance: StylusResonance;
    pinch: PinchEffect;
    innerGroove: InnerGrooveDistortion;
    spindle: SpindleEccentricity;
  };

  // Processors
  private crackleProcessor: CrackleProcessor;
  private masterProcessor: MasterProcessor;
  private wavExporter: WAVExporter;

  // State
  private state: AudioState = {
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    pitchSemitones: 0
  };

  private startTime = 0;
  private pauseTime = 0;
  private currentCrackleFile: string | null = null;

  // Event listeners
  private onStateChange?: (state: AudioState) => void;

  constructor() {
    this.context = getAudioContext();

    // Initialize all effects
    this.effects = {
      stereoBalance: new StereoBalanceEffect(this.context),
      vinylDamage: new VinylDamageProcessor(this.context),
      riaa: new RIAAEmphasis(this.context),
      ageFilter: new AgeFilter(this.context),
      ghostEcho: new GhostEchoEffect(this.context),
      wornStylus: new WornStylusEffect(this.context),
      stylusResonance: new StylusResonance(this.context),
      pinch: new PinchEffect(this.context),
      innerGroove: new InnerGrooveDistortion(this.context),
      spindle: new SpindleEccentricity(this.context)
    };

    // Initialize processors
    this.crackleProcessor = new CrackleProcessor(this.context);
    this.masterProcessor = new MasterProcessor(this.context);
    this.wavExporter = new WAVExporter();

    this.connectEffectChain();
  }

  /**
   * Connect all effects in the proper order
   */
  private connectEffectChain(): void {
    const {
      stereoBalance,
      vinylDamage,
      riaa,
      ageFilter,
      ghostEcho,
      wornStylus,
      stylusResonance,
      pinch,
      innerGroove,
      spindle
    } = this.effects;

    // Connect effects in exact order from Patina
    stereoBalance.connect(vinylDamage.input);
    vinylDamage.connect(riaa.input);
    riaa.connect(ageFilter.input);
    ageFilter.connect(ghostEcho.input);
    ghostEcho.connect(wornStylus.input);
    wornStylus.connect(stylusResonance.input);
    stylusResonance.connect(pinch.input);
    pinch.connect(innerGroove.input);
    innerGroove.connect(spindle.input);
    spindle.connect(this.masterProcessor.input);

    // Crackle processor mixes into master
    this.crackleProcessor.output.connect(this.masterProcessor.input);

    // Master to destination
    this.masterProcessor.output.connect(this.context.destination);
  }

  /**
   * Load an audio file
   */
  async loadAudioFile(file: File): Promise<void> {
    try {
      this.audioBuffer = await loadAudioBuffer(this.context, file);
      this.state.duration = this.audioBuffer.duration;
      this.emitStateChange();
    } catch (error) {
      console.error('Failed to load audio file:', error);
      throw error;
    }
  }

  /**
   * Play audio
   */
  play(): void {
    if (!this.audioBuffer) {
      console.warn('No audio buffer loaded');
      return;
    }

    // Resume audio context if suspended
    if (this.context.state === 'suspended') {
      this.context.resume();
    }

    // If paused, resume from pause position
    if (this.state.isPaused) {
      this.startPlayback(this.pauseTime);
      this.state.isPaused = false;
    } else {
      this.startPlayback(0);
    }

    this.state.isPlaying = true;
    this.emitStateChange();
  }

  /**
   * Pause audio
   */
  pause(): void {
    if (!this.state.isPlaying) return;

    // Stop current source
    if (this.source) {
      this.source.stop();
      this.source.disconnect();
      this.source = null;
    }

    // Save pause position
    this.pauseTime = this.context.currentTime - this.startTime;

    // Stop crackle
    this.crackleProcessor.stop();

    // Stop damage processor
    this.effects.vinylDamage.stop();

    this.state.isPlaying = false;
    this.state.isPaused = true;
    this.emitStateChange();
  }

  /**
   * Stop audio
   */
  stop(): void {
    if (this.source) {
      this.source.stop();
      this.source.disconnect();
      this.source = null;
    }

    this.crackleProcessor.stop();
    this.effects.vinylDamage.stop();

    this.startTime = 0;
    this.pauseTime = 0;
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.currentTime = 0;
    this.emitStateChange();
  }

  /**
   * Start playback from a specific position
   */
  private startPlayback(offset: number): void {
    if (!this.audioBuffer) return;

    // Create new buffer source
    this.source = this.context.createBufferSource();
    this.source.buffer = this.audioBuffer;

    // Apply pitch adjustment
    const pitchRatio = Math.pow(2, this.state.pitchSemitones / 12);
    this.source.playbackRate.value = pitchRatio;

    // Connect to effect chain
    this.source.connect(this.effects.stereoBalance.input);

    // Handle playback end
    this.source.onended = () => {
      if (this.state.isPlaying) {
        this.stop();
      }
    };

    // Start playback
    this.startTime = this.context.currentTime - offset;
    this.source.start(0, offset);

    // Start vinyl damage processor
    this.effects.vinylDamage.start();

    // Start crackle if set
    if (this.currentCrackleFile) {
      const crackleIntensity = this.getEffectParameter('crackle');
      this.crackleProcessor.play(this.currentCrackleFile, crackleIntensity);
      this.crackleProcessor.setPitch(pitchRatio);
    }
  }

  /**
   * Update an effect parameter
   */
  updateEffect(effectId: keyof EffectParameters, value: number): void {
    switch (effectId) {
      case 'dropout':
        this.effects.vinylDamage.setParameter('dropout', value);
        break;
      case 'deterioration':
        this.effects.vinylDamage.setParameter('deterioration', value);
        break;
      case 'crackle':
        this.crackleProcessor.setIntensity(value);
        break;
      case 'warp':
      case 'spindle':
        this.effects.spindle.setParameter('intensity', value);
        break;
      case 'age':
        this.effects.ageFilter.setParameter('age', value);
        break;
      case 'riaa':
        this.effects.riaa.setParameter('riaa', value);
        break;
      case 'stylus':
        this.effects.stylusResonance.setParameter('stylus', value);
        break;
      case 'pinch':
        this.effects.pinch.setParameter('pinch', value);
        break;
      case 'ghostEcho':
        this.effects.ghostEcho.setParameter('ghostEcho', value);
        break;
      case 'wornStylus':
        this.effects.wornStylus.setParameter('wornStylus', value);
        break;
      case 'innerGroove':
        this.effects.innerGroove.setParameter('innerGroove', value);
        break;
    }
  }

  /**
   * Get current effect parameter value (for internal use)
   */
  private getEffectParameter(_effectId: string): number {
    // This would need to track parameter values
    // For now, return a default
    return 0.5;
  }

  /**
   * Set pitch shift
   */
  setPitch(semitones: number): void {
    this.state.pitchSemitones = Math.max(-12, Math.min(12, semitones));

    // Update playback rate if currently playing
    if (this.source) {
      const pitchRatio = Math.pow(2, this.state.pitchSemitones / 12);
      this.source.playbackRate.value = pitchRatio;
      this.crackleProcessor.setPitch(pitchRatio);
    }

    this.emitStateChange();
  }

  /**
   * Load a crackle file
   */
  async loadCrackle(filename: string): Promise<void> {
    await this.crackleProcessor.loadCrackle(filename);
    this.currentCrackleFile = filename;
  }

  /**
   * Set mastering mode
   */
  setMasteringMode(mode: MasteringMode): void {
    this.masterProcessor.setMode(mode);
  }

  /**
   * Export to WAV
   */
  async exportToWAV(
    filename?: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    if (!this.audioBuffer) {
      throw new Error('No audio buffer loaded');
    }

    const blob = await this.wavExporter.export(
      this.audioBuffer,
      this.state.pitchSemitones,
      onProgress
    );

    this.wavExporter.downloadWAV(blob, filename);
  }

  /**
   * Get current state
   */
  getState(): AudioState {
    if (this.state.isPlaying && this.source) {
      this.state.currentTime = this.context.currentTime - this.startTime;
    }
    return { ...this.state };
  }

  /**
   * Set state change listener
   */
  onStateChangeListener(callback: (state: AudioState) => void): void {
    this.onStateChange = callback;
  }

  private emitStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange(this.getState());
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stop();

    // Destroy all effects
    Object.values(this.effects).forEach(effect => effect.destroy());

    this.crackleProcessor.destroy();
    this.masterProcessor.destroy();
  }
}
