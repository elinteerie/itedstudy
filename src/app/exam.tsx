import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useGetPastQuestionsByCourseQuery } from '../components/services/userService';
import { useAppSelector } from '../components/redux/store';
import Toast from 'react-native-toast-message';

export default function ExamScreen() {
  const { courseId, courseName, time } = useLocalSearchParams();
  const token = useAppSelector((state) => state.auth.token);
  
  const { data: questions = [], isLoading, error } = useGetPastQuestionsByCourseQuery(
    { token: token || '', course_id: Number(courseId) },
    { skip: !token || !courseId }
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Number(time || 60) * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestion(index);
    setShowExplanation(false);
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const totalQuestions = questions.length;
    const attempted = Object.keys(selectedAnswers).length;
    let correct = 0;
    
    questions.forEach((q: any, idx: number) => {
      if (selectedAnswers[idx] === q.correctAnswer || selectedAnswers[idx] === q.options?.[q.correctAnswer]) {
        correct++;
      }
    });

    Toast.show({ type: 'success', text1: 'Exam Submitted', text2: `Score: ${correct}/${totalQuestions}` });
    router.back();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#001f3f" />
        <Text style={{ marginTop: 15, color: '#666' }}>Loading questions...</Text>
      </View>
    );
  }

  if (error || questions.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="document-text-outline" size={60} color="#ccc" />
        <Text style={styles.emptyText}>No questions available</Text>
        <Text style={styles.emptySubtext}>Check back later for questions</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQ = questions[currentQuestion] || {};
  const attemptedCount = Object.keys(selectedAnswers).length;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{courseName || 'Exam'}</Text>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.progressText}>{attemptedCount}/{questions.length}</Text>
            <View style={styles.timerContainer}>
              <Ionicons name="time-outline" size={20} color="#000" />
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(attemptedCount / questions.length) * 100}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Question {currentQuestion + 1}</Text>
          <Text style={styles.questionText}>{currentQ.question}</Text>

          {(currentQ.options || []).map((option: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, selectedAnswers[currentQuestion] === option && styles.optionSelected]}
              onPress={() => handleAnswerSelect(option)}
            >
              <Text style={[styles.optionText, selectedAnswers[currentQuestion] === option && styles.optionTextSelected]}>
                {String.fromCharCode(65 + index)}) {option}
              </Text>
            </TouchableOpacity>
          ))}

          {/* {currentQ.topic && <Text style={styles.topicText}>{currentQ.topic}</Text>} */}

          {showExplanation && currentQ.explanation && (
            <View style={styles.explanationCard}>
              <Text style={styles.explanationTitle}>Explanation</Text>
              <Text style={styles.explanationText}>{currentQ.explanation}</Text>
              <TouchableOpacity onPress={() => setShowExplanation(false)}>
                <Text style={styles.explanationFooter}>Close Explanation</Text>
              </TouchableOpacity>
            </View>
          )}

          {!showExplanation && currentQ.explanation && (
            <TouchableOpacity onPress={() => setShowExplanation(true)}>
              <Text style={styles.showExplanation}>Show Explanation</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.navButton} onPress={handlePrevious} disabled={currentQuestion === 0}>
            <Text style={[styles.navButtonText, currentQuestion === 0 && { color: '#ccc' }]}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButtonPrimary} onPress={handleNext} disabled={currentQuestion === questions.length - 1}>
            <Text style={styles.navButtonTextPrimary}>Next</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.attemptedLabel}>Attempted Questions</Text>
        <View style={styles.questionGrid}>
          {questions.map((_: any, i: number) => (
            <TouchableOpacity
              key={i}
              style={[styles.questionCircle, selectedAnswers[i] && styles.questionCircleAttempted, currentQuestion === i && styles.questionCircleCurrent]}
              onPress={() => handleQuestionJump(i)}
            >
              <Text style={[styles.questionCircleText, (selectedAnswers[i] || currentQuestion === i) && styles.questionCircleTextWhite]}>{i + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  submitButton: { backgroundColor: '#001f3f', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  submitText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  progressContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  progressInfo: { flex: 1 },
  progressText: { fontSize: 16, fontWeight: '600' },
  timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: '#000', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  timerText: { fontSize: 14, fontWeight: '600' },
  progressBar: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginTop: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#001f3f', borderRadius: 4 },
  content: { flex: 1, paddingHorizontal: 20 },
  questionCard: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  questionNumber: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  questionText: { fontSize: 16, marginBottom: 20, lineHeight: 24 },
  optionButton: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, marginBottom: 10 },
  optionSelected: { backgroundColor: '#001f3f', borderColor: '#001f3f' },
  optionText: { fontSize: 14 },
  optionTextSelected: { color: '#fff' },
  topicText: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 15 },
  explanationCard: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 15, marginTop: 15 },
  explanationTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  explanationText: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
  explanationFooter: { fontSize: 12, color: '#666', textAlign: 'center' },
  showExplanation: { fontSize: 14, color: '#4169E1', textAlign: 'center', marginTop: 15 },
  navigationButtons: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  navButton: { flex: 1, borderWidth: 1, borderColor: '#001f3f', borderRadius: 25, padding: 15, alignItems: 'center' },
  navButtonPrimary: { flex: 1, backgroundColor: '#001f3f', borderRadius: 25, padding: 15, alignItems: 'center' },
  navButtonText: { color: '#001f3f', fontSize: 16, fontWeight: '600' },
  navButtonTextPrimary: { color: '#fff', fontSize: 16, fontWeight: '600' },
  attemptedLabel: { fontSize: 14, fontWeight: '600', marginBottom: 15, textAlign: 'center' },
  questionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingBottom: 30 },
  questionCircle: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#000', alignItems: 'center', justifyContent: 'center' },
  questionCircleAttempted: { backgroundColor: '#666', borderColor: '#666' },
  questionCircleCurrent: { backgroundColor: '#001f3f', borderColor: '#001f3f' },
  questionCircleText: { fontSize: 14, fontWeight: '600' },
  questionCircleTextWhite: { color: '#fff' },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#666', marginTop: 20, textAlign: 'center' },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' },
  backBtn: { backgroundColor: '#001f3f', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25, marginTop: 20 },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});