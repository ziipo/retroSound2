import { AudioEffect } from '../core/AudioEffect';

/**
 * Age Filter Effect
 * Simulates high-frequency deterioration of aged vinyl records
 *
 * From Patina implementation:
 * - Frequency range: 200-8000Hz (clamped)
 * - High shelf rolloff: -24dB * ageRatio
 * - Low shelf boost: -8dB * ageRatio^1.2
 * - LFO modulation: 0.13Hz and 0.27Hz oscillators
 */
export class AgeFilter extends AudioEffect {
  private highShelf: BiquadFilterNode;
  private lowShelf: BiquadFilterNode;
  private lfo1: OscillatorNode;
  private lfo2: OscillatorNode;
  private lfo1Gain: GainNode;
  private lfo2Gain: GainNode;

  private ageFrequency = 8000; // Hz (200-8000)

  constructor(context: AudioContext) {
    super(context);

    // High shelf for high-frequency rolloff
    this.highShelf = context.createBiquadFilter();
    this.highShelf.type = 'highshelf';
    this.highShelf.frequency.value = 4000;
    this.highShelf.gain.value = 0;

    // Low shelf for presence adjustment
    this.lowShelf = context.createBiquadFilter();
    this.lowShelf.type = 'lowshelf';
    this.lowShelf.frequency.value = 500;
    this.lowShelf.gain.value = 0;

    // LFO 1: 0.13Hz modulation
    this.lfo1 = context.createOscillator();
    this.lfo1.frequency.value = 0.13;
    this.lfo1Gain = context.createGain();
    this.lfo1Gain.gain.value = 0; // Will be set based on age
    this.lfo1.connect(this.lfo1Gain);
    this.lfo1.start();

    // LFO 2: 0.27Hz modulation
    this.lfo2 = context.createOscillator();
    this.lfo2.frequency.value = 0.27;
    this.lfo2Gain = context.createGain();
    this.lfo2Gain.gain.value = 0;
    this.lfo2.connect(this.lfo2Gain);
    this.lfo2.start();

    // Connect LFOs to modulate filter frequencies
    this.lfo1Gain.connect(this.highShelf.frequency);
    this.lfo2Gain.connect(this.highShelf.frequency);

    // Connect filter chain
    this.input.connect(this.lowShelf);
    this.lowShelf.connect(this.highShelf);
    this.highShelf.connect(this.output);
  }

  setParameter(name: string, value: number): void {
    if (name === 'age' || name === 'ageFilter') {
      // Clamp frequency to 200-8000Hz range
      this.ageFrequency = Math.max(200, Math.min(8000, value));
      this.updateFilters();
    }
  }

  private updateFilters(): void {
    // Calculate age ratio (0 = 200Hz, 1 = 8000Hz)
    const ageRatio = (this.ageFrequency - 200) / (8000 - 200);

    // High shelf rolloff: -24dB at maximum age
    this.highShelf.frequency.value = this.ageFrequency;
    this.highShelf.gain.value = -24 * ageRatio;

    // Low shelf boost: -8dB * ageRatio^1.2
    this.lowShelf.gain.value = -8 * Math.pow(ageRatio, 1.2);

    // LFO modulation depth (±5% for LFO1, ±3% for LFO2)
    const baseFreq = this.ageFrequency;
    this.lfo1Gain.gain.value = baseFreq * 0.05 * ageRatio;
    this.lfo2Gain.gain.value = baseFreq * 0.03 * ageRatio;
  }

  destroy(): void {
    this.lfo1.stop();
    this.lfo2.stop();
    this.lfo1.disconnect();
    this.lfo2.disconnect();
    this.lfo1Gain.disconnect();
    this.lfo2Gain.disconnect();
    this.highShelf.disconnect();
    this.lowShelf.disconnect();
    super.destroy();
  }
}
