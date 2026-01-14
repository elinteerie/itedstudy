import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function CalculatorScreen() {
  const [semester, setSemester] = useState<'first' | 'second'>('first');
  const [cgpa, setCgpa] = useState('0.00');

  const handleCalculate = () => {
    // Calculate CGPA logic here
    console.log('Calculate CGPA');
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
          <Text style={styles.levelTitle}>100 level</Text>
          
          <View style={styles.semesterButtons}>
            <TouchableOpacity
              style={[styles.semesterButton, semester === 'first' && styles.semesterButtonActive]}
              onPress={() => setSemester('first')}
            >
              <Text style={[styles.semesterText, semester === 'first' && styles.semesterTextActive]}>
                First semester
              </Text>
              <View style={[styles.badge, semester === 'first' && styles.badgeActive]}>
                <Text style={[styles.badgeText, semester === 'first' && styles.badgeTextActive]}>
                  (0.00)
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.semesterButton, semester === 'second' && styles.semesterButtonActive]}
              onPress={() => setSemester('second')}
            >
              <Text style={[styles.semesterText, semester === 'second' && styles.semesterTextActive]}>
                Second semester
              </Text>
              <View style={[styles.badge, semester === 'second' && styles.badgeActive]}>
                <Text style={[styles.badgeText, semester === 'second' && styles.badgeTextActive]}>
                  (0.00)
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>
            A man that fails to plan, planned to fail. Stay focused as the sky remains your starting point.
          </Text>
        </View>

        <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
          <Text style={styles.calculateText}>Calculate</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(tabs)/home')}>
          <Ionicons name="home" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="apps" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="bar-chart" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  backButton: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  cgpaDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  cgpaValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cgpaLabel: {
    fontSize: 14,
    color: '#666',
  },
  levelSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  semesterButtons: {
    gap: 10,
  },
  semesterButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  semesterButtonActive: {
    backgroundColor: '#1A237E',
  },
  semesterText: {
    fontSize: 14,
    color: '#000',
  },
  semesterTextActive: {
    color: '#fff',
  },
  badge: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeActive: {
    backgroundColor: '#B71C1C',
  },
  badgeText: {
    fontSize: 12,
    color: '#000',
  },
  badgeTextActive: {
    color: '#fff',
  },
  quoteContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  quoteText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  calculateButton: {
    backgroundColor: '#001f3f',
    borderRadius: 30,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  calculateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  navItem: {
    padding: 10,
  },
});