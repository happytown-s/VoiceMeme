import { View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>一般</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon" size={22} color="#636e72" />
            <Text style={styles.settingLabel}>ダークモード</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#dfe6e9', true: '#6C5CE7' }}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="save" size={22} color="#636e72" />
            <Text style={styles.settingLabel}>自動保存</Text>
          </View>
          <Switch
            value={autoSave}
            onValueChange={setAutoSave}
            trackColor={{ false: '#dfe6e9', true: '#6C5CE7' }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>音声</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="volume-high" size={22} color="#636e72" />
            <Text style={styles.settingLabel}>デフォルト音声</Text>
          </View>
          <Text style={styles.settingValue}>Nanami</Text>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="speedometer" size={22} color="#636e72" />
            <Text style={styles.settingLabel}>再生速度</Text>
          </View>
          <Text style={styles.settingValue}>1.0x</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>について</Text>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutText}>
            VoiceMeme v0.1.0
          </Text>
          <Text style={styles.aboutSubtext}>
            AI × TTS × エフェクトで声メメを作ろう
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b2bec3',
    textTransform: 'uppercase',
    marginBottom: 12,
    paddingLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#2d3436',
  },
  settingValue: {
    fontSize: 14,
    color: '#636e72',
  },
  aboutRow: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
  },
  aboutSubtext: {
    fontSize: 13,
    color: '#b2bec3',
    marginTop: 4,
  },
});
