import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StepIndicator, ActionButton, SectionHeader } from '../src/components';
import { EFFECT_PRESETS } from '../src/effects';
import type { VoiceEffect } from '../src/types';

const STEPS = ['台本', '音声', 'エフェクト', '出力'];

export default function EffectsScreen() {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [customPitch, setCustomPitch] = useState(0);
  const [customReverb, setCustomReverb] = useState(0.2);

  const currentPreset = selectedEffect
    ? EFFECT_PRESETS.find((e) => e.id === selectedEffect)
    : null;

  const selectEffect = (id: string) => {
    setSelectedEffect(selectedEffect === id ? null : id);
    if (id !== 'custom') {
      const preset = EFFECT_PRESETS.find((e) => e.id === id);
      if (preset) {
        setCustomPitch(preset.pitchShift);
        setCustomReverb(preset.reverbMix);
      }
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'エフェクト' }} />
      <View style={styles.container}>
        <StepIndicator currentStep={2} steps={STEPS} />

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          <SectionHeader
            title="エフェクトを選択"
            subtitle={currentPreset?.name ?? 'なし'}
          />

          {/* Preset grid */}
          <View style={styles.presetGrid}>
            {EFFECT_PRESETS.map((effect) => (
              <TouchableOpacity
                key={effect.id}
                style={[
                  styles.presetCard,
                  selectedEffect === effect.id && styles.presetCardActive,
                ]}
                onPress={() => selectEffect(effect.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.presetEmoji}>
                  {effect.name.split(' ')[0]}
                </Text>
                <Text
                  style={[
                    styles.presetName,
                    selectedEffect === effect.id && styles.presetNameActive,
                  ]}
                >
                  {effect.name.split(' ').slice(1).join(' ')}
                </Text>
                <View style={styles.presetParams}>
                  {effect.pitchShift !== 0 && (
                    <Text style={styles.paramTag}>
                      ♪ {effect.pitchShift > 0 ? '+' : ''}
                      {effect.pitchShift}
                    </Text>
                  )}
                  {effect.reverbMix > 0.1 && (
                    <Text style={styles.paramTag}>
                      🌊 {Math.round(effect.reverbMix * 100)}%
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {/* Custom */}
            <TouchableOpacity
              style={[
                styles.presetCard,
                selectedEffect === 'custom' && styles.presetCardActive,
              ]}
              onPress={() => selectEffect('custom')}
              activeOpacity={0.7}
            >
              <Text style={styles.presetEmoji}>🎛️</Text>
              <Text
                style={[
                  styles.presetName,
                  selectedEffect === 'custom' && styles.presetNameActive,
                ]}
              >
                カスタム
              </Text>
              <Text style={styles.paramTag}>手動調整</Text>
            </TouchableOpacity>
          </View>

          {/* Custom sliders (shown when custom or any preset selected) */}
          {(selectedEffect === 'custom' || currentPreset) && (
            <View style={styles.customSection}>
              <SectionHeader title="パラメーター微調整" />

              <View style={styles.paramRow}>
                <Text style={styles.paramLabel}>ピッチシフト</Text>
                <Text style={styles.paramValue}>
                  {customPitch > 0 ? '+' : ''}
                  {customPitch} 半音
                </Text>
              </View>
              <View style={styles.paramSliderRow}>
                <Text style={styles.paramSliderMin}>-12</Text>
                <View style={styles.paramSliderTrack}>
                  <View
                    style={[
                      styles.paramSliderFill,
                      {
                        width: `${((customPitch + 12) / 24) * 100}%`,
                        backgroundColor: customPitch === 0 ? '#dfe6e9' : '#6C5CE7',
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.paramSliderThumb,
                      {
                        left: `${((customPitch + 12) / 24) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.paramSliderMax}>+12</Text>
              </View>

              <TouchableOpacity
                style={styles.presetApplyBtn}
                onPress={() => setCustomPitch(0)}
              >
                <Text style={styles.presetApplyText}>リセット</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Navigation */}
          <View style={styles.navButtons}>
            <ActionButton
              title="← 音声に戻る"
              variant="ghost"
              onPress={() => router.back()}
            />
            <ActionButton
              title="プレビュー →"
              onPress={() => router.push('/preview')}
            />
          </View>
        </ScrollView>
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  presetCard: {
    width: '30%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#dfe6e9',
    alignItems: 'center',
  },
  presetCardActive: {
    borderColor: '#6C5CE7',
    backgroundColor: '#f0edff',
  },
  presetEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  presetName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2d3436',
    textAlign: 'center',
  },
  presetNameActive: {
    color: '#6C5CE7',
  },
  presetParams: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  paramTag: {
    fontSize: 10,
    color: '#636e72',
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  customSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    marginBottom: 24,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paramLabel: {
    fontSize: 14,
    color: '#2d3436',
    fontWeight: '600',
  },
  paramValue: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  paramSliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  paramSliderMin: {
    fontSize: 11,
    color: '#b2bec3',
    width: 24,
  },
  paramSliderMax: {
    fontSize: 11,
    color: '#b2bec3',
    width: 24,
    textAlign: 'right',
  },
  paramSliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#dfe6e9',
    borderRadius: 3,
    position: 'relative',
  },
  paramSliderFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    borderRadius: 3,
  },
  paramSliderThumb: {
    position: 'absolute',
    top: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#6C5CE7',
    marginLeft: -8,
  },
  presetApplyBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  presetApplyText: {
    fontSize: 12,
    color: '#636e72',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
});
