import { bufferToWave, trimBuffer } from '../utils/bufferUtils';

/**
 * WAV Exporter
 * Renders audio offline with all effects applied and exports to WAV
 *
 * From Patina implementation:
 * - Uses OfflineAudioContext for faster-than-realtime rendering
 * - Adds 100ms padding (4410 samples @ 44.1kHz)
 * - Applies pitch adjustment
 * - Encodes to 16-bit WAV
 */
export class WAVExporter {
  /**
   * Export audio buffer with effects to WAV file
   * Note: This is a simplified version - full implementation would
   * recreate the entire effect chain in an offline context
   */
  async export(
    buffer: AudioBuffer,
    pitchSemitones: number = 0,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    const pitchRatio = Math.pow(2, pitchSemitones / 12);
    const sampleRate = buffer.sampleRate;

    // Calculate padded length
    const paddingSamples = Math.floor(sampleRate * 0.1); // 100ms
    const adjustedLength = Math.floor(buffer.length / pitchRatio);
    const totalLength = adjustedLength + paddingSamples;

    // Create offline context
    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      totalLength,
      sampleRate
    );

    // Create source
    const source = offlineContext.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = pitchRatio;

    // Connect to destination
    // TODO: Recreate effect chain here for proper offline rendering
    source.connect(offlineContext.destination);

    // Start source with padding offset
    source.start(paddingSamples / sampleRate);

    // Render
    if (onProgress) onProgress(0);

    const renderedBuffer = await offlineContext.startRendering();

    if (onProgress) onProgress(0.9);

    // Trim padding
    const trimmed = trimBuffer(renderedBuffer, paddingSamples);

    if (onProgress) onProgress(1);

    // Convert to WAV
    return bufferToWave(trimmed);
  }

  /**
   * Trigger download of WAV file
   */
  downloadWAV(blob: Blob, filename: string = 'retrosound-export.wav'): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
