import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ScriptResponse } from '../../src/ai';
import { generateScriptStream } from '../../src/ai';
import { APP_NAME, SCRIPT_STYLES, PRESET_TOPICS } from '../../src/constants';
import type { ScriptRequest } from '../../src/types';

export default function CreateScreen() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<ScriptRequest['style']>('funny');
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      Alert.alert('テーマを入力してください');
      return;
    }

    setIsGenerating(true);
    setStreamingText('');

    try {
      // In production, API key should be stored securely (SecureStore)
      const apiKey = ''; // TODO: Implement secure key storage

      if (!apiKey) {
        Alert.alert(
          'APIキー未設定',
          '設定画面からGLM-5のAPIキーを設定してください。',
          [{ text: '設定へ', onPress: () => router.push('/settings') }],
        );
        setIsGenerating(false);
        return;
      }

      await generateScriptStream(
        { topic: topic.trim(), style, maxLength: 500, language: 'ja' },
        apiKey,
        {
          onChunk: (text) => setStreamingText(text),
          onComplete: (response: ScriptResponse) => {
            setIsGenerating(false);
            // Navigate to editor with generated script
            router.push('/editor');
          },
          onError: (error: Error) => {
            setIsGenerating(false);
            Alert.alert('生成エラー', error.message);
          },
        },
      );
    } catch (error) {
      setIsGenerating(false);
      Alert.alert('エラー', '台本の生成に失敗しました。');
    }
  };

  const selectTopic = (preset: string) => {
    setTopic(preset);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Ionicons name="mic-circle" size={64} color="#6C5CE7" />
        <Text style={styles.heroTitle}>{APP_NAME}</Text>
        <Text style={styles.heroSubtitle}>
          AIで台本を作成して、声メメをつくろう！
        </Text>
      </View>

      {/* Topic Input */}
      <View style={styles.section}>
        <Text style={styles.label}>テーマを入力</Text>
        <TextInput
          style={styles.input}
          placeholder="例：朝の挨拶、ニュース風、ドラマチックな独白..."
          placeholderTextColor="#b2bec3"
          value={topic}
          onChangeText={setTopic}
          multiline
          editable={!isGenerating}
        />

        {/* Preset topics */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.presetsScroll}
        >
          {PRESET_TOPICS.map((preset) => (
            <TouchableOpacity
              key={preset}
              style={[
                styles.presetChip,
                topic === preset && styles.presetChipActive,
              ]}
              onPress={() => selectTopic(preset)}
              disabled={isGenerating}
            >
              <Text
                style={[
                  styles.presetText,
                  topic === preset && styles.presetTextActive,
                ]}
              >
                {preset}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Style Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>スタイル</Text>
        <View style={styles.styleGrid}>
          {SCRIPT_STYLES.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.styleCard,
                style === s.id && styles.styleCardActive,
              ]}
              onPress={() => setStyle(s.id)}
              disabled={isGenerating}
            >
              <Text style={styles.styleEmoji}>{s.emoji}</Text>
              <Text
                style={[
                  styles.styleName,
                  style === s.id && styles.styleNameActive,
                ]}
              >
                {s.label}
              </Text>
              <Text style={styles.styleDesc}>{s.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={[styles.createButton, isGenerating && styles.createButtonDisabled]}
        onPress={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="sparkles" size={20} color="#fff" />
            <Text style={styles.createButtonText}>台本を生成</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Streaming Preview */}
      {isGenerating && streamingText ? (
        <View style={styles.previewSection}>
          <Text style={styles.previewLabel}>生成中...</Text>
          <View style={styles.previewBox}>
            <Text style={styles.previewText}>{streamingText}</Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    marginTop: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  presetsScroll: {
    marginTop: 12,
  },
  presetChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  presetChipActive: {
    backgroundColor: '#6C5CE7',
    borderColor: '#6C5CE7',
  },
  presetText: {
    fontSize: 14,
    color: '#636e72',
  },
  presetTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  styleCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#dfe6e9',
    alignItems: 'center',
  },
  styleCardActive: {
    borderColor: '#6C5CE7',
    backgroundColor: '#f0edff',
  },
  styleEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  styleName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
  },
  styleNameActive: {
    color: '#6C5CE7',
  },
  styleDesc: {
    fontSize: 11,
    color: '#b2bec3',
    marginTop: 2,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  previewSection: {
    marginTop: 24,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C5CE7',
    marginBottom: 8,
  },
  previewBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    minHeight: 100,
  },
  previewText: {
    fontSize: 15,
    color: '#2d3436',
    lineHeight: 24,
  },
});
