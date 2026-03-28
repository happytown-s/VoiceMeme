import type { VoicePreset } from './synthesize';

/**
 * Available Japanese voice presets for Edge TTS.
 */
export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'ja-JP-NanamiNeural',
    name: '七海',
    locale: 'ja-JP',
    gender: 'Female',
    description: '明るく親しみやすい女性',
  },
  {
    id: 'ja-JP-KeitaNeural',
    name: '圭太',
    locale: 'ja-JP',
    gender: 'Male',
    description: '落ち着いた若手男性',
  },
  {
    id: 'ja-JP-AoiNeural',
    name: '葵',
    locale: 'ja-JP',
    gender: 'Female',
    description: '元気で活発な女性',
  },
  {
    id: 'ja-JP-DaichiNeural',
    name: '大地',
    locale: 'ja-JP',
    gender: 'Male',
    description: '誠実で温厚な男性',
  },
  {
    id: 'ja-JP-MayuNeural',
    name: 'まゆ',
    locale: 'ja-JP',
    gender: 'Female',
    description: '優しく丁寧な女性',
  },
  {
    id: 'ja-JP-ShioriNeural',
    name: '栞',
    locale: 'ja-JP',
    gender: 'Female',
    description: '知的で落ち着いた女性',
  },
  {
    id: 'ja-JP-SoraNeural',
    name: '空',
    locale: 'ja-JP',
    gender: 'Male',
    description: '爽やかな若手男性',
  },
  {
    id: 'ja-JP-NaokiNeural',
    name: '直樹',
    locale: 'ja-JP',
    gender: 'Male',
    description: '力強く迫力のある男性',
  },
];

/**
 * Available English voice presets.
 */
export const EN_VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'en-US-JennyNeural',
    name: 'Jenny',
    locale: 'en-US',
    gender: 'Female',
    description: 'Natural conversational female',
  },
  {
    id: 'en-US-GuyNeural',
    name: 'Guy',
    locale: 'en-US',
    gender: 'Male',
    description: 'Deep confident male',
  },
];

/** Get all presets (JP + EN) */
export function getAllVoicePresets(): VoicePreset[] {
  return [...VOICE_PRESETS, ...EN_VOICE_PRESETS];
}

/** Find a preset by ID */
export function findVoicePreset(id: string): VoicePreset | undefined {
  return getAllVoicePresets().find((p) => p.id === id);
}
