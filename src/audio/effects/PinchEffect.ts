import { AudioEffect } from '../core/AudioEffect';

/**
 * Pinch Effect (Stylus Pinch)
 * High-frequency compression/emphasis
 */
export class PinchEffect extends AudioEffect {
  private compressor: DynamicsCompressorNode;
  private highShelf: BiquadFilterNode;
  private amount = 0;

  constructor(context: AudioContext) {
    super(context);

    // High shelf for emphasis
    this.highShelf = context.createBiquadFilter();
    this.highShelf.type = 'highshelf';
    this.highShelf.frequency.value = 3000;
    this.highShelf.gain.value = 0;

    // Compressor for high-frequency compression
    this.compressor = context.createDynamicsCompressor();
    this.compressor.threshold.value = -20;
    this.compressor.knee.value = 10;
    this.compressor.ratio.value = 4;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.05;

    // Connect chain
    this.input.connect(this.highShelf);
    this.highShelf.connect(this.compressor);
    this.compressor.connect(this.output);
  }

  setParameter(name: string, value: number): void {
    if (name === 'pinch' || name === 'amount') {
      this.amount = Math.max(0, Math.min(1, value));
      this.updateEffect();
    }
  }

  private updateEffect(): void {
    // High frequency boost
    this.highShelf.gain.value = 6 * this.amount;

    // Adjust compression ratio
    this.compressor.ratio.value = 1 + (3 * this.amount);
  }

  destroy(): void {
    this.highShelf.disconnect();
    this.compressor.disconnect();
    super.destroy();
  }
}
