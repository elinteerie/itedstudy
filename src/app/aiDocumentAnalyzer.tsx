import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useSummarisePdfMutation, useListAllAiQuery, useListAiContentQuery } from '../components/services/userService';
import { useAppSelector } from '../components/redux/store';
import Toast from 'react-native-toast-message';

export default function AiDocumentScreen() {
  const [document, setDocument] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [summary, setSummary] = useState('');
  const [selectedAiId, setSelectedAiId] = useState<number | null>(null);

  const token = useAppSelector((state) => state.auth.token);
  
  const [summarisePdf, { isLoading: isAnalyzing }] = useSummarisePdfMutation();
  const { data: allAiData } = useListAllAiQuery(token || '', { skip: !token });
  const { data: aiContent } = useListAiContentQuery(
    { token: token || '', ai_id: selectedAiId || 0 },
    { skip: !token || !selectedAiId }
  );

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setDocument(result.assets[0]);
        setSummary('');
        setSelectedAiId(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const analyzeDocument = async () => {
    if (!document || !token) {
      Toast.show({ type: 'error', text1: 'Please select a document and login' });
      return;
    }

    try {
      const file = {
        uri: document.uri,
        name: document.name,
        type: document.mimeType || 'application/pdf',
      } as any;

      const response = await summarisePdf({ token, file }).unwrap();
      setSummary(response.summary);
      Toast.show({ type: 'success', text1: 'Document analyzed successfully' });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Analysis failed',
        text2: error?.data?.message || 'Please try again',
      });
    }
  };

  const removeDocument = () => {
    setDocument(null);
    setSummary('');
    setSelectedAiId(null);
  };

  const viewAiContent = (aiId: number) => {
    setSelectedAiId(aiId);
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
          <Text style={styles.uploadSubtitle}>PDF only</Text>
          
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

        {allAiData && Array.isArray(allAiData) && allAiData.length > 0 && (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <Ionicons name="list-outline" size={24} color="#001f3f" />
              <Text style={styles.resultTitle}>Your AI Documents</Text>
            </View>
            {allAiData.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={styles.aiCard}
                onPress={() => viewAiContent(item.id)}
              >
                <Ionicons name="document-text-outline" size={20} color="#001f3f" />
                <Text style={styles.aiCardText} numberOfLines={2}>
                  {item.content.substring(0, 100)}...
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {aiContent && (
          <View style={styles.resultSection}>
            <View style={styles.resultHeader}>
              <Ionicons name="create-outline" size={24} color="#001f3f" />
              <Text style={styles.resultTitle}>AI Content Details</Text>
            </View>
            <Text style={styles.contentText}>{aiContent.content}</Text>
            {/* <Text style={styles.metaText}>User ID: {aiContent.user_id}</Text>
            <Text style={styles.metaText}>Content ID: {aiContent.id}</Text> */}
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
  contentText: { fontSize: 15, lineHeight: 24, color: '#333', marginBottom: 10 },
  metaText: { fontSize: 12, color: '#666', marginTop: 5 },
  aiCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 10, gap: 10 },
  aiCardText: { flex: 1, fontSize: 14, color: '#333' },
});