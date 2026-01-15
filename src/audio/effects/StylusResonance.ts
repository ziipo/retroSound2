import { AudioEffect } from '../core/AudioEffect';

/**
 * Stylus Resonance Effect
 * Simulates harmonic peaks created by stylus resonance
 *
 * From Patina implementation:
 * - Primary: 17000Hz, Q=4.5
 * - Secondary: 14000Hz, Q=3.5
 * - Tertiary: 10000Hz, Q=2.5
 * All gains scaled by amount parameter
 */
export class StylusResonance extends AudioEffect {
  private primary: BiquadFilterNode;
  private secondary: BiquadFilterNode;
  private tertiary: BiquadFilterNode;
  private amount = 0;

  constructor(context: AudioContext) {
    super(context);

    // Primary resonance @ 17kHz
    this.primary = context.createBiquadFilter();
    this.primary.type = 'peaking';
    this.primary.frequency.value = 17000;
    this.primary.Q.value = 4.5;
    this.primary.gain.value = 0;

    // Secondary resonance @ 14kHz
    this.secondary = context.createBiquadFilter();
    this.secondary.type = 'peaking';
    this.secondary.frequency.value = 14000;
    this.secondary.Q.value = 3.5;
    this.secondary.gain.value = 0;

    // Tertiary resonance @ 10kHz
    this.tertiary = context.createBiquadFilter();
    this.tertiary.type = 'peaking';
    this.tertiary.frequency.value = 10000;
    this.tertiary.Q.value = 2.5;
    this.tertiary.gain.value = 0;

    // Cascade the filters
    this.input.connect(this.primary);
    this.primary.connect(this.secondary);
    this.secondary.connect(this.tertiary);
    this.tertiary.connect(this.output);
  }

  setParameter(name: string, value: number): void {
    if (name === 'stylus' || name === 'stylusResonance' || name === 'amount') {
      this.amount = Math.max(0, Math.min(1, value));
      this.updateResonance();
    }
  }

  private updateResonance(): void {
    // Scale gains proportionally to amount
    // Higher frequencies get more emphasis
    this.primary.gain.value = 12 * this.amount;   // 17kHz: strongest
    this.secondary.gain.value = 9 * this.amount;  // 14kHz: medium
    this.tertiary.gain.value = 6 * this.amount;   // 10kHz: subtle
  }

  destroy(): void {
    this.primary.disconnect();
    this.secondary.disconnect();
    this.tertiary.disconnect();
    super.destroy();
  }
}
