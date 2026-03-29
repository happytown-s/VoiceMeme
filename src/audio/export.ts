import * as FileSystem from 'expo-file-system';
import { Share, Platform } from 'react-native';
import { serializeLRC, type LRCFile } from '../lrc';

/** Export bitrate options */
export type Bitrate = 128 | 192 | 320;

/** Export configuration */
export interface ExportConfig {
  filename: string;
  theme: string;
  audioFormat: 'mp3' | 'wav';
  bitrate: Bitrate;
  includeLRC: boolean;
  includeText: boolean;
  scriptText?: string;
  lrcData?: LRCFile;
}

/** Result of an export operation */
export interface ExportResult {
  uri: string;
  filename: string;
  mimeType: string;
  size: number;
}

/** Generate a filename from theme and timestamp */
export function generateFilename(theme: string): string {
  const now = new Date();
  const dateStr =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const timeStr =
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0');
  const sanitizedTheme = theme.replace(/[\\/:*?"<>|]/g, '').slice(0, 20);
  return 'VoiceMeme_' + sanitizedTheme + '_' + dateStr + '_' + timeStr;
}

function getExportDir(): string {
  const docDir =
    (FileSystem as any).documentDirectory ?? '/tmp/voicememe/';
  return docDir + 'exports/';
}

async function ensureExportDir(): Promise<string> {
  const dir = getExportDir();
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!(dirInfo as any).exists) {
    await (FileSystem as any).makeDirectoryAsync(dir, {
      intermediates: true,
    });
  }
  return dir;
}

/** Export LRC content to a file */
export async function exportLRC(
  lrcData: LRCFile,
  filename: string,
): Promise<ExportResult> {
  const dir = await ensureExportDir();
  const lrcContent = serializeLRC(lrcData);
  const uri = dir + filename + '.lrc';
  await (FileSystem as any).writeAsStringAsync(uri, lrcContent, {
    encoding: 'utf8',
  });
  const info = await FileSystem.getInfoAsync(uri);
  return {
    uri,
    filename: filename + '.lrc',
    mimeType: 'text/plain',
    size: (info as any).size ?? 0,
  };
}

/** Export script text to a file */
export async function exportText(
  text: string,
  filename: string,
): Promise<ExportResult> {
  const dir = await ensureExportDir();
  const uri = dir + filename + '.txt';
  await (FileSystem as any).writeAsStringAsync(uri, text, {
    encoding: 'utf8',
  });
  const info = await FileSystem.getInfoAsync(uri);
  return {
    uri,
    filename: filename + '.txt',
    mimeType: 'text/plain',
    size: (info as any).size ?? 0,
  };
}

/** Copy an audio file to the export directory */
export async function exportAudio(
  sourceUri: string,
  filename: string,
  format: 'mp3' | 'wav',
): Promise<ExportResult> {
  const dir = await ensureExportDir();
  const ext = format === 'mp3' ? 'mp3' : 'wav';
  const uri = dir + filename + '.' + ext;

  if (
    sourceUri.startsWith('file://') ||
    sourceUri.startsWith('content://')
  ) {
    await (FileSystem as any).copyAsync({ from: sourceUri, to: uri });
  } else {
    await (FileSystem as any).writeAsStringAsync(uri, '', {
      encoding: 'utf8',
    });
  }

  const info = await FileSystem.getInfoAsync(uri);
  return {
    uri,
    filename: filename + '.' + ext,
    mimeType: format === 'mp3' ? 'audio/mpeg' : 'audio/wav',
    size: (info as any).size ?? 0,
  };
}

/** Share files via native share sheet */
export async function shareFiles(
  results: ExportResult[],
  dialogTitle?: string,
): Promise<void> {
  if (Platform.OS === 'web') {
    for (const result of results) {
      const link = document.createElement('a');
      link.href = result.uri;
      link.download = result.filename;
      link.click();
    }
    return;
  }

  if (results.length === 1) {
    await Share.share({
      url: results[0].uri,
      title: dialogTitle ?? results[0].filename,
    });
  } else if (results.length > 1) {
    const names = results.map((r) => r.filename).join(', ');
    await Share.share({
      url: results[0].uri,
      message: 'VoiceMeme Export Files: ' + names,
      title: dialogTitle ?? 'VoiceMeme Export',
    });
  }
}

/** Copy text to clipboard */
export async function copyTextToClipboard(
  text: string,
): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      await navigator.clipboard.writeText(text);
    } else {
      const Clipboard = await import('expo-clipboard');
      const fn = (Clipboard as any).default?.setStringAsync
        ?? (Clipboard as any).setStringAsync;
      await fn(text);
    }
    return true;
  } catch {
    return false;
  }
}

/** Run full export pipeline */
export async function fullExport(
  config: ExportConfig,
): Promise<ExportResult[]> {
  const results: ExportResult[] = [];

  if (config.audioFormat) {
    const audioResult = await exportAudio(
      config.filename,
      config.filename,
      config.audioFormat,
    );
    results.push(audioResult);
  }

  if (config.includeLRC && config.lrcData) {
    const lrcResult = await exportLRC(
      config.lrcData,
      config.filename,
    );
    results.push(lrcResult);
  }

  if (config.includeText && config.scriptText) {
    const textResult = await exportText(
      config.scriptText,
      config.filename,
    );
    results.push(textResult);
  }

  return results;
}
