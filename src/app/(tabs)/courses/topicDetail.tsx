import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useGetTopicContentQuery } from '../../../components/services/userService';
import { useAppSelector } from '../../../components/redux/store';
import Markdown from 'react-native-markdown-display';

const TopicDetail = () => {
  const { topicName, topicId, courseName } = useLocalSearchParams();
  const token = useAppSelector((state) => state.auth.token);
  const { data: topicContent, isLoading, error } = useGetTopicContentQuery({ token: token || '', topic_id: Number(topicId) });

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
            params: { topicId, topicName, courseName, fromTopic: 'true' }
          })}
        >
          <Text style={styles.pastQText}>Past Questions</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>{topicContent?.title || topicName}</Text>
            <Markdown style={markdownStyles}>
              {topicContent?.content || 'No content available.'}
            </Markdown>
          </View>

        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15, flex: 1 },
  pastQBtn: { backgroundColor: '#001f3f', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  pastQText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  scrollView: { flex: 1 },
  content: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  text: { fontSize: 14, lineHeight: 22, color: '#333' },
});

const markdownStyles = {
  body: { fontSize: 14, lineHeight: 22, color: '#333' },
  heading1: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  heading2: { fontSize: 18, fontWeight: 'bold', marginVertical: 8 },
  code_inline: { backgroundColor: '#f0f0f0', padding: 2, borderRadius: 3 },
  code_block: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5 },
};

export default TopicDetail;