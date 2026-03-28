import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_NAME } from '../../src/constants';

export default function CreateScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Ionicons name="mic-circle" size={80} color="#6C5CE7" />
        <Text style={styles.heroTitle}>{APP_NAME}</Text>
        <Text style={styles.heroSubtitle}>
          AIで台本を作成して、声メメをつくろう！
        </Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.label}>テーマを入力</Text>
        <TextInput
          style={styles.input}
          placeholder="例：朝の挨拶、ニュース風、ドラマチックな独白..."
          placeholderTextColor="#b2bec3"
          multiline
        />
      </View>

      <TouchableOpacity style={styles.createButton}>
        <Ionicons name="sparkles" size={20} color="#fff" />
        <Text style={styles.createButtonText}>台本を生成</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  hero: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2d3436',
    marginTop: 12,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 8,
  },
  inputSection: {
    marginBottom: 20,
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
    minHeight: 100,
    textAlignVertical: 'top',
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
  createButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
