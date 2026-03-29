import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StepIndicator, ActionButton, SectionHeader } from '../src/components';

const STEPS = ['台本', '音声', 'エフェクト', '出力'];

export default function ScriptEditorScreen() {
  const { scriptId } = useLocalSearchParams<{ scriptId?: string }>();
  const [segments, setSegments] = useState<string[]>(
    scriptId
      ? ['セグメント1のサンプルテキストです。', 'セグメント2のサンプルテキストです。']
      : [],
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(segments[index]);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const updated = [...segments];
    updated[editingIndex] = editText.trim();
    setSegments(updated);
    setEditingIndex(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText('');
  };

  const addSegment = () => {
    setSegments([...segments, '']);
    setEditingIndex(segments.length);
    setEditText('');
  };

  const deleteSegment = (index: number) => {
    Alert.alert('セグメント削除', 'このセグメントを削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: () => setSegments(segments.filter((_, i) => i !== index)),
      },
    ]);
  };

  const moveSegment = (from: number, to: number) => {
    if (to < 0 || to >= segments.length) return;
    const updated = [...segments];
    [updated[from], updated[to]] = [updated[to], updated[from]];
    setSegments(updated);
  };

  return (
    <>
      <Stack.Screen options={{ title: '台本編集' }} />
      <View style={styles.container}>
        <StepIndicator currentStep={0} steps={STEPS} />

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <SectionHeader
            title="台本を確認・編集"
            subtitle={`${segments.length} セグメント`}
          />

          {/* Empty state */}
          {segments.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#dfe6e9" />
              <Text style={styles.emptyText}>台本がありません</Text>
              <Text style={styles.emptyHint}>
                作成画面からAIで台本を生成しましょう
              </Text>
            </View>
          )}

          {/* Segment list */}
          {segments.map((segment, index) => (
            <View key={index} style={styles.segmentCard}>
              <View style={styles.segmentHeader}>
                <Text style={styles.segmentNumber}>#{index + 1}</Text>
                <View style={styles.segmentActions}>
                  {index > 0 && (
                    <TouchableOpacity onPress={() => moveSegment(index, index - 1)}>
                      <Ionicons name="chevron-up" size={20} color="#636e72" />
                    </TouchableOpacity>
                  )}
                  {index < segments.length - 1 && (
                    <TouchableOpacity onPress={() => moveSegment(index, index + 1)}>
                      <Ionicons name="chevron-down" size={20} color="#636e72" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => deleteSegment(index)}>
                    <Ionicons name="trash-outline" size={18} color="#d63031" />
                  </TouchableOpacity>
                </View>
              </View>

              {editingIndex === index ? (
                <View style={styles.editRow}>
                  <TextInput
                    style={styles.editInput}
                    value={editText}
                    onChangeText={setEditText}
                    multiline
                    autoFocus
                    blurOnSubmit={false}
                  />
                  <View style={styles.editButtons}>
                    <TouchableOpacity
                      style={[styles.editBtn, styles.editBtnCancel]}
                      onPress={cancelEdit}
                    >
                      <Text style={styles.editBtnText}>✕</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.editBtn, styles.editBtnSave]}
                      onPress={saveEdit}
                    >
                      <Text style={styles.editBtnTextSave}>✓</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.segmentTextContainer}
                  onPress={() => startEdit(index)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.segmentText}>{segment}</Text>
                  <Ionicons name="pencil" size={14} color="#b2bec3" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* Add segment */}
          <TouchableOpacity style={styles.addCard} onPress={addSegment}>
            <Ionicons name="add-circle-outline" size={24} color="#6C5CE7" />
            <Text style={styles.addText}>セグメントを追加</Text>
          </TouchableOpacity>

          {/* Navigation buttons */}
          <View style={styles.navButtons}>
            <ActionButton
              title="戻る"
              variant="ghost"
              onPress={() => router.back()}
            />
            <ActionButton
              title="音声設定へ →"
              onPress={() => {
                if (segments.length === 0) {
                  Alert.alert('台本が必要です');
                  return;
                }
                router.push('/voice-settings');
              }}
              disabled={segments.length === 0}
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#636e72',
    marginTop: 12,
  },
  emptyHint: {
    fontSize: 13,
    color: '#b2bec3',
    marginTop: 4,
  },
  segmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  segmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  segmentNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C5CE7',
    backgroundColor: '#f0edff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  editRow: {
    gap: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#6C5CE7',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#faf9ff',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnCancel: {
    backgroundColor: '#dfe6e9',
  },
  editBtnSave: {
    backgroundColor: '#6C5CE7',
  },
  editBtnText: {
    color: '#636e72',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editBtnTextSave: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  segmentTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 15,
    color: '#2d3436',
    lineHeight: 22,
    flex: 1,
    marginRight: 8,
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#dfe6e9',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 24,
  },
  addText: {
    fontSize: 14,
    color: '#6C5CE7',
    fontWeight: '600',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
});
