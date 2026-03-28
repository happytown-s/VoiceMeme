import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EditorScreen() {
  const { scriptId } = useLocalSearchParams<{ scriptId: string }>();

  return (
    <>
      <Stack.Screen options={{ title: '台本編集' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.placeholder}>
          <Ionicons name="create" size={48} color="#dfe6e9" />
          <Text style={styles.placeholderText}>台本エディタ</Text>
          <Text style={styles.placeholderHint}>
            Script ID: {scriptId ?? 'none'}
          </Text>
          <Text style={styles.placeholderSub}>
            セグメントごとの台本編集・声設定・エフェクト適用はここで行います
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80%',
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#636e72',
    marginTop: 16,
  },
  placeholderHint: {
    fontSize: 14,
    color: '#b2bec3',
    marginTop: 8,
  },
  placeholderSub: {
    fontSize: 13,
    color: '#b2bec3',
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 280,
  },
});
