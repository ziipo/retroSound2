import { MasteringMode, MasteringConfig } from '../../types/audio.types';

/**
 * Master Processor
 * Final mastering stage with compression and EQ
 *
 * From Patina implementation - Four mastering modes:
 * - Neutral: threshold -24dB, ratio 1.1
 * - Motown: threshold -22dB, ratio 2.0
 * - Blue Note: threshold -22.5dB, ratio 1.3
 * - Abbey Road: threshold -22.5dB, ratio 1.3
 */
export class MasterProcessor {
  private context: AudioContext;
  public input: GainNode;
  public output: GainNode;

  private compressor: DynamicsCompressorNode;
  private eq: BiquadFilterNode;
  private mode: MasteringMode = 'neutral';

  private readonly MASTERING_CONFIGS: Record<MasteringMode, MasteringConfig> = {
    neutral: {
      threshold: -24,
      ratio: 1.1,
      saturationMultiplier: 0.01,
      eqMode: 'transparent'
    },
    motown: {
      threshold: -22,
      ratio: 2.0,
      saturationMultiplier: 0.05,
      eqMode: 'aggressive_scoop'
    },
    blueNote: {
      threshold: -22.5,
      ratio: 1.3,
      saturationMultiplier: 0.03,
      eqMode: 'warm_midrange'
    },
    abbeyRoad: {
      threshold: -22.5,
      ratio: 1.3,
      saturationMultiplier: 0.01,
      eqMode: 'refined_character'
    }
  };

  constructor(context: AudioContext) {
    this.context = context; // Store context for future use
    this.input = context.createGain();
    this.output = context.createGain();

    // Compressor
    this.compressor = context.createDynamicsCompressor();
    this.compressor.threshold.value = -24;
    this.compressor.knee.value = 10;
    this.compressor.ratio.value = 1.1;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.25;

    // EQ
    this.eq = context.createBiquadFilter();
    this.eq.type = 'peaking';
    this.eq.frequency.value = 1000;
    this.eq.Q.value = 1.0;
    this.eq.gain.value = 0;

    // Connect
    this.input.connect(this.compressor);
    this.compressor.connect(this.eq);
    this.eq.connect(this.output);
  }

  setMode(mode: MasteringMode): void {
    this.mode = mode;
    this.applyMasteringConfig();
  }

  private applyMasteringConfig(): void {
    const config = this.MASTERING_CONFIGS[this.mode];

    // Apply compression settings
    this.compressor.threshold.value = config.threshold;
    this.compressor.ratio.value = config.ratio;

    // Apply EQ based on mode
    switch (config.eqMode) {
      case 'aggressive_scoop':
        // Motown: scooped mids, emphasized highs
        this.eq.type = 'peaking';
        this.eq.frequency.value = 1000;
        this.eq.Q.value = 2.0;
        this.eq.gain.value = -3;
        break;

      case 'warm_midrange':
        // Blue Note: warm mids
        this.eq.type = 'peaking';
        this.eq.frequency.value = 800;
        this.eq.Q.value = 1.5;
        this.eq.gain.value = 2;
        break;

      case 'refined_character':
        // Abbey Road: subtle high shelf
        this.eq.type = 'highshelf';
        this.eq.frequency.value = 3000;
        this.eq.gain.value = 1;
        break;

      case 'transparent':
      default:
        // Neutral: minimal EQ
        this.eq.gain.value = 0;
        break;
    }
  }

  destroy(): void {
    this.compressor.disconnect();
    this.eq.disconnect();
    this.input.disconnect();
    this.output.disconnect();
  }
}
