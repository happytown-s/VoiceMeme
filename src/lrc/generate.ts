import type { ScriptSegment } from '../types';
import type { TTSSegmentResult } from '../tts';
import { DEFAULT_LRC_LINE_DURATION } from '../constants';

/** Single LRC timestamped line */
export interface LRCLine {
  timestamp: number; // seconds
  text: string;
}

/** Word-level timestamp for karaoke-style highlighting */
export interface WordTimestamp {
  word: string;
  startTime: number; // seconds
  endTime: number; // seconds
}

/** Full LRC file content */
export interface LRCFile {
  metadata: LRCMetadata;
  lines: LRCLine[];
  wordTimestamps?: WordTimestamp[][];
}

/** LRC file metadata header */
export interface LRCMetadata {
  title?: string;
  artist?: string;
  album?: string;
  by?: string; // creator tool
  offset?: number; // ms offset
}

/** Format seconds to LRC timestamp [mm:ss.xx] */
export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const wholeSecs = Math.floor(secs);
  const centis = Math.round((secs - wholeSecs) * 100);
  return `[${String(mins).padStart(2, '0')}:${String(wholeSecs).padStart(2, '0')}.${String(centis).padStart(2, '0')}]`;
}

/**
 * Generate LRC lines from TTS segment results.
 * Uses the timing from TTSSegmentResult.
 */
export function generateLRCFromSegments(
  segments: TTSSegmentResult[],
): LRCLine[] {
  return segments.map((seg) => ({
    timestamp: seg.startTime,
    text: seg.text,
  }));
}

/**
 * Generate LRC lines from plain script segments with estimated timing.
 * Falls back when TTS timing data is not available.
 */
export function generateLRCEstimated(
  segments: ScriptSegment[],
  averageCharDuration?: number,
): LRCLine[] {
  const charDuration =
    averageCharDuration ?? DEFAULT_LRC_LINE_DURATION / 15; // ~0.2s per char

  const lines: LRCLine[] = [];
  let currentTime = 0;

  for (const segment of segments) {
    lines.push({
      timestamp: currentTime,
      text: segment.text,
    });

    // Estimate duration from character count
    const charCount = segment.text.replace(/\s/g, '').length;
    currentTime += charCount * charDuration + 0.3; // 0.3s pause between lines
  }

  return lines;
}

/**
 * Generate word-level timestamps from segment text.
 * Splits by punctuation and distributes time evenly.
 */
export function generateWordTimestamps(
  segment: ScriptSegment,
  startTime: number,
  endTime: number,
): WordTimestamp[] {
  // Split Japanese text into word-like chunks
  // For Japanese: split by punctuation, particles, and spaces
  const words = segment.text
    .replace(/([、。！？…「」『』（）\[\]]|[,.\-!?])/g, ' $1 ')
    .split(/\s+/)
    .filter((w) => w.length > 0);

  if (words.length === 0) return [];

  const totalDuration = endTime - startTime;
  const avgWordDuration = totalDuration / words.length;

  return words.map((word, i) => ({
    word,
    startTime: startTime + i * avgWordDuration,
    endTime: startTime + (i + 1) * avgWordDuration,
  }));
}

/**
 * Serialize LRCFile to standard LRC format string.
 */
export function serializeLRC(lrc: LRCFile): string {
  const lines: string[] = [];

  // Metadata
  if (lrc.metadata.title) lines.push(`[ti:${lrc.metadata.title}]`);
  if (lrc.metadata.artist) lines.push(`[ar:${lrc.metadata.artist}]`);
  if (lrc.metadata.album) lines.push(`[al:${lrc.metadata.album}]`);
  if (lrc.metadata.by) lines.push(`[by:${lrc.metadata.by}]`);
  if (lrc.metadata.offset !== undefined) {
    lines.push(`[offset:${lrc.metadata.offset}]`);
  }

  // Timestamped lines
  for (const line of lrc.lines) {
    lines.push(`${formatTimestamp(line.timestamp)}${line.text}`);
  }

  // Word-level timestamps (Extended LRC format)
  if (lrc.wordTimestamps) {
    lines.push('');
    for (let i = 0; i < lrc.wordTimestamps.length; i++) {
      const line = lrc.lines[i];
      if (!line) continue;

      const words = lrc.wordTimestamps[i];
      if (!words) continue;

      const wordParts = words
        .map((w) => `<${formatTimestamp(w.startTime)}${w.word}<${formatTimestamp(w.endTime)}`)
        .join('');

      lines.push(`${formatTimestamp(line.timestamp)}${wordParts}`);
    }
  }

  return lines.join('\n');
}

/**
 * Parse an LRC format string into LRCFile.
 */
export function parseLRC(lrcText: string): LRCFile {
  const metadata: LRCMetadata = {};
  const lines: LRCLine[] = [];

  for (const rawLine of lrcText.split('\n')) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Metadata tags
    const metaMatch = trimmed.match(/^\[([a-z]+):(.+)\]$/i);
    if (metaMatch) {
      const key = metaMatch[1].toLowerCase();
      const value = metaMatch[2].trim();
      switch (key) {
        case 'ti': metadata.title = value; break;
        case 'ar': metadata.artist = value; break;
        case 'al': metadata.album = value; break;
        case 'by': metadata.by = value; break;
        case 'offset': metadata.offset = parseInt(value, 10); break;
      }
      continue;
    }

    // Timestamped line: [mm:ss.xx]text
    const tsMatch = trimmed.match(/^\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)$/);
    if (tsMatch) {
      const mins = parseInt(tsMatch[1], 10);
      const secs = parseInt(tsMatch[2], 10);
      const cs = tsMatch[3].length === 2
        ? parseInt(tsMatch[3], 10)
        : parseInt(tsMatch[3].slice(0, 2), 10);
      const timestamp = mins * 60 + secs + cs / 100;

      lines.push({
        timestamp,
        text: tsMatch[4].trim(),
      });
    }
  }

  return { metadata, lines };
}

/**
 * Create a complete LRCFile from segments with word-level timestamps.
 */
export function createLRCFile(
  segments: TTSSegmentResult[],
  options?: {
    title?: string;
    includeWordTimestamps?: boolean;
  },
): LRCFile {
  const lines = generateLRCFromSegments(segments);

  const lrc: LRCFile = {
    metadata: {
      title: options?.title,
      by: 'VoiceMeme',
    },
    lines,
  };

  if (options?.includeWordTimestamps) {
    lrc.wordTimestamps = segments.map((seg, i) => {
      const endTime = i < segments.length - 1
        ? segments[i + 1].startTime
        : seg.startTime + seg.duration;
      return generateWordTimestamps(
        { id: seg.segmentId, text: seg.text },
        seg.startTime,
        endTime,
      );
    });
  }

  return lrc;
}
