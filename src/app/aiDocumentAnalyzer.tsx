import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

export default function AiDocumentScreen() {
  const [document, setDocument] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [pastQuestions, setPastQuestions] = useState<{ id: number; question: string }[]>([]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setDocument(result.assets[0]);
        setSummary('');
        setGeneratedContent('');
        setPastQuestions([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const analyzeDocument = () => {
    if (!document) return;
    
    setIsAnalyzing(true);
    
    // TODO: Call your backend API here with the document
    // For now, simulating with timeout
    setTimeout(() => {
      setSummary('This document covers fundamental concepts in Computer Science including data structures, algorithms, and system design.');
      
      setGeneratedContent('Key Topics:\n\n1. Data Structures\n- Arrays and Linked Lists\n- Trees and Graphs\n\n2. Algorithms\n- Sorting and Searching\n- Graph Traversal');
      
      setPastQuestions([
        { id: 1, question: 'Explain the difference between a binary tree and a binary search tree.' },
        { id: 2, question: 'What is the time complexity of Quick Sort in the worst case?' },
        { id: 3, question: 'Describe how a hash table handles collisions.' },
        { id: 4, question: 'Compare and contrast DFS and BFS algorithms.' },
        { id: 5, question: 'What is Big O notation and why is it important?' },
      ]);
      
      setIsAnalyzing(false);
    }, 2000);
  };

  const removeDocument = () => {
    setDocument(null);
    setSummary('');
    setGeneratedContent('');
    setPastQuestions([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Uni AI</Text>
        <Text style={styles.headerSubtitle}>Your university AI assistant</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.uploadSection}>
          <Ionicons name="document-text" size={60} color="#001f3f" />
          <Text style={styles.uploadTitle}>Upload Document</Text>
          <Text style={styles.uploadSubtitle}>PDF, DOC, DOCX, TXT</Text>
          
          {!document ? (
            <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
              <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
              <Text style={styles.uploadButtonText}>Choose File</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.documentCard}>
              <View style={styles.documentInfo}>
                <Ionicons name="document" size={24} color="#001f3f" />
                <View style={styles.documentDetails}>
                  <Text style={styles.documentName}>{document.name}</Text>
                  <Text style={styles.documentSize}>{document.size ? (document.size / 1024).toFixed(2) : 'N/A'} KB</Text>
                </View>
              </View>
              <TouchableOpacity onPress={removeDocument}>
                <Ionicons name="close-circle" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
          )}

          {document && !isAnalyzing && !summary && (
            <TouchableOpacity style={styles.analyzeButton} onPress={analyzeDocument}>
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text style={styles.analyzeButtonText}>Analyze with AI</Text>
            </TouchableOpacity>
          )}
        </View>

        {isAnalyzing && (
          <View style={styles.loadingSection}>
            <ActivityIndicator size="large" color="#001f3f" />
            <Text style={styles.loadingText}>AI is analyzing your document...</Text>
          </View>
        )}

        {summary && (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <Ionicons name="book-outline" size={24} color="#001f3f" />
              <Text style={styles.resultTitle}>Summary</Text>
            </View>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {generatedContent && (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <Ionicons name="create-outline" size={24} color="#001f3f" />
              <Text style={styles.resultTitle}>Generated Content</Text>
            </View>
            <Text style={styles.contentText}>{generatedContent}</Text>
          </View>
        )}

        {pastQuestions.length > 0 && (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <Ionicons name="help-circle-outline" size={24} color="#001f3f" />
              <Text style={styles.resultTitle}>Generated Past Questions</Text>
            </View>
            {pastQuestions.map((item) => (
              <View key={item.id} style={styles.questionCard}>
                <View style={styles.questionNumber}>
                  <Text style={styles.questionNumberText}>{item.id}</Text>
                </View>
                <Text style={styles.questionText}>{item.question}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#d32f2f', paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  headerSubtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
  content: { flex: 1, padding: 20 },
  uploadSection: { backgroundColor: '#fff', borderRadius: 15, padding: 30, alignItems: 'center', marginBottom: 20, elevation: 3 },
  uploadTitle: { fontSize: 20, fontWeight: 'bold', color: '#001f3f', marginTop: 15 },
  uploadSubtitle: { fontSize: 14, color: '#666', marginTop: 5, marginBottom: 20 },
  uploadButton: { backgroundColor: '#d32f2f', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10, gap: 10 },
  uploadButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  documentCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, width: '100%', marginTop: 10 },
  documentInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  documentDetails: { flex: 1 },
  documentName: { fontSize: 14, fontWeight: '600', color: '#001f3f' },
  documentSize: { fontSize: 12, color: '#666', marginTop: 2 },
  analyzeButton: { backgroundColor: '#001f3f', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10, gap: 10, marginTop: 20 },
  analyzeButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  loadingSection: { backgroundColor: '#fff', borderRadius: 15, padding: 40, alignItems: 'center', marginBottom: 20 },
  loadingText: { fontSize: 16, color: '#001f3f', marginTop: 15, fontWeight: '500' },
  resultSection: { backgroundColor: '#fff', borderRadius: 15, padding: 20, marginBottom: 70, elevation: 3 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: '#001f3f' },
  summaryText: { fontSize: 15, lineHeight: 24, color: '#333' },
  contentText: { fontSize: 15, lineHeight: 24, color: '#333' },
  questionCard: { flexDirection: 'row', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 10, gap: 12 },
  questionNumber: { backgroundColor: '#001f3f', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  questionNumberText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  questionText: { fontSize: 15, color: '#333', flex: 1, lineHeight: 22 },
});