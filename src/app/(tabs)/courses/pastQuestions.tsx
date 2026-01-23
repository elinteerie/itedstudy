import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useGetPastQuestionsByTopicQuery, useGetPastQuestionsByCourseQuery } from '../../../components/services/userService';
import { useAppSelector } from '../../../components/redux/store';

interface SelectedAnswers { [questionId: number]: number; }
interface ShowAnswers { [questionId: number]: boolean; }

const PastQuestions = () => {
    const { courseName, courseId, topicId, fromTopic } = useLocalSearchParams();
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
    const [showAnswers, setShowAnswers] = useState<ShowAnswers>({});
    const token = useAppSelector((state) => state.auth.token);

    const { data: questions = [], isLoading, error } = fromTopic === 'true'
        ? useGetPastQuestionsByTopicQuery({ token: token || '', topic_id: Number(topicId) })
        : useGetPastQuestionsByCourseQuery({ token: token || '', course_id: Number(courseId) });

    const handleSelectAnswer = (questionId: number, optionIndex: number) => {
        setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleShowAnswer = (questionId: number) => {
        setShowAnswers((prev) => ({ ...prev, [questionId]: true }));
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#00052D" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{courseName} Past Questions</Text>
                <View style={styles.yearBadge}><Text style={styles.yearText}>YEAR</Text></View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#001f3f" style={{ marginTop: 50 }} />
                ) : error ? (
                    <Text style={{ textAlign: 'center', marginTop: 50, color: 'red' }}>Failed to load questions</Text>
                ) : questions.length === 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Ionicons name="help-circle-outline" size={60} color="#ccc" />
                        <Text style={{ color: '#666', marginTop: 15, fontSize: 16 }}>No questions available</Text>
                    </View>
                ) : (
                    questions.map((q: any, qIndex: number) => (
                        <View key={q.id} style={styles.questionCard}>
                            <Text style={styles.questionTitle}>Question {qIndex + 1}</Text>
                            <Text style={styles.questionText}>{q.question}</Text>
                            {(q.options || []).map((option: string, oIndex: number) => {
                                const isSelected = selectedAnswers[q.id] === oIndex;
                                const isCorrect = q.correctAnswer === oIndex;
                                const showCorrect = showAnswers[q.id] && isCorrect;
                                return (
                                    <TouchableOpacity
                                        key={oIndex}
                                        style={[styles.option, isSelected && styles.selectedOption, showCorrect && styles.correctOption]}
                                        onPress={() => handleSelectAnswer(q.id, oIndex)}
                                    >
                                        <View style={[styles.optionCircle, isSelected && styles.selectedCircle, showCorrect && styles.correctCircle]}>
                                            <Text style={[styles.optionLetter, (isSelected || showCorrect) && styles.selectedLetter]}>{String.fromCharCode(65 + oIndex)}</Text>
                                        </View>
                                        <Text style={[styles.optionText, (isSelected || showCorrect) && styles.selectedText]}>{option}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.showAnswerBtn} onPress={() => handleShowAnswer(q.id)}>
                                    <Text style={styles.showAnswerText}>Show answer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.lookUpBtn}>
                                    <Text style={styles.lookUpText}>LookUp</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { backgroundColor: '#fff', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { color: '#00052D', fontSize: 16, fontWeight: 'bold', flex: 1, marginLeft: 15 },
    yearBadge: { backgroundColor: '#00052D', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15 },
    yearText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    scrollView: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
    questionCard: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 3 },
    questionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    questionText: { fontSize: 14, marginBottom: 15, color: '#333' },
    option: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, marginBottom: 10, backgroundColor: '#f5f5f5' },
    selectedOption: { backgroundColor: '#001f3f' },
    correctOption: { backgroundColor: '#4CAF50' },
    optionCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#001f3f', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    selectedCircle: { backgroundColor: '#fff' },
    correctCircle: { backgroundColor: '#fff' },
    optionLetter: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    selectedLetter: { color: '#001f3f' },
    optionText: { fontSize: 14, color: '#333', flex: 1 },
    selectedText: { color: '#fff' },
    buttonRow: { flexDirection: 'row', gap: 10, marginTop: 15 },
    showAnswerBtn: { flex: 1, backgroundColor: '#001f3f', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    showAnswerText: { color: '#fff', fontWeight: '600' },
    lookUpBtn: { flex: 1, backgroundColor: '#001f3f', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    lookUpText: { color: '#fff', fontWeight: '600' },
});

export default PastQuestions;