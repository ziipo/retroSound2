import { AudioEffect } from '../core/AudioEffect';

/**
 * Vinyl Damage Processor
 * Simulates random dropouts and surface damage
 *
 * From Patina implementation:
 * - Creates random amplitude dropouts
 * - baseDepth = 0.5 * dropoutIntensity
 * - intensityBoost = 0.3 * deterioration
 * - extremeDropout = random chance based on deterioration
 * - Interval: (0.2 + random * 0.4) seconds
 */
export class VinylDamageProcessor extends AudioEffect {
  private damageGain: GainNode;
  private dropoutIntensity = 0;
  private deterioration = 0;
  private isRunning = false;
  private intervalId: number | null = null;

  constructor(context: AudioContext) {
    super(context);

    this.damageGain = context.createGain();
    this.damageGain.gain.value = 1.0;

    // Connect through damage gain
    this.input.connect(this.damageGain);
    this.damageGain.connect(this.output);
  }

  setParameter(name: string, value: number): void {
    if (name === 'dropout') {
      this.dropoutIntensity = Math.max(0, Math.min(1, value));
    } else if (name === 'deterioration') {
      this.deterioration = Math.max(0, Math.min(1, value));
    }
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.scheduleDropouts();
  }

  stop(): void {
    this.isRunning = false;
    if (this.intervalId !== null) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    // Reset gain
    this.damageGain.gain.cancelScheduledValues(this.context.currentTime);
    this.damageGain.gain.setValueAtTime(1.0, this.context.currentTime);
  }

  private scheduleDropouts(): void {
    if (!this.isRunning) return;

    const now = this.context.currentTime;

    // Calculate dropout depth
    const baseDepth = 0.5 * this.dropoutIntensity;
    const intensityBoost = 0.3 * this.deterioration;
    const extremeDropout = Math.random() < (this.deterioration * 0.1) ? 0.4 : 0;
    const totalDepth = baseDepth + intensityBoost + extremeDropout;

    if (totalDepth > 0.01) {
      // Apply exponential dropout
      this.damageGain.gain.setValueAtTime(1.0, now);
      this.damageGain.gain.exponentialRampToValueAtTime(
        Math.max(0.001, 1 - totalDepth),
        now + 0.01
      );
      // Quick recovery
      this.damageGain.gain.exponentialRampToValueAtTime(1.0, now + 0.06);
    }

    // Schedule next dropout
    const intensityFactor = 1 - (this.dropoutIntensity * 0.5);
    const interval = (0.2 + Math.random() * 0.4) * intensityFactor;

    this.intervalId = window.setTimeout(() => {
      this.scheduleDropouts();
    }, interval * 1000);
  }

  destroy(): void {
    this.stop();
    this.damageGain.disconnect();
    super.destroy();
  }
}
