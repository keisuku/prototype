import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAudioStore } from '../src/stores/useAudioStore';
import { useBotStore } from '../src/stores/useBotStore';
import { useMarketStore } from '../src/stores/useMarketStore';
import Slider from '../src/components/ui/DebugSlider';

export default function SettingsScreen() {
  const isMuted = useAudioStore((s) => s.isMuted);
  const setMuted = useAudioStore((s) => s.setMuted);
  const resetPortfolio = useBotStore((s) => s.resetPortfolio);
  const debugSigma = useMarketStore((s) => s.debugSigma);
  const setDebugSigma = useMarketStore((s) => s.setDebugSigma);
  const [showDebug, setShowDebug] = useState(debugSigma !== null);

  const handleReset = () => {
    Alert.alert(
      'Reset Portfolio',
      'This will reset your virtual balance and trade history. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetPortfolio(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {/* Sound */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Mute All Sounds</Text>
            <Switch
              value={isMuted}
              onValueChange={setMuted}
              trackColor={{ false: '#333', true: '#FF6347' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Debug */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Debug</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Manual Sigma Override</Text>
            <Switch
              value={showDebug}
              onValueChange={(v) => {
                setShowDebug(v);
                if (!v) setDebugSigma(null);
                else setDebugSigma(1.0);
              }}
              trackColor={{ false: '#333', true: '#FFD700' }}
              thumbColor="#FFFFFF"
            />
          </View>
          {showDebug && (
            <Slider
              value={debugSigma ?? 1.0}
              onValueChange={setDebugSigma}
              min={0}
              max={4}
              step={0.1}
            />
          )}
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>Reset Portfolio</Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            CoinBattleSaki is an entertainment application. All trading is
            virtual with no real money involved. This app does not provide
            financial advice. Market data is sourced from public APIs and may be
            delayed. Past performance of virtual bots does not indicate future
            results.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>Back to Battle</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  content: {
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF80',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#FF634730',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FF6347',
    fontSize: 14,
    fontWeight: '600',
  },
  disclaimer: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  disclaimerTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  disclaimerText: {
    color: '#FFFFFF80',
    fontSize: 12,
    lineHeight: 18,
  },
  backButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  backText: {
    color: '#FFFFFF60',
    fontSize: 14,
  },
});
