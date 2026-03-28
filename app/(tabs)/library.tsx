import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PLACEHOLDER_PROJECTS = [
  { id: '1', title: 'はじめてのボイスメメ', duration: '0:15' },
  { id: '2', title: 'ニュース風おはよう', duration: '0:30' },
];

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      {PLACEHOLDER_PROJECTS.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="library-outline" size={64} color="#dfe6e9" />
          <Text style={styles.emptyText}>
            まだボイスメメがないよ
          </Text>
          <Text style={styles.emptyHint}>
            作成タブから最初のメメを作ろう！
          </Text>
        </View>
      ) : (
        <FlatList
          data={PLACEHOLDER_PROJECTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Ionicons name="play-circle" size={40} color="#6C5CE7" />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDuration}>{item.duration}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#636e72',
    marginTop: 16,
  },
  emptyHint: {
    fontSize: 14,
    color: '#b2bec3',
    marginTop: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  cardContent: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
  },
  cardDuration: {
    fontSize: 12,
    color: '#b2bec3',
    marginTop: 4,
  },
});
