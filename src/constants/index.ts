export const APP_NAME: string = 'VoiceMeme';
export const APP_VERSION: string = '0.1.0';

export const API_CONFIG = {
  baseUrl: 'https://api.z.ai/v1',
  model: 'glm-5-turbo',
} as const;

/** Available script styles with display names */
export const SCRIPT_STYLES = [
  { id: 'funny' as const, label: '面白い', emoji: '😂', description: 'ツッコミ・オチあり' },
  { id: 'dramatic' as const, label: 'ドラマチック', emoji: '🎭', description: '臨場感たっぷり' },
  { id: 'cute' as const, label: '可愛い', emoji: '🥰', description: 'キャラクター風' },
  { id: 'scary' as const, label: '怖い', emoji: '👻', description: 'ホラー語り' },
  { id: 'news' as const, label: 'ニュース風', emoji: '📺', description: '嘘ニュース真顔読み' },
] as const;

/** Preset topics for quick selection */
export const PRESET_TOPICS = [
  '朝の挨拶',
  '自己紹介',
  '名言風',
  'ラジオDJ',
  '映画予告',
  'CM風',
  'ASMR風',
  '占い結果',
] as const;
