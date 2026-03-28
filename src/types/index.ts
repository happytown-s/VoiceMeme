/** AI script generation request */
export interface ScriptRequest {
  topic: string;
  style: 'funny' | 'dramatic' | 'cute' | 'scary' | 'news';
  maxLength: number;
  language: 'ja' | 'en';
}

/** AI script generation response */
export interface ScriptResponse {
  id: string;
  text: string;
  segments: ScriptSegment[];
  createdAt: number;
}

/** A timed segment of the script */
export interface ScriptSegment {
  id: string;
  text: string;
  startTime?: number;
  endTime?: number;
  emotion?: string;
}

/** TTS voice configuration */
export interface VoiceConfig {
  voiceId: string;
  pitch: number; // 0.5 - 2.0
  speed: number; // 0.5 - 2.0
  volume: number; // 0.0 - 1.0
}

/** Voice effect preset */
export interface VoiceEffect {
  id: string;
  name: string;
  pitchShift: number; // semitones
  formantShift: number;
  reverbMix: number; // 0.0 - 1.0
  echoDelay?: number; // ms
  echoDecay?: number; // 0.0 - 1.0
}

/** A complete voice meme project */
export interface VoiceMemeProject {
  id: string;
  title: string;
  script: ScriptResponse | null;
  voiceConfig: VoiceConfig;
  effect: VoiceEffect | null;
  audioUri: string | null;
  duration: number; // seconds
  createdAt: number;
  updatedAt: number;
}
