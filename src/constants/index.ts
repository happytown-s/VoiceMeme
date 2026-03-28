export const APP_NAME = 'VoiceMeme';
export const APP_VERSION = '0.1.0';

/** Max script length in characters */
export const MAX_SCRIPT_LENGTH = 500;

/** Default voice configuration */
export const DEFAULT_VOICE = {
  voiceId: 'ja-JP-NanamiNeural',
  pitch: 1.0,
  speed: 1.0,
  volume: 1.0,
} as const;

/** Default LRC line duration in seconds */
export const DEFAULT_LRC_LINE_DURATION = 3;

/** Supported audio formats */
export const SUPPORTED_AUDIO_FORMATS = ['mp3', 'wav', 'm4a'] as const;
export type AudioFormat = (typeof SUPPORTED_AUDIO_FORMATS)[number];

/** Screen names for navigation reference */
export const SCREENS = {
  HOME: '/',
  CREATE: '/create',
  LIBRARY: '/library',
  SETTINGS: '/settings',
  EDITOR: '/editor',
} as const;
