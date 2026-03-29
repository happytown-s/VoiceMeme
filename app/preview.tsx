import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StepIndicator, ActionButton, SectionHeader } from '../src/components';

const STEPS = ['台本', '音声', 'エフェクト', '出力'];
const { width } = Dimensions.get('window');

// Simulated waveform data
const WAVEFORM_BARS = 60;
const generateWaveform = () =>
  Array.from({ length: WAVEFORM_BARS }, () => 0.2 + Math.random() * 0.8);

export default function PreviewScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [waveformData] = useState(generateWaveform);
  const totalDuration = '0:15';

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate playback progress
      const interval = setInterval(() => {
        setPlaybackPosition((prev) => {
          if (prev >= WAVEFORM_BARS) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 250);
    } else {
      setPlaybackPosition(0);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'プレビュー' }} />
      <View style={styles.container}>
        <StepIndicator currentStep={3} steps={STEPS} />

        <View style={styles.content}>
          {/* Waveform visualization */}
          <SectionHeader title="プレビュー再生" subtitle={totalDuration} />

          <View style={styles.waveformContainer}>
            <View style={styles.waveform}>
              {waveformData.map((height, i) => {
                const isPlayed = i < playbackPosition;
                return (
                  <View
                    key={i}
                    style={[
                      styles.waveBar,
                      {
                        height: `${height * 100}%`,
                        backgroundColor: isPlayed ? '#6C5CE7' : '#dfe6e9',
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>

          {/* Playback controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlBtn}>
              <Ionicons name="play-back" size={28} color="#2d3436" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.playBtn, isPlaying && styles.playBtnActive]}
              onPress={togglePlayback}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={36}
                color="#ffffff"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn}>
              <Ionicons name="play-forward" size={28} color="#2d3436" />
            </TouchableOpacity>
          </View>

          {/* Time display */}
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>
              0:00 / {totalDuration}
            </Text>
          </View>

          {/* Script preview */}
          <View style={styles.scriptPreview}>
            <Text style={styles.scriptTitle}>台本</Text>
            <View style={styles.scriptLines}>
              {['セグメント1のサンプルテキストです。', 'セグメント2のサンプルテキストです。'].map(
                (line, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.scriptLine,
                      i === 0 && playbackPosition < 30 && styles.scriptLineActive,
                      i === 1 && playbackPosition >= 30 && styles.scriptLineActive,
                    ]}
                  >
                    {line}
                  </Text>
                ),
              )}
            </View>
          </View>

          {/* Navigation */}
          <View style={styles.navButtons}>
            <ActionButton
              title="← エフェクトに戻る"
              variant="ghost"
              onPress={() => router.back()}
            />
            <ActionButton
              title="エクスポート →"
              onPress={() => router.push('/export')}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  waveformContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    marginBottom: 24,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
  },
  waveBar: {
    width: `${(100 - WAVEFORM_BARS * 0.5) / WAVEFORM_BARS}%`,
    minWidth: 3,
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 12,
  },
  controlBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playBtnActive: {
    backgroundColor: '#00b894',
    shadowColor: '#00b894',
  },
  timeRow: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timeText: {
    fontSize: 14,
    color: '#636e72',
  },
  scriptPreview: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    marginBottom: 24,
  },
  scriptTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b2bec3',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  scriptLines: {
    gap: 8,
  },
  scriptLine: {
    fontSize: 14,
    color: '#b2bec3',
    lineHeight: 22,
  },
  scriptLineActive: {
    color: '#6C5CE7',
    fontWeight: '600',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 'auto',
  },
});
