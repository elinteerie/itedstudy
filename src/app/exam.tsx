import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ExamScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attemptedQuestions, setAttemptedQuestions] = useState<number[]>([]);

  const questions = [
    {
      id: 1,
      question: 'What is the main aim of Cyber Security Education to infrastructure?',
      options: [
        'A) Important and Resilience',
        'B) Important and Resilience',
        'C) Important and Resilience',
        'D) Important and Resilience',
      ],
      explanation: 'The concept of cyber security is related, it can be classified as IMPORTANT AND RESILIENCE',
      topic: 'Fundamentals of Cyber Security',
    },
  ];

  const totalQuestions = 50;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    if (!attemptedQuestions.includes(currentQuestion)) {
      setAttemptedQuestions([...attemptedQuestions, currentQuestion]);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestion(index);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cyber Security</Text>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.progressText}>{attemptedQuestions.length}/{totalQuestions}</Text>
            <View style={styles.timerContainer}>
              <Ionicons name="time-outline" size={20} color="#000" />
              <Text style={styles.timerText}>58:35</Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(attemptedQuestions.length / totalQuestions) * 100}%` }]} />

          </View>
        </View>

      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Question {currentQuestion + 1}</Text>
          <Text style={styles.questionText}>{questions[0].question}</Text>

          {questions[0].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === option && styles.optionSelected,
              ]}
              onPress={() => handleAnswerSelect(option)}
            >
              <Text style={[
                styles.optionText,
                selectedAnswer === option && styles.optionTextSelected,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.topicText}>{questions[0].topic}</Text>

          {showExplanation && (
            <View style={styles.explanationCard}>
              <Text style={styles.explanationTitle}>Explanation</Text>
              <Text style={styles.explanationText}>{questions[0].explanation}</Text>
              <TouchableOpacity onPress={() => setShowExplanation(false)}>
                <Text style={styles.explanationFooter}>Close Explanation</Text>
              </TouchableOpacity>
            </View>
          )}

          {!showExplanation && (
            <TouchableOpacity onPress={() => setShowExplanation(true)}>
              <Text style={styles.showExplanation}>Show Explanation</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButtonPrimary} onPress={handleNext}>
            <Text style={styles.navButtonTextPrimary}>Next</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.attemptedLabel}>Attempted Questions</Text>
        <View style={styles.questionGrid}>
          {Array.from({ length: totalQuestions }, (_, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.questionCircle,
                attemptedQuestions.includes(i) && styles.questionCircleAttempted,
                currentQuestion === i && styles.questionCircleCurrent,
              ]}
              onPress={() => handleQuestionJump(i)}
            >
              <Text style={[
                styles.questionCircleText,
                (attemptedQuestions.includes(i) || currentQuestion === i) && styles.questionCircleTextWhite,
              ]}>
                {i + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#001f3f',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
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
    flex: 1,
    paddingHorizontal: 20,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: '#001f3f',
    borderColor: '#001f3f',
  },
  optionText: {
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#fff',
  },
  topicText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
  },
  explanationCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  explanationFooter: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  showExplanation: {
    fontSize: 14,
    color: '#4169E1',
    textAlign: 'center',
    marginTop: 15,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  navButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#001f3f',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  navButtonPrimary: {
    flex: 1,
    backgroundColor: '#001f3f',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#001f3f',
    fontSize: 16,
    fontWeight: '600',
  },
  navButtonTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  attemptedLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  questionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 30,
  },
  questionCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionCircleAttempted: {
    backgroundColor: '#666',
    borderColor: '#666',
  },
  questionCircleCurrent: {
    backgroundColor: '#001f3f',
    borderColor: '#001f3f',
  },
  questionCircleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  questionCircleTextWhite: {
    color: '#fff',
  },
  progressInfo: {
    flex: 1,
    marginRight: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#001f3f',
    borderRadius: 4,
  },
});