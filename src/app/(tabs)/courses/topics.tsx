import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useGetCourseTopicsQuery } from '../../../components/services/userService';
import { useAppSelector } from '../../../components/redux/store';

const Topics = () => {
    const [activeTab, setActiveTab] = useState('Topics');
    const { courseName, courseId } = useLocalSearchParams();
    const token = useAppSelector((state) => state.auth.token);
    const { data: topics = [], isLoading, error } = useGetCourseTopicsQuery({ token: token || '', course_id: Number(courseId) });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{courseName || 'Course'}</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Topics' && styles.activeTab]}
                    onPress={() => setActiveTab('Topics')}
                >
                    <Text style={[styles.tabText, activeTab === 'Topics' && styles.activeTabText]}>Topics</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Take Test' && styles.activeTab]}
                    onPress={() => {
                        setActiveTab('Take Test');
                        router.push({ pathname: '/(tabs)/courses/pastQuestions', params: { courseName, courseId } });
                    }}
                >
                    <Text style={[styles.tabText, activeTab === 'Take Test' && styles.activeTabText]}>Take Test</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#001f3f" style={{ marginTop: 50 }} />
                ) : error ? (
                    <Text style={{ textAlign: 'center', marginTop: 50, color: 'red' }}>Failed to load topics</Text>

                ) : topics.length === 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Ionicons name="book-outline" size={60} color="#ccc" />
                        <Text style={{ color: '#666', marginTop: 15, fontSize: 16 }}>No topics available</Text>
                    </View>
                ) : (
                    topics.map((topic: any) => (
                        <TouchableOpacity
                            key={topic.id}
                            style={styles.topicCard}
                            onPress={() => router.push({
                                pathname: '/(tabs)/courses/topicDetail',
                                params: { topicName: topic.title, topicId: topic.id, courseName }
                            })}
                        >
                            <Text style={styles.topicText}>{topic.title}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
    tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, gap: 10 },
    tab: { paddingVertical: 10, paddingHorizontal: 25, borderRadius: 25, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0' },
    activeTab: { backgroundColor: '#001f3f', borderColor: '#001f3f' },
    tabText: { fontSize: 14, color: '#000', fontWeight: '500' },
    activeTabText: { color: '#fff' },
    scrollView: { flex: 1, paddingHorizontal: 20 },
    topicCard: { backgroundColor: '#fff', borderRadius: 10, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
    topicText: { fontSize: 15, fontWeight: '600', color: '#000' },
});

export default Topics;