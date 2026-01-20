import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ExamResultScreen() {
  const score = 20;
  const total = 50;
  const answered = 50;
  const wrongAnswers = 30;
  const correctAnswers = 20;

  const topics = [
    'Religious of mission',
    'A Human Science',
    'B Atomic',
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color="#000" />
          <Text style={styles.timerText}>58:35</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.congratsText}>
          Congratulations on completing your evaluated test, here, are all examination you've done but we encourage you in all spheres of life in taking this step shows your commitment to growth and learning. Be proud of yourself—every evaluation is a milestone toward greater achievement. Keep believing in your abilities and moving higher, each step counts.
        </Text>

        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Final Result</Text>
          <Text style={styles.scoreText}>{score}/{total}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={[styles.dot, styles.dotGray]} />
              <Text style={styles.statText}>{answered} Questions Answered</Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.dot, styles.dotRed]} />
              <Text style={styles.statText}>{wrongAnswers} Answered wrongly</Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.dot, styles.dotGreen]} />
              <Text style={styles.statText}>{correctAnswers} Answered correctly</Text>
            </View>
          </View>
        </View>

        <View style={styles.topicsSection}>
          <Text style={styles.topicsTitle}>Topics to focus on</Text>
          {topics.map((topic, index) => (
            <View key={index} style={styles.topicItem}>
              <Text style={styles.topicNumber}>{index + 1}.</Text>
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  congratsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 30,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  statsContainer: {
    width: '100%',
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotGray: {
    backgroundColor: '#666',
  },
  dotRed: {
    backgroundColor: '#FF0000',
  },
  dotGreen: {
    backgroundColor: '#4CAF50',
  },
  statText: {
    fontSize: 14,
    color: '#000',
  },
  topicsSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topicsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  topicItem: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  topicNumber: {
    fontSize: 14,
    color: '#666',
  },
  topicText: {
    fontSize: 14,
    color: '#666',
  },
});