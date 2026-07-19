import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import React from 'react';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useGetTopicContentQuery } from '../../../components/services/userService';
import { useAppSelector } from '../../../components/redux/store';

const TopicDetail = () => {
  const { topicName, topicId, courseName } = useLocalSearchParams();
  const token = useAppSelector((state) => state.auth.token);
  const { data: topicContent, isLoading, error } = useGetTopicContentQuery({ token: token || '', topic_id: Number(topicId) });
  const pdfUrl = topicContent?.content?.trim();
  const viewerUrl = pdfUrl && Platform.OS === 'android'
    ? `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(pdfUrl)}`
    : pdfUrl;

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
          <View style={styles.pdfContainer}>
            <View style={styles.pdfHeader}>
              <Text style={styles.sectionTitle}>{topicContent?.title || topicName}</Text>
            </View>
            <WebView
              source={{ uri: viewerUrl! }}
              style={styles.webView}
              originWhitelist={['*']}
              startInLoadingState
              renderLoading={() => <ActivityIndicator size="large" color="#001f3f" style={styles.loader} />}
            />
          </View>
        )}
      </View>
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
  pdfContainer: { flex: 1, backgroundColor: '#fff', margin: 12, borderRadius: 12, overflow: 'hidden' },
  pdfHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sectionTitle: { flex: 1, fontSize: 16, fontWeight: 'bold' },
  webView: { flex: 1 },
  loader: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
});

export default TopicDetail;
