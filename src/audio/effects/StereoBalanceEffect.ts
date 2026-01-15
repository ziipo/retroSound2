import { AudioEffect } from '../core/AudioEffect';

/**
 * Stereo Balance Correction (SBC)
 * Optional stereo field processing
 */
export class StereoBalanceEffect extends AudioEffect {
  private enabled = false;

  constructor(context: AudioContext) {
    super(context);

    // Simple pass-through for now
    // Can be expanded with channel splitting and delay if needed
    this.input.connect(this.output);
  }

  setParameter(name: string, value: number): void {
    if (name === 'enabled' || name === 'sbc') {
      this.enabled = value > 0.5;
    }
  }

  destroy(): void {
    super.destroy();
  }
}
