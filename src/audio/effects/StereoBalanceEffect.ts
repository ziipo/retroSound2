import { AudioEffect } from '../core/AudioEffect';

/**
 * Stereo Balance Correction (SBC)
 * Optional stereo field processing
 */
export class StereoBalanceEffect extends AudioEffect {
  constructor(context: AudioContext) {
    super(context);

    // Simple pass-through for now
    // Can be expanded with channel splitting and delay if needed
    this.input.connect(this.output);
  }

  setParameter(_name: string, _value: number): void {
    // Simple pass-through for now
    // Can be expanded with channel splitting and delay if needed
  }

  destroy(): void {
    super.destroy();
  }
}
