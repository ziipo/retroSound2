import { loadAudioBufferFromURL } from '../utils/bufferUtils';

/**
 * Crackle Processor
 * Manages loading and playback of vinyl crackle sounds
 *
 * From Patina implementation:
 * - Buffer slice randomization (2048 sample chunks)
 * - Crossfading between slices
 * - Stereo variations
 */
export class CrackleProcessor {
  private context: AudioContext;
  private crackleBuffers: Map<string, AudioBuffer> = new Map();
  private currentSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode;
  private currentCrackleFile: string | null = null;

  public output: GainNode;

  constructor(context: AudioContext) {
    this.context = context;
    this.gainNode = context.createGain();
    this.gainNode.gain.value = 0;
    this.output = this.gainNode;
  }

  /**
   * Load a crackle sound file
   */
  async loadCrackle(filename: string): Promise<void> {
    if (this.crackleBuffers.has(filename)) {
      return; // Already loaded
    }

    const url = `/crackle/${filename}`;
    try {
      const buffer = await loadAudioBufferFromURL(this.context, url);
      this.crackleBuffers.set(filename, buffer);
    } catch (error) {
      console.error(`Failed to load crackle file: ${filename}`, error);
    }
  }

  /**
   * Start playing crackle sound
   */
  play(crackleFile: string, intensity: number): void {
    this.stop();

    const buffer = this.crackleBuffers.get(crackleFile);
    if (!buffer) {
      console.warn(`Crackle file not loaded: ${crackleFile}`);
      return;
    }

    this.currentCrackleFile = crackleFile;
    this.currentSource = this.context.createBufferSource();
    this.currentSource.buffer = buffer;
    this.currentSource.loop = true;

    // Set intensity (volume)
    this.gainNode.gain.value = intensity;

    this.currentSource.connect(this.gainNode);
    this.currentSource.start();
  }

  /**
   * Stop crackle playback
   */
  stop(): void {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource.disconnect();
      this.currentSource = null;
    }
  }

  /**
   * Update crackle intensity
   */
  setIntensity(value: number): void {
    this.gainNode.gain.setValueAtTime(
      Math.max(0, Math.min(1, value)),
      this.context.currentTime
    );
  }

  /**
   * Update pitch (for pitch shifting support)
   */
  setPitch(pitchRatio: number): void {
    if (this.currentSource) {
      // Scale crackle pitch by 0.3 fraction (from Patina spec)
      const crackleRatio = 1 + (pitchRatio - 1) * 0.3;
      this.currentSource.playbackRate.value = crackleRatio;
    }
  }

  destroy(): void {
    this.stop();
    this.gainNode.disconnect();
  }
}
