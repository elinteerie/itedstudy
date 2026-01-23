import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

interface LevelData {
  id: string;
  level: string;
  firstGPA: string;
  secondGPA: string;
  cgpa: string;
  createdAt: string;
}

export default function CalculatorScreen() {
  const [semester, setSemester] = useState<'first' | 'second'>('first');
  const [cgpa, setCgpa] = useState('0.00');
  const [savedLevels, setSavedLevels] = useState<LevelData[]>([]);

useFocusEffect(
  useCallback(() => {
    loadSavedLevels();
  }, [])
);

  const loadSavedLevels = async () => {
    try {
      const data = await AsyncStorage.getItem('cgpa_records');
      if (data) {
        const levels = JSON.parse(data);
        setSavedLevels(levels);
        if (levels.length > 0) {
          const totalCGPA = levels.reduce((sum: number, l: LevelData) => sum + parseFloat(l.cgpa), 0) / levels.length;
          setCgpa(totalCGPA.toFixed(2));
        }
      }
    } catch (error) {
      console.error('Error loading levels:', error);
    }
  };

  const deleteLevel = async (id: string) => {
    try {
      const updated = savedLevels.filter(l => l.id !== id);
      await AsyncStorage.setItem('cgpa_records', JSON.stringify(updated));
      setSavedLevels(updated);
      if (updated.length > 0) {
        const totalCGPA = updated.reduce((sum, l) => sum + parseFloat(l.cgpa), 0) / updated.length;
        setCgpa(totalCGPA.toFixed(2));
      } else {
        setCgpa('0.00');
      }
      Toast.show({ type: 'success', text1: 'Deleted successfully' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to delete' });
    }
  };

  const handleCalculate = () => {
    router.push({ pathname: '/(tabs)/cgpa/calculator', params: { semester } });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>C.G.P.A Calculator</Text>
        <Text style={styles.subtitle}>Calculate semester and record of your grades</Text>

        <View style={styles.cgpaDisplay}>
          <Text style={styles.cgpaValue}>{cgpa}</Text>
          <Text style={styles.cgpaLabel}>Total C.G.P.A</Text>
        </View>

        <View style={styles.levelSection}>
          <Text style={styles.levelTitle}>Select Level</Text>
          <View style={styles.semesterButtons}>
            <TouchableOpacity
              style={[styles.semesterButton, semester === 'first' && styles.semesterButtonActive]}
              onPress={() => setSemester('first')}
            >
              <Text style={[styles.semesterText, semester === 'first' && styles.semesterTextActive]}>First semester</Text>
              <View style={[styles.badge, semester === 'first' && styles.badgeActive]}>
                <Text style={[styles.badgeText, semester === 'first' && styles.badgeTextActive]}>(0.00)</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.semesterButton, semester === 'second' && styles.semesterButtonActive]}
              onPress={() => setSemester('second')}
            >
              <Text style={[styles.semesterText, semester === 'second' && styles.semesterTextActive]}>Second semester</Text>
              <View style={[styles.badge, semester === 'second' && styles.badgeActive]}>
                <Text style={[styles.badgeText, semester === 'second' && styles.badgeTextActive]}>(0.00)</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>A man that fails to plan, planned to fail. Stay focused as the sky remains your starting point.</Text>
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
          <Text style={styles.calculateText}>Calculate</Text>
        </TouchableOpacity>

        {savedLevels.length > 0 && (
          <View style={styles.recordsSection}>
            <Text style={styles.recordsTitle}>Saved Records</Text>
            {savedLevels.map((level) => (
              <View key={level.id} style={styles.recordCard}>
                <View style={styles.recordInfo}>
                  <Text style={styles.recordLevel}>{level.level}</Text>
                  <Text style={styles.recordDetails}>1st: {level.firstGPA} | 2nd: {level.secondGPA}</Text>
                  <Text style={styles.recordCgpa}>CGPA: {level.cgpa}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteLevel(level.id)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={22} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  backButton: { paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, paddingHorizontal: 20 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30, paddingHorizontal: 20 },
  cgpaDisplay: { alignItems: 'center', marginBottom: 30 },
  cgpaValue: { fontSize: 48, fontWeight: 'bold', marginBottom: 5 },
  cgpaLabel: { fontSize: 14, color: '#666' },
  levelSection: { paddingHorizontal: 20, marginBottom: 30 },
  levelTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  semesterButtons: { gap: 10 },
  semesterButton: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  semesterButtonActive: { backgroundColor: '#1A237E' },
  semesterText: { fontSize: 14, color: '#000' },
  semesterTextActive: { color: '#fff' },
  badge: { backgroundColor: '#00052D', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeActive: { backgroundColor: '#fff' },
  badgeText: { fontSize: 12, color: '#fff' },
  badgeTextActive: { color: '#000' },
  quoteContainer: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 20, marginHorizontal: 20, marginBottom: 30 },
  quoteText: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 20 },
  calculateButton: { backgroundColor: '#001f3f', borderRadius: 30, padding: 18, marginHorizontal: 20, marginBottom: 30, alignItems: 'center' },
  calculateText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  recordsSection: { paddingHorizontal: 20, marginBottom: 50 },
  recordsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  recordCard: { backgroundColor: '#f9f9f9', borderRadius: 12, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#001f3f' },
  recordInfo: { flex: 1 },
  recordLevel: { fontSize: 16, fontWeight: 'bold', color: '#001f3f', marginBottom: 4 },
  recordDetails: { fontSize: 13, color: '#666', marginBottom: 2 },
  recordCgpa: { fontSize: 14, fontWeight: '600', color: '#4CAF50' },
  deleteBtn: { padding: 10 },
});