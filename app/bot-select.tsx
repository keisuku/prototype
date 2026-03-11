import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';

export default function BotSelectScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select Bot</Text>

      <TouchableOpacity
        style={[styles.botCard, styles.selectedCard]}
        onPress={() => router.back()}
      >
        <Text style={styles.botName}>SARAH</Text>
        <Text style={styles.botTitle}>Flame Oracle</Text>
        <Text style={styles.botDesc}>
          15min trend-follower with phoenix beast
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ACTIVE</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.botCard, styles.lockedCard]} disabled>
        <Text style={[styles.botName, styles.locked]}>???</Text>
        <Text style={[styles.botTitle, styles.locked]}>Coming Soon</Text>
        <Text style={[styles.botDesc, styles.locked]}>
          More fighters will join the arena
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Back to Battle</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  botCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
  },
  selectedCard: {
    borderColor: '#FF6347',
  },
  lockedCard: {
    borderColor: '#333333',
    opacity: 0.5,
  },
  botName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  botTitle: {
    color: '#FF6347',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  botDesc: {
    color: '#FFFFFF80',
    fontSize: 12,
    marginTop: 8,
  },
  locked: {
    color: '#666666',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF634730',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FF6347',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  backButton: {
    marginTop: 'auto',
    paddingVertical: 16,
    alignItems: 'center',
  },
  backText: {
    color: '#FFFFFF60',
    fontSize: 14,
  },
});
