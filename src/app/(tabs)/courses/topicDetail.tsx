import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Modal, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Pdf from 'react-native-pdf';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useGetTopicContentQuery } from '../../../components/services/userService';
import { useAppSelector } from '../../../components/redux/store';

const TopicDetail = () => {
  const { topicName, topicId, courseName } = useLocalSearchParams();
  const token = useAppSelector((state) => state.auth.token);
  const { data: topicContent, isLoading, error } = useGetTopicContentQuery({ token: token || '', topic_id: Number(topicId) });
  const [pdfVisible, setPdfVisible] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [localPdfUri, setLocalPdfUri] = useState('');
  const pdfUrl = topicContent?.content?.trim();

  useEffect(() => {
    if (!pdfUrl) return;

    let cancelled = false;
    setPdfError('');
    setLocalPdfUri('');
    setPdfVisible(true);

    const downloadPdf = async () => {
      try {
        const destination = `${FileSystem.cacheDirectory}topic-${topicId}-${Date.now()}.pdf`;
        const result = await FileSystem.downloadAsync(pdfUrl, destination);
        if (!cancelled) setLocalPdfUri(result.uri);
      } catch {
        if (!cancelled) setPdfError('Unable to download this PDF. Please try again.');
      }
    };

    downloadPdf();
    return () => { cancelled = true; };
  }, [pdfUrl, topicId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{topicName || 'Topic'}</Text>
        <TouchableOpacity
          style={styles.pastQBtn}
          onPress={() => router.push({
            pathname: '/(tabs)/courses/pastQuestions',
            params: { topicId, topicName, fromTopic: 'true' }
          })}
        >
          <Text style={styles.pastQText}>Past Questions</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.viewerContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#001f3f" style={{ marginTop: 50 }} />
        ) : error ? (
          <Text style={{ textAlign: 'center', marginTop: 50, color: 'red' }}>Failed to load content</Text>
        ) : !topicContent?.content ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Ionicons name="document-text-outline" size={60} color="#ccc" />
            <Text style={{ color: '#666', marginTop: 15, fontSize: 16 }}>No content available</Text>
          </View>
        ) : (
          <View style={styles.contentCard}>
            <Ionicons name="document-text-outline" size={64} color="#001f3f" />
            <Text style={styles.sectionTitle}>{topicContent?.title || topicName}</Text>
            <TouchableOpacity style={styles.viewButton} onPress={() => setPdfVisible(true)}>
              <Text style={styles.viewButtonText}>View PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal visible={pdfVisible} animationType="slide" statusBarTranslucent onRequestClose={() => setPdfVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={1}>{topicContent?.title || topicName || 'PDF'}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setPdfVisible(false)}>
              <Ionicons name="close" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
          {!localPdfUri && !pdfError && <ActivityIndicator size="large" color="#001f3f" style={styles.loader} />}
          {!!localPdfUri && !pdfError && (
            <Pdf
              source={{ uri: localPdfUri }}
              style={styles.pdf}
              horizontal={false}
              enablePaging={false}
              enableAntialiasing
              minScale={1}
              maxScale={5}
              fitPolicy={0}
              onError={() => setPdfError('Unable to load this PDF. Please try again.')}
            />
          )}
          {!!pdfError && <View style={styles.pdfError}><Ionicons name="alert-circle-outline" size={44} color="#d32f2f" /><Text style={styles.pdfErrorText}>{pdfError}</Text></View>}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  headerTitle: { fontSize: 14, fontWeight: 'bold', marginLeft: 15, flex: 1, marginRight: 18 },
  pastQBtn: { backgroundColor: '#001f3f', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  pastQText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  viewerContainer: { flex: 1 },
  contentCard: { backgroundColor: '#fff', margin: 20, padding: 30, borderRadius: 15, alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
  viewButton: { backgroundColor: '#001f3f', borderRadius: 24, paddingVertical: 13, paddingHorizontal: 30 },
  viewButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { backgroundColor: '#001f3f', paddingTop: Platform.OS === 'android' ? 40 : 8, paddingHorizontal: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center' },
  modalTitle: { flex: 1, color: '#fff', fontSize: 16, fontWeight: 'bold' },
  closeButton: { padding: 6, marginLeft: 10 },
  pdf: { flex: 1, width: '100%', backgroundColor: '#e8e8e8' },
  pdfError: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  pdfErrorText: { color: '#d32f2f', textAlign: 'center', marginTop: 12 },
  loader: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
});

export default TopicDetail;
