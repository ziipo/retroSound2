import { AudioEffect } from '../core/AudioEffect';

/**
 * Worn Stylus Effect
 * Simulates high-frequency dulling and resonance from a worn stylus
 *
 * From Patina implementation:
 * - Pre-emphasis: peaking @ 1800Hz
 * - Low-cut: highpass @ (80Hz + intensity * 600Hz) = 80-680Hz
 * - Resonance1: peaking @ 800Hz, Q=(1.5 + intensity * 2.0) = 1.5-3.5
 * - Resonance2: peaking @ 2800Hz, Q=(2 + intensity * 1.5)
 * - Allpass1: 750Hz (modulated by LFO)
 * - Allpass2: 2500Hz (modulated by LFO)
 */
export class WornStylusEffect extends AudioEffect {
  private preEmphasis: BiquadFilterNode;
  private lowCut: BiquadFilterNode;
  private resonance1: BiquadFilterNode;
  private resonance2: BiquadFilterNode;
  private allpass1: BiquadFilterNode;
  private allpass2: BiquadFilterNode;
  private lfo: OscillatorNode;
  private lfoGain: GainNode;

  private intensity = 0;

  constructor(context: AudioContext) {
    super(context);

    // Pre-emphasis peak
    this.preEmphasis = context.createBiquadFilter();
    this.preEmphasis.type = 'peaking';
    this.preEmphasis.frequency.value = 1800;
    this.preEmphasis.Q.value = 1.0;
    this.preEmphasis.gain.value = 0;

    // Low-cut filter
    this.lowCut = context.createBiquadFilter();
    this.lowCut.type = 'highpass';
    this.lowCut.frequency.value = 80;

    // Resonance filters
    this.resonance1 = context.createBiquadFilter();
    this.resonance1.type = 'peaking';
    this.resonance1.frequency.value = 800;
    this.resonance1.Q.value = 1.5;
    this.resonance1.gain.value = 0;

    this.resonance2 = context.createBiquadFilter();
    this.resonance2.type = 'peaking';
    this.resonance2.frequency.value = 2800;
    this.resonance2.Q.value = 2.0;
    this.resonance2.gain.value = 0;

    // Allpass filters for phase modulation
    this.allpass1 = context.createBiquadFilter();
    this.allpass1.type = 'allpass';
    this.allpass1.frequency.value = 750;

    this.allpass2 = context.createBiquadFilter();
    this.allpass2.type = 'allpass';
    this.allpass2.frequency.value = 2500;

    // LFO for allpass modulation
    this.lfo = context.createOscillator();
    this.lfo.frequency.value = 0.5;
    this.lfoGain = context.createGain();
    this.lfoGain.gain.value = 0;
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.allpass1.frequency);
    this.lfoGain.connect(this.allpass2.frequency);
    this.lfo.start();

    // Connect filter chain
    this.input.connect(this.preEmphasis);
    this.preEmphasis.connect(this.lowCut);
    this.lowCut.connect(this.resonance1);
    this.resonance1.connect(this.resonance2);
    this.resonance2.connect(this.allpass1);
    this.allpass1.connect(this.allpass2);
    this.allpass2.connect(this.output);
  }

  setParameter(name: string, value: number): void {
    if (name === 'wornStylus' || name === 'intensity' || name === 'amount') {
      this.intensity = Math.max(0, Math.min(1, value));
      this.updateEffect();
    }
  }

  private updateEffect(): void {
    // Pre-emphasis increases with wear
    this.preEmphasis.gain.value = 3 * this.intensity;

    // Low-cut frequency increases (more bass loss)
    this.lowCut.frequency.value = 80 + this.intensity * 600;

    // Resonance Q factors increase
    this.resonance1.Q.value = 1.5 + this.intensity * 2.0;
    this.resonance2.Q.value = 2.0 + this.intensity * 1.5;

    // Resonance gains
    this.resonance1.gain.value = 4 * this.intensity;
    this.resonance2.gain.value = 3 * this.intensity;

    // LFO modulation depth
    this.lfoGain.gain.value = 100 * this.intensity;
  }

  destroy(): void {
    this.lfo.stop();
    this.lfo.disconnect();
    this.lfoGain.disconnect();
    this.preEmphasis.disconnect();
    this.lowCut.disconnect();
    this.resonance1.disconnect();
    this.resonance2.disconnect();
    this.allpass1.disconnect();
    this.allpass2.disconnect();
    super.destroy();
  }
}
