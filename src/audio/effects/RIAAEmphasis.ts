import { AudioEffect } from '../core/AudioEffect';

/**
 * RIAA De-emphasis Filter
 * Implements the exact RIAA equalization curve used in vinyl mastering
 *
 * Exact frequencies from Patina:
 * - Low shelf @ 50.05Hz: +17dB (bass reduction)
 * - Peaking @ 500.5Hz: -8.5dB (presence dip)
 * - High shelf @ 2122Hz: -13.7dB (treble boost)
 */
export class RIAAEmphasis extends AudioEffect {
  private lowShelf: BiquadFilterNode;
  private midPeak: BiquadFilterNode;
  private highShelf: BiquadFilterNode;
  private amount = 0;

  constructor(context: AudioContext) {
    super(context);

    // Low shelf filter @ 50.05Hz
    this.lowShelf = context.createBiquadFilter();
    this.lowShelf.type = 'lowshelf';
    this.lowShelf.frequency.value = 50.05;
    this.lowShelf.gain.value = 0;

    // Mid peaking filter @ 500.5Hz
    this.midPeak = context.createBiquadFilter();
    this.midPeak.type = 'peaking';
    this.midPeak.frequency.value = 500.5;
    this.midPeak.Q.value = 0.7;
    this.midPeak.gain.value = 0;

    // High shelf filter @ 2122Hz
    this.highShelf = context.createBiquadFilter();
    this.highShelf.type = 'highshelf';
    this.highShelf.frequency.value = 2122;
    this.highShelf.gain.value = 0;

    // Connect the filter chain
    this.input.connect(this.lowShelf);
    this.lowShelf.connect(this.midPeak);
    this.midPeak.connect(this.highShelf);
    this.highShelf.connect(this.output);
  }

  setParameter(name: string, value: number): void {
    if (name === 'riaa' || name === 'amount') {
      this.amount = Math.max(0, Math.min(1, value));
      this.updateFilters();
    }
  }

  private updateFilters(): void {
    // Apply RIAA curve scaling based on amount
    this.lowShelf.gain.value = 17 * this.amount;
    this.midPeak.gain.value = -8.5 * this.amount;
    this.highShelf.gain.value = -13.7 * this.amount;
  }

  destroy(): void {
    this.lowShelf.disconnect();
    this.midPeak.disconnect();
    this.highShelf.disconnect();
    super.destroy();
  }
}
