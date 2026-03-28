import type { VoiceEffect } from '../types';

/**
 * Effect preset definitions.
 * pitchShift: semitones (-12 to +12)
 * formantShift: ratio (0.5 to 2.0, 1.0 = normal)
 * speedChange: ratio (0.5 to 2.0, 1.0 = normal)
 * reverbMix: 0.0 to 1.0
 * echoDelay: ms
 * echoDecay: 0.0 to 1.0
 * reverse: boolean
 */
export const EFFECT_PRESETS: VoiceEffect[] = [
  {
    id: 'robot',
    name: '🤖 ロボット風',
    pitchShift: 4,
    formantShift: 0.7,
    reverbMix: 0.3,
  },
  {
    id: 'radio',
    name: '📻 ラジオ風',
    pitchShift: 2,
    formantShift: 1.1,
    reverbMix: 0.1,
    echoDelay: 30,
    echoDecay: 0.2,
  },
  {
    id: 'hyper',
    name: '⚡ ハイテンション',
    pitchShift: 3,
    formantShift: 1.2,
    reverbMix: 0.2,
  },
  {
    id: 'deep',
    name: '🔊 ディープボイス',
    pitchShift: -6,
    formantShift: 0.8,
    reverbMix: 0.4,
    echoDelay: 80,
    echoDecay: 0.3,
  },
  {
    id: 'reverse',
    name: '⏪ リバース',
    pitchShift: 0,
    formantShift: 1.0,
    reverbMix: 0.2,
  },
  {
    id: 'helium',
    name: '🎈 ヘリウム風',
    pitchShift: 8,
    formantShift: 1.5,
    reverbMix: 0.15,
  },
  {
    id: 'demon',
    name: '👹 デーモン',
    pitchShift: -8,
    formantShift: 0.6,
    reverbMix: 0.6,
    echoDelay: 120,
    echoDecay: 0.4,
  },
  {
    id: 'telephone',
    name: '📞 電話風',
    pitchShift: 1,
    formantShift: 0.9,
    reverbMix: 0.05,
    echoDelay: 15,
    echoDecay: 0.1,
  },
];

/** Get an effect preset by ID */
export function getEffectPreset(id: string): VoiceEffect | undefined {
  return EFFECT_PRESETS.find((p) => p.id === id);
}
