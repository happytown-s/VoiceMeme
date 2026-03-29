import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  ScrollView,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StepIndicator, SectionHeader } from '../src/components';

const STEPS = ['台本', '音声', 'エフェクト', '出力'];

interface ExportFormat {
  id: string;
  label: string;
  icon: string;
  description: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
  { id: 'mp3', label: 'MP3', icon: '🎵', description: '音声ファイル' },
  { id: 'wav', label: 'WAV', icon: '🔊', description: '無圧縮音声' },
  { id: 'lrc', label: 'LRC', icon: '📝', description: '歌詞タイムスタンプ' },
  { id: 'txt', label: 'テキスト', icon: '📄', description: '台本テキスト' },
];

export default function ExportScreen() {
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(
    new Set(['mp3']),
  );
  const [isExporting, setIsExporting] = useState(false);

  const toggleFormat = (id: string) => {
    setSelectedFormats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExport = async () => {
    if (selectedFormats.size === 0) {
      Alert.alert('形式を選択してください');
      return;
    }

    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const formatNames = Array.from(selectedFormats)
        .map((f) => EXPORT_FORMATS.find((fmt) => fmt.id === f)?.label)
        .join(', ');
      await Share.share({
        message: 'VoiceMeme Export: ' + formatNames,
        title: 'VoiceMeme Export',
      });
    } catch {
      // Share cancelled
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveToLibrary = () => {
    Alert.alert('保存完了', 'ライブラリに保存しました！', [
      { text: 'OK', onPress: () => router.replace('/(tabs)/library') },
    ]);
  };

  const formatListStr = Array.from(selectedFormats)
    .map((f) => f.toUpperCase())
    .join(', ') || '未選択';

  return (
    <>
      <Stack.Screen options={{ title: 'エクスポート' }} />
      <View style={styles.container}>
        <StepIndicator currentStep={3} steps={STEPS} />
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <SectionHeader title="出力形式を選択" />

          <View style={styles.formatGrid}>
            {EXPORT_FORMATS.map((format) => {
              const isSelected = selectedFormats.has(format.id);
              return (
                <TouchableOpacity
                  key={format.id}
                  style={[styles.formatCard, isSelected && styles.formatCardActive]}
                  onPress={() => toggleFormat(format.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.formatIcon}>{format.icon}</Text>
                  <Text style={[styles.formatLabel, isSelected && styles.formatLabelActive]}>
                    {format.label}
                  </Text>
                  <Text style={styles.formatDesc}>{format.description}</Text>
                  {isSelected && (
                    <View style={styles.formatCheck}>
                      <Ionicons name="checkmark-circle" size={20} color="#6C5CE7" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>プロジェクト情報</Text>
            <InfoRow label="タイトル" value="サンプルボイスメメ" />
            <InfoRow label="セグメント数" value="2" />
            <InfoRow label="推定再生時間" value="0:15" />
            <InfoRow label="出力形式" value={formatListStr} />
          </View>

          <TouchableOpacity
            style={[styles.exportBtn, isExporting && styles.exportBtnDisabled]}
            onPress={handleExport}
            disabled={isExporting || selectedFormats.size === 0}
          >
            <Ionicons name={isExporting ? 'hourglass' : 'share'} size={20} color="#fff" />
            <Text style={styles.exportBtnText}>
              {isExporting ? 'エクスポート中...' : 'シェア'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveToLibrary}>
            <Ionicons name="download" size={20} color="#6C5CE7" />
            <Text style={styles.saveBtnText}>ライブラリに保存</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)/index')}>
            <Ionicons name="home" size={18} color="#636e72" />
            <Text style={styles.homeBtnText}>ホームに戻る</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
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
  formatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  formatCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#dfe6e9',
  },
  formatCardActive: {
    borderColor: '#6C5CE7',
    backgroundColor: '#f0edff',
  },
  formatIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  formatLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3436',
  },
  formatLabelActive: {
    color: '#6C5CE7',
  },
  formatDesc: {
    fontSize: 12,
    color: '#b2bec3',
    marginTop: 2,
  },
  formatCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#636e72',
  },
  infoValue: {
    fontSize: 14,
    color: '#2d3436',
    fontWeight: '500',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exportBtnDisabled: {
    opacity: 0.6,
  },
  exportBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0edff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#6C5CE7',
    marginBottom: 12,
  },
  saveBtnText: {
    color: '#6C5CE7',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 4,
  },
  homeBtnText: {
    color: '#636e72',
    fontSize: 14,
    marginLeft: 6,
  },
});
