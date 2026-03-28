import type { VoiceEffect } from '../types';

/**
 * Audio effect processor using Web Audio API (OfflineAudioContext).
 * Works in React Native's web runtime and Expo Web.
 *
 * For native iOS/Android, this would need a Native Module (e.g., ScratchMyVoice's JUCE engine).
 */

/** Audio buffer wrapper for effect processing */
export interface AudioBufferInfo {
  sampleRate: number;
  numberOfChannels: number;
  duration: number; // seconds
  data: number[][]; // per-channel samples (plain arrays for TS 5.9 compat)
}

/** Effect parameters for the audio processor */
export interface EffectParams {
  pitchShift: number; // semitones (-12 to +12)
  formantShift: number; // ratio (0.5 to 2.0)
  speedChange: number; // ratio (0.5 to 2.0)
  reverbMix: number; // 0.0 to 1.0
  echoDelay?: number; // ms
  echoDecay?: number; // 0.0 to 1.0
  reverse?: boolean;
}

/** Result of effect processing */
export interface EffectResult {
  audioBuffer: AudioBufferInfo;
  duration: number;
}

/**
 * Apply pitch shift to audio samples using granular synthesis (WSOLA-like).
 * Simple implementation for mobile — production should use JUCE or RubberBand.
 */
function applyPitchShift(
  samples: number[],
  semitones: number,
  _sampleRate: number,
): number[] {
  if (semitones === 0) return samples;

  const ratio = Math.pow(2, semitones / 12);
  const grainSize = 2048;
  const hopSize = grainSize - 512;

  const inputLength = samples.length;
  const outputLength = Math.round(inputLength / ratio);
  const output: number[] = new Array(outputLength).fill(0);

  for (let i = 0; i < outputLength; i++) {
    const inputPos = i * ratio;
    const grainCenter = Math.floor(inputPos);

    if (grainCenter < 0 || grainCenter >= inputLength) continue;

    const grainStart = grainCenter - grainCenter % hopSize;
    let sum = 0;
    let weight = 0;

    for (let g = 0; g < grainSize; g++) {
      const inputIdx = grainStart + g;
      if (inputIdx < 0 || inputIdx >= inputLength) continue;

      const windowVal =
        0.5 * (1 - Math.cos((2 * Math.PI * g) / grainSize));
      sum += samples[inputIdx] * windowVal;
      weight += windowVal;
    }

    output[i] = weight > 0 ? sum / weight : 0;
  }

  return output;
}

/**
 * Apply formant shift by filtering frequency bands.
 * Approximate implementation — real formant shifting needs LPC analysis.
 */
function applyFormantShift(
  samples: number[],
  shift: number,
  sampleRate: number,
): number[] {
  if (Math.abs(shift - 1.0) < 0.01) return samples;

  const output: number[] = new Array(samples.length).fill(0);
  const formants = [500, 1500, 2500, 3500];
  const bandwidths = [80, 150, 200, 250];

  for (let i = 0; i < samples.length; i++) {
    let filtered = 0;
    for (let f = 0; f < formants.length; f++) {
      const freq = formants[f] * shift;
      const bw = bandwidths[f];
      const omega = (2 * Math.PI * freq) / sampleRate;
      const alpha = Math.sin(omega) * 0.5;
      const weight = alpha > 0 ? Math.min(1 / (alpha + 0.01), 10) : 1;
      filtered += samples[i] * weight / formants.length;
    }
    output[i] = filtered;
  }

  return output;
}

/**
 * Apply echo/delay effect.
 */
function applyEcho(
  samples: number[],
  delayMs: number,
  decay: number,
  sampleRate: number,
): number[] {
  if (delayMs <= 0 || decay <= 0) return samples;

  const delaySamples = Math.round((delayMs / 1000) * sampleRate);
  const output: number[] = new Array(samples.length).fill(0);

  for (let i = 0; i < samples.length; i++) {
    output[i] = samples[i];
    if (i >= delaySamples) {
      output[i] += samples[i - delaySamples] * decay;
    }
  }

  return output;
}

/**
 * Reverse audio samples.
 */
function applyReverse(samples: number[]): number[] {
  return samples.slice().reverse();
}

/**
 * Apply all effects to an AudioBufferInfo.
 */
export function applyEffects(
  buffer: AudioBufferInfo,
  params: EffectParams,
): EffectResult {
  const processedChannels: number[][] = [];

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    let samples = [...buffer.data[ch]];

    // Apply speed change (resample)
    if (params.speedChange !== 1.0) {
      const newLength = Math.round(samples.length / params.speedChange);
      const resampled: number[] = new Array(newLength).fill(0);
      for (let i = 0; i < newLength; i++) {
        const srcIdx = i * params.speedChange;
        const idx0 = Math.floor(srcIdx);
        const idx1 = Math.min(idx0 + 1, samples.length - 1);
        const frac = srcIdx - idx0;
        resampled[i] = samples[idx0] * (1 - frac) + samples[idx1] * frac;
      }
      samples = resampled;
    }

    // Apply echo before pitch/formant
    if (params.echoDelay && params.echoDelay > 0 && params.echoDecay) {
      samples = applyEcho(samples, params.echoDelay, params.echoDecay, buffer.sampleRate);
    }

    // Apply reverse if needed
    if (params.reverse) {
      samples = applyReverse(samples);
    }

    // Apply pitch shift
    if (params.pitchShift !== 0) {
      samples = applyPitchShift(samples, params.pitchShift, buffer.sampleRate);
    }

    // Apply formant shift
    if (Math.abs(params.formantShift - 1.0) > 0.01) {
      samples = applyFormantShift(samples, params.formantShift, buffer.sampleRate);
    }

    // Mix reverb (simple wet/dry)
    if (params.reverbMix > 0) {
      const wet = [...samples];
      for (const delayMs of [23, 37, 53]) {
        const delaySamples = Math.round((delayMs / 1000) * buffer.sampleRate);
        for (let i = delaySamples; i < wet.length; i++) {
          wet[i] += wet[i - delaySamples] * 0.3;
        }
      }
      const maxAbs = wet.reduce((max, v) => Math.max(max, Math.abs(v)), 0);
      if (maxAbs > 0) {
        for (let i = 0; i < wet.length; i++) {
          wet[i] /= maxAbs;
        }
      }
      for (let i = 0; i < samples.length; i++) {
        samples[i] = samples[i] * (1 - params.reverbMix) + (wet[i] ?? 0) * params.reverbMix;
      }
    }

    processedChannels.push(samples);
  }

  const newDuration = processedChannels[0].length / buffer.sampleRate;

  return {
    audioBuffer: {
      sampleRate: buffer.sampleRate,
      numberOfChannels: buffer.numberOfChannels,
      duration: newDuration,
      data: processedChannels,
    },
    duration: newDuration,
  };
}

/**
 * Convert an AudioBuffer (from expo-av / Web Audio API) to AudioBufferInfo format.
 */
export function audioBufferToInfo(audioBuffer: AudioBuffer): AudioBufferInfo {
  const channels: number[][] = [];
  for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
    const channelData = audioBuffer.getChannelData(ch);
    channels.push(Array.from(channelData));
  }
  return {
    sampleRate: audioBuffer.sampleRate,
    numberOfChannels: audioBuffer.numberOfChannels,
    duration: audioBuffer.duration,
    data: channels,
  };
}
