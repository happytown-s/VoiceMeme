import type { VoiceConfig, ScriptSegment } from '../types';

/** Available voice preset */
export interface VoicePreset {
  id: string;
  name: string;
  locale: string;
  gender: 'Male' | 'Female';
  description: string;
}

/** TTS generation result */
export interface TTSResult {
  uri: string; // local file URI
  duration: number; // seconds
  format: 'mp3' | 'wav';
}

/** Segment-level TTS result with timing */
export interface TTSSegmentResult {
  segmentId: string;
  uri: string;
  duration: number;
  startTime: number;
  text: string;
}

/** Full TTS session result (all segments concatenated) */
export interface TTSFullResult {
  uri: string;
  duration: number;
  segments: TTSSegmentResult[];
}

/**
 * Get the configured TTS API endpoint.
 * In production, this points to a local proxy or serverless function.
 */
function getTTSEndpoint(): string {
  return 'http://192.168.0.4:5210/tts'; // Edge TTS proxy on Mac
}

/**
 * Synthesize text to speech via Edge TTS proxy.
 */
export async function synthesize(
  text: string,
  config: VoiceConfig,
): Promise<TTSResult> {
  const response = await fetch(getTTSEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      voice: config.voiceId,
      pitch: config.pitch,
      rate: config.speed,
      volume: config.volume,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`TTS API error ${response.status}: ${errorText}`);
  }

  // Response contains the audio file as binary
  const blob = await response.blob();
  const uri = URL.createObjectURL(blob);

  return {
    uri,
    duration: 0, // Will be calculated by audio player
    format: 'mp3',
  };
}

/**
 * Synthesize multiple script segments with timing information.
 * Each segment is synthesized individually, then concatenated timing is calculated.
 */
export async function synthesizeSegments(
  segments: ScriptSegment[],
  config: VoiceConfig,
  options?: {
    onSegmentComplete?: (index: number, result: TTSSegmentResult) => void;
    signal?: AbortSignal;
  },
): Promise<TTSFullResult> {
  const results: TTSSegmentResult[] = [];
  let currentTime = 0;

  for (let i = 0; i < segments.length; i++) {
    if (options?.signal?.aborted) {
      throw new Error('TTS synthesis aborted');
    }

    const segment = segments[i];
    const result = await synthesize(segment.text, config);

    // Estimate duration from text length (rough: ~0.1s per char for Japanese at 1.0x speed)
    const estimatedDuration =
      (segment.text.length * 0.1) / config.speed;

    const segmentResult: TTSSegmentResult = {
      segmentId: segment.id,
      uri: result.uri,
      duration: estimatedDuration,
      startTime: currentTime,
      text: segment.text,
    };

    results.push(segmentResult);
    currentTime += estimatedDuration;

    options?.onSegmentComplete?.(i, segmentResult);
  }

  return {
    uri: results[0]?.uri ?? '', // First segment as representative
    duration: currentTime,
    segments: results,
  };
}

/**
 * Synthesize full script text as a single audio file.
 * Uses the combined text with pauses between segments.
 */
export async function synthesizeFull(
  text: string,
  config: VoiceConfig,
): Promise<TTSResult> {
  return synthesize(text, config);
}
