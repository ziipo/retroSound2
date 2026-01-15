import { AudioEffect } from '../core/AudioEffect';

/**
 * Inner Groove Distortion
 * Simulates tracking error distortion from inner grooves
 * Multiband compression with harmonic distortion
 */
export class InnerGrooveDistortion extends AudioEffect {
  private compressor: DynamicsCompressorNode;
  private waveshaper: WaveShaperNode;
  private wetGain: GainNode;
  private dryGain: GainNode;
  private amount = 0;

  constructor(context: AudioContext) {
    super(context);

    // Compressor for multiband-like effect
    this.compressor = context.createDynamicsCompressor();
    this.compressor.threshold.value = -30;
    this.compressor.knee.value = 15;
    this.compressor.ratio.value = 6;
    this.compressor.attack.value = 0.001;
    this.compressor.release.value = 0.1;

    // Waveshaper for harmonic distortion
    this.waveshaper = context.createWaveShaper();
    this.waveshaper.curve = this.createDistortionCurve(0) as Float32Array;
    this.waveshaper.oversample = '2x';

    // Wet/dry mix
    this.wetGain = context.createGain();
    this.wetGain.gain.value = 0;

    this.dryGain = context.createGain();
    this.dryGain.gain.value = 1;

    // Connect chain
    this.input.connect(this.compressor);
    this.compressor.connect(this.waveshaper);
    this.waveshaper.connect(this.wetGain);
    this.wetGain.connect(this.output);

    this.input.connect(this.dryGain);
    this.dryGain.connect(this.output);
  }

  setParameter(name: string, value: number): void {
    if (name === 'innerGroove' || name === 'amount') {
      this.amount = Math.max(0, Math.min(1, value));
      this.updateEffect();
    }
  }

  private updateEffect(): void {
    // Update distortion curve
    this.waveshaper.curve = this.createDistortionCurve(this.amount * 50) as Float32Array;

    // Wet/dry mix
    this.wetGain.gain.value = this.amount;
    this.dryGain.gain.value = 1 - (this.amount * 0.5);

    // Adjust compression
    this.compressor.ratio.value = 1 + (5 * this.amount);
  }

  private createDistortionCurve(amount: number): Float32Array | null {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }

    return curve;
  }

  destroy(): void {
    this.compressor.disconnect();
    this.waveshaper.disconnect();
    this.wetGain.disconnect();
    this.dryGain.disconnect();
    super.destroy();
  }
}
