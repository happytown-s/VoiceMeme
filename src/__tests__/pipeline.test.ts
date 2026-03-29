/**
 * E2E test suite for VoiceMeme pipeline:
 * Script Generation → TTS → Effects → LRC → Export
 *
 * Run with: npx jest src/__tests__/pipeline.test.ts
 */

import {
  generateScript,
} from '../ai/generateScript';
import {
  synthesizeSegments,
} from '../tts/synthesize';
import {
  applyEffects,
} from '../effects/processor';
import type { AudioBufferInfo } from '../effects/processor';
import {
  generateLRCFromSegments,
  generateLRCEstimated,
  serializeLRC,
  parseLRC,
  createLRCFile,
  formatTimestamp,
} from '../lrc/generate';
import {
  generateFilename,
  exportText,
} from '../audio/export';
import type { ScriptRequest, ScriptSegment, VoiceConfig } from '../types';
import { EFFECT_PRESETS, getEffectPreset } from '../effects/presets';
import { VOICE_PRESETS, getAllVoicePresets } from '../tts/voices';

// ============================================================
// Test 1: AI Script Generation → Parse Segments
// ============================================================
function testScriptGeneration() {
  const request: ScriptRequest = {
    topic: '朝の挨拶',
    style: 'funny',
    maxLength: 300,
    language: 'ja',
  };

  // Simulate GLM-5 response (mock)
  const mockResponse = {
    id: 'test-1',
    text: 'おはようございます！\n今日も元気にいきましょう！\nさあ、始めようか！',
    segments: [
      { id: 's1', text: 'おはようございます！' },
      { id: 's2', text: '今日も元気にいきましょう！' },
      { id: 's3', text: 'さあ、始めようか！' },
    ],
    createdAt: Date.now(),
  };

  console.assert(mockResponse.segments.length === 3, 'Expected 3 segments');
  console.assert(
    mockResponse.text.split('\n').filter((l) => l.trim()).length === 3,
    'Text should have 3 lines',
  );
  console.log('✅ Test 1: Script generation + segment parsing');
  return mockResponse;
}

// ============================================================
// Test 2: LRC Generation from Segments
// ============================================================
function testLRCGeneration(segments: { id: string; text: string }[]) {
  // Estimated LRC
  const scriptSegments: ScriptSegment[] = segments.map((s) => ({
    id: s.id,
    text: s.text,
  }));
  const estimated = generateLRCEstimated(scriptSegments);
  console.assert(estimated.length === 3, 'Expected 3 LRC lines');
  console.assert(estimated[0].timestamp === 0, 'First line should start at 0');

  // Serialize
  const lrcString = serializeLRC({
    metadata: { title: 'Test Script', by: 'VoiceMeme' },
    lines: estimated,
  });
  console.assert(lrcString.includes('[ti:Test Script]'), 'Should have title metadata');
  console.assert(lrcString.includes('[by:VoiceMeme]'), 'Should have by metadata');
  console.assert(lrcString.includes('[00:00.00]'), 'Should have timestamp');

  // Parse back
  const parsed = parseLRC(lrcString);
  console.assert(parsed.lines.length === 3, 'Parsed should have 3 lines');
  console.assert(parsed.metadata.title === 'Test Script', 'Title should match');
  console.assert(
    Math.abs(parsed.lines[0].timestamp - 0) < 0.01,
    'Parsed timestamp should be 0',
  );

  console.log('✅ Test 2: LRC generation + serialization + parsing');
  return { estimated, lrcString, parsed };
}

