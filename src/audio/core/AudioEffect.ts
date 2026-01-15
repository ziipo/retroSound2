// Base class for all audio effects
// Follows the pattern from Patina: input → processing → output
export abstract class AudioEffect {
  protected context: AudioContext;
  public input: GainNode;
  public output: GainNode;

  constructor(context: AudioContext) {
    this.context = context;
    this.input = context.createGain();
    this.output = context.createGain();
  }

  /**
   * Update an effect parameter
   * @param name - Parameter name
   * @param value - Parameter value (typically 0-1 or specific range)
   */
  abstract setParameter(name: string, value: number): void;

  /**
   * Connect this effect to a destination node
   */
  connect(destination: AudioNode): void {
    this.output.connect(destination);
  }

  /**
   * Disconnect this effect from all destinations
   */
  disconnect(): void {
    this.output.disconnect();
  }

  /**
   * Cleanup resources when effect is destroyed
   */
  destroy(): void {
    this.input.disconnect();
    this.output.disconnect();
  }
}
