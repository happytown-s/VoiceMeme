import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StepIndicator, ActionButton, SectionHeader } from '../src/components';
import { VOICE_PRESETS, getAllVoicePresets } from '../src/tts';

const STEPS = ['台本', '音声', 'エフェクト', '出力'];

export default function VoiceSettingsScreen() {
  const [selectedVoice, setSelectedVoice] = useState(VOICE_PRESETS[0].id);
  const [pitch, setPitch] = useState(1.0);
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(1.0);

  const allVoices = getAllVoicePresets();
  const currentVoice = allVoices.find((v) => v.id === selectedVoice);

  return (
    <>
      <Stack.Screen options={{ title: '音声設定' }} />
      <View style={styles.container}>
        <StepIndicator currentStep={1} steps={STEPS} />

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Voice selection */}
          <SectionHeader
            title="声を選択"
            subtitle={currentVoice ? `${currentVoice.name} — ${currentVoice.description}` : ''}
          />

          <View style={styles.voiceGrid}>
            {allVoices.map((voice) => (
              <TouchableOpacity
                key={voice.id}
                style={[
                  styles.voiceCard,
                  selectedVoice === voice.id && styles.voiceCardActive,
                ]}
                onPress={() => setSelectedVoice(voice.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={voice.gender === 'Female' ? 'woman' : 'man'}
                  size={24}
                  color={selectedVoice === voice.id ? '#6C5CE7' : '#b2bec3'}
                />
                <Text
                  style={[
                    styles.voiceName,
                    selectedVoice === voice.id && styles.voiceNameActive,
                  ]}
                >
                  {voice.name}
                </Text>
                <Text style={styles.voiceLocale}>{voice.locale}</Text>
                <Text style={styles.voiceDesc} numberOfLines={1}>
                  {voice.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Pitch */}
          <SectionHeader title="ピッチ" subtitle={`${pitch.toFixed(1)}x`} />
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>低</Text>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              step={0.1}
              value={pitch}
              onValueChange={setPitch}
              minimumTrackTintColor="#6C5CE7"
              maximumTrackTintColor="#dfe6e9"
            />
            <Text style={styles.sliderLabel}>高</Text>
          </View>

          {/* Speed */}
          <SectionHeader title="速度" subtitle={`${speed.toFixed(1)}x`} />
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>遅</Text>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              step={0.1}
              value={speed}
              onValueChange={setSpeed}
              minimumTrackTintColor="#6C5CE7"
              maximumTrackTintColor="#dfe6e9"
            />
            <Text style={styles.sliderLabel}>速</Text>
          </View>

          {/* Volume */}
          <SectionHeader title="音量" subtitle={`${Math.round(volume * 100)}%`} />
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>🔇</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1.0}
              step={0.05}
              value={volume}
              onValueChange={setVolume}
              minimumTrackTintColor="#6C5CE7"
              maximumTrackTintColor="#dfe6e9"
            />
            <Text style={styles.sliderLabel}>🔊</Text>
          </View>

          {/* Navigation */}
          <View style={styles.navButtons}>
            <ActionButton
              title="← 台本に戻る"
              variant="ghost"
              onPress={() => router.back()}
            />
            <ActionButton
              title="エフェクトへ →"
              onPress={() => router.push('/effects')}
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
  voiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  voiceCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#dfe6e9',
    alignItems: 'center',
  },
  voiceCardActive: {
    borderColor: '#6C5CE7',
    backgroundColor: '#f0edff',
  },
  voiceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    marginTop: 6,
  },
  voiceNameActive: {
    color: '#6C5CE7',
  },
  voiceLocale: {
    fontSize: 11,
    color: '#b2bec3',
    marginTop: 2,
  },
  voiceDesc: {
    fontSize: 11,
    color: '#636e72',
    marginTop: 4,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  slider: {
    flex: 1,
  },
  sliderLabel: {
    fontSize: 18,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
});