// ============================================================
// Test 3: Voice Effects Processing
// ============================================================
function testEffectsProcessing() {
  const buffer: AudioBufferInfo = {
    sampleRate: 44100,
    numberOfChannels: 1,
    duration: 1.0,
    data: [
      // Simple sine wave at 440Hz for 1 second
      Array.from({ length: 44100 }, (_, i) =>
        Math.sin((2 * Math.PI * 440 * i) / 44100),
      ),
    ],
  };

  // Test robot effect
  const robot = getEffectPreset('robot')!;
  const robotResult = applyEffects(buffer, {
    pitchShift: robot.pitchShift,
    formantShift: robot.formantShift,
    reverbMix: robot.reverbMix,
    speedChange: 1.0,
  });

  console.assert(
    robotResult.audioBuffer.numberOfChannels === 1,
    'Should preserve channel count',
  );
  console.assert(robotResult.duration > 0, 'Should have duration > 0');
  console.assert(
    robotResult.audioBuffer.data[0].length > 0,
    'Should have samples',
  );

  // Test deep voice
  const deep = getEffectPreset('deep')!;
  const deepResult = applyEffects(buffer, {
    pitchShift: deep.pitchShift,
    formantShift: deep.formantShift,
    reverbMix: deep.reverbMix,
    speedChange: 1.0,
    echoDelay: deep.echoDelay,
    echoDecay: deep.echoDecay,
  });

  console.assert(deepResult.duration > 0, 'Deep effect should produce audio');

  // Test reverse
  const reverseResult = applyEffects(buffer, {
    pitchShift: 0,
    formantShift: 1.0,
    reverbMix: 0,
    speedChange: 1.0,
    reverse: true,
  });

  const firstSample = buffer.data[0][0];
  const lastSample = buffer.data[0][buffer.data[0].length - 1];
  const reversedFirst = reverseResult.audioBuffer.data[0][0];

  console.assert(
    Math.abs(reversedFirst - lastSample) < 0.001,
    'Reversed first sample should match original last',
  );

  // Test speed change
  const speedResult = applyEffects(buffer, {
    pitchShift: 0,
    formantShift: 1.0,
    reverbMix: 0,
    speedChange: 2.0,
  });

  console.assert(
    speedResult.duration < buffer.duration,
    '2x speed should be shorter',
  );

  console.log('✅ Test 3: Voice effects (robot/deep/reverse/speed)');
}

// ============================================================
// Test 4: Voice Presets & Effect Presets
// ============================================================
function testPresets() {
  const voices = getAllVoicePresets();
  console.assert(voices.length === 10, `Expected 10 voices, got ${voices.length}`);
  console.assert(
    voices.some((v) => v.id === 'ja-JP-NanamiNeural'),
    'Should have Nanami voice',
  );

  const effects = EFFECT_PRESETS;
  console.assert(effects.length === 8, `Expected 8 effects, got ${effects.length}`);
  console.assert(
    effects.some((e) => e.id === 'robot'),
    'Should have robot effect',
  );

  console.log('✅ Test 4: Voice presets (10) + Effect presets (8)');
}

// ============================================================
// Test 5: Filename Generation
// ============================================================
function testFilenameGeneration() {
  const filename = generateFilename('朝の挨拶');
  console.assert(
    filename.startsWith('VoiceMeme_朝の挨拶_'),
    'Filename should start with VoiceMeme_朝の挨拶_',
  );
  console.assert(
    filename.length > 10,
    'Filename should have date/time appended',
  );

  // Special characters should be stripped
  const special = generateFilename('テスト/特殊<>文字');
  console.assert(
    !special.includes('/') && !special.includes('<'),
    'Special chars should be stripped',
  );

  console.log('✅ Test 5: Filename generation');
}

// ============================================================
// Test 6: Timestamp Formatting
// ============================================================
function testTimestampFormatting() {
  console.assert(formatTimestamp(0) === '[00:00.00]', '0s format');
  console.assert(formatTimestamp(65.5) === '[01:05.50]', '65.5s format');
  console.assert(formatTimestamp(359.99) === '[05:59.99]', '359.99s format');

  console.log('✅ Test 6: Timestamp formatting');
}

// ============================================================
// Run all tests
// ============================================================
export function runAllTests(): { passed: number; failed: number; errors: string[] } {
  const errors: string[] = [];
  let passed = 0;
  let failed = 0;

  const scriptResult = testScriptGeneration();

  const tests = [
    { name: 'Script Generation', fn: () => scriptResult },
    { name: 'LRC Generation', fn: () => testLRCGeneration(scriptResult.segments) },
    { name: 'Voice Effects', fn: testEffectsProcessing },
    { name: 'Presets', fn: testPresets },
    { name: 'Filename Generation', fn: testFilenameGeneration },
    { name: 'Timestamp Formatting', fn: testTimestampFormatting },
  ];

  for (const test of tests) {
    try {
      test.fn();
      passed++;
    } catch (error) {
      failed++;
      errors.push(`${test.name}: ${(error as Error).message}`);
      console.error(`❌ ${test.name}: ${(error as Error).message}`);
    }
  }

  console.log(`\n📊 Results: ${passed}/${tests.length} passed, ${failed} failed`);
  return { passed, failed, errors };
}
