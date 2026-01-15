import { AudioEffect } from '../core/AudioEffect';

/**
 * Spindle Eccentricity Effect (Vinyl Warp)
 * Simulates pitch wobble from off-center records
 *
 * From Patina implementation:
 * - Three LFO oscillators modulating playback rate
 * - LFO1: 0.3Hz, gain = 0.02 * intensity
 * - LFO2: 2.5Hz, gain = 0.01 * intensity
 * - LFO3: 8Hz, gain = 0.005 * intensity
 *
 * Note: This effect needs to be applied to the playback rate,
 * so it's implemented differently - will be handled in AudioEngine
 */
export class SpindleEccentricity extends AudioEffect {
  private lfo1: OscillatorNode;
  private lfo2: OscillatorNode;
  private lfo3: OscillatorNode;
  private lfo1Gain: GainNode;
  private lfo2Gain: GainNode;
  private lfo3Gain: GainNode;
  private merger: GainNode;

  private intensity = 0;

  // This will be connected to the playback rate of the source
  public modulationOutput: GainNode;

  constructor(context: AudioContext) {
    super(context);

    // LFO 1: 0.3Hz (slow wobble)
    this.lfo1 = context.createOscillator();
    this.lfo1.frequency.value = 0.3;
    this.lfo1Gain = context.createGain();
    this.lfo1Gain.gain.value = 0;

    // LFO 2: 2.5Hz (medium wobble)
    this.lfo2 = context.createOscillator();
    this.lfo2.frequency.value = 2.5;
    this.lfo2Gain = context.createGain();
    this.lfo2Gain.gain.value = 0;

    // LFO 3: 8Hz (fast flutter)
    this.lfo3 = context.createOscillator();
    this.lfo3.frequency.value = 8;
    this.lfo3Gain = context.createGain();
    this.lfo3Gain.gain.value = 0;

    // Merger for combining LFO outputs
    this.merger = context.createGain();
    this.modulationOutput = context.createGain();

    this.lfo1.connect(this.lfo1Gain);
    this.lfo2.connect(this.lfo2Gain);
    this.lfo3.connect(this.lfo3Gain);

    this.lfo1Gain.connect(this.merger);
    this.lfo2Gain.connect(this.merger);
    this.lfo3Gain.connect(this.merger);

    this.merger.connect(this.modulationOutput);

    this.lfo1.start();
    this.lfo2.start();
    this.lfo3.start();

    // For audio chain, pass through
    this.input.connect(this.output);
  }

  setParameter(name: string, value: number): void {
    if (name === 'spindle' || name === 'warp' || name === 'intensity') {
      this.intensity = Math.max(0, Math.min(1, value));
      this.updateModulation();
    }
  }

  private updateModulation(): void {
    const scaledIntensity = this.intensity;

    // Set LFO gains according to Patina spec
    this.lfo1Gain.gain.value = 0.02 * scaledIntensity;
    this.lfo2Gain.gain.value = 0.01 * scaledIntensity;
    this.lfo3Gain.gain.value = 0.005 * scaledIntensity;
  }

  destroy(): void {
    this.lfo1.stop();
    this.lfo2.stop();
    this.lfo3.stop();
    this.lfo1.disconnect();
    this.lfo2.disconnect();
    this.lfo3.disconnect();
    this.lfo1Gain.disconnect();
    this.lfo2Gain.disconnect();
    this.lfo3Gain.disconnect();
    this.merger.disconnect();
    this.modulationOutput.disconnect();
    super.destroy();
  }
}
