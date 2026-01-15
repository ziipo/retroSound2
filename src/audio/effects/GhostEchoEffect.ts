import { AudioEffect } from '../core/AudioEffect';

/**
 * Ghost Echo Effect
 * Simulates spatial bleed from adjacent grooves
 *
 * Multi-tap delay with filtered feedback
 * From Patina: delays at 0.05s, 0.12s, 0.23s
 */
export class GhostEchoEffect extends AudioEffect {
  private delay1: DelayNode;
  private delay2: DelayNode;
  private delay3: DelayNode;
  private gain1: GainNode;
  private gain2: GainNode;
  private gain3: GainNode;
  private dryGain: GainNode;
  private wetMix: GainNode;

  private amount = 0;

  constructor(context: AudioContext) {
    super(context);

    // Dry path
    this.dryGain = context.createGain();
    this.dryGain.gain.value = 1.0;

    // Wet mix
    this.wetMix = context.createGain();
    this.wetMix.gain.value = 0;

    // Three delay taps
    this.delay1 = context.createDelay(1.0);
    this.delay1.delayTime.value = 0.05;
    this.gain1 = context.createGain();
    this.gain1.gain.value = 0;

    this.delay2 = context.createDelay(1.0);
    this.delay2.delayTime.value = 0.12;
    this.gain2 = context.createGain();
    this.gain2.gain.value = 0;

    this.delay3 = context.createDelay(1.0);
    this.delay3.delayTime.value = 0.23;
    this.gain3 = context.createGain();
    this.gain3.gain.value = 0;

    // Connect delays
    this.input.connect(this.delay1);
    this.delay1.connect(this.gain1);
    this.gain1.connect(this.wetMix);

    this.input.connect(this.delay2);
    this.delay2.connect(this.gain2);
    this.gain2.connect(this.wetMix);

    this.input.connect(this.delay3);
    this.delay3.connect(this.gain3);
    this.gain3.connect(this.wetMix);

    // Dry path
    this.input.connect(this.dryGain);

    // Mix to output
    this.dryGain.connect(this.output);
    this.wetMix.connect(this.output);
  }

  setParameter(name: string, value: number): void {
    if (name === 'ghostEcho' || name === 'amount') {
      this.amount = Math.max(0, Math.min(1, value));
      this.updateEcho();
    }
  }

  private updateEcho(): void {
    // Set tap gains with decay
    this.gain1.gain.value = 0.3 * this.amount;
    this.gain2.gain.value = 0.2 * this.amount;
    this.gain3.gain.value = 0.15 * this.amount;

    // Wet mix
    this.wetMix.gain.value = this.amount;
  }

  destroy(): void {
    this.delay1.disconnect();
    this.delay2.disconnect();
    this.delay3.disconnect();
    this.gain1.disconnect();
    this.gain2.disconnect();
    this.gain3.disconnect();
    this.dryGain.disconnect();
    this.wetMix.disconnect();
    super.destroy();
  }
}
