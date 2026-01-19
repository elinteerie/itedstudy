import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const Topics = () => {
    const [activeTab, setActiveTab] = useState('Topics');
    const { courseName } = useLocalSearchParams();

    const topics = [
        'Scalars',
        'Vectors',
        'Fundamental Units',
        'Kinematics',
        'Thermodynamics',
        'Motion',
        'Work, Force and Velocity',
        'Real Numbers',
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{courseName || 'Physics'}</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Topics' && styles.activeTab]}
                    onPress={() => setActiveTab('Topics')}
                >
                    <Text style={[styles.tabText, activeTab === 'Topics' && styles.activeTabText]}>
                        Topics
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'Take Test' && styles.activeTab]}
                    onPress={() => {
                        setActiveTab('Take Test');
                        router.push({
                            pathname: '/(tabs)/courses/pastQuestions',
                            params: { courseName }
                        });
                    }}
                >
                    <Text style={[styles.tabText, activeTab === 'Take Test' && styles.activeTabText]}>
                        Take Test
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {topics.map((topic, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.topicCard}
                        onPress={() => router.push({
                            pathname: '/(tabs)/courses/topicDetail',
                            params: { topicName: topic, courseName }
                        })}
                    >
                        <Text style={styles.topicText}>{topic}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 10,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 25,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    activeTab: {
        backgroundColor: '#001f3f',
        borderColor: '#001f3f',
    },
    tabText: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#fff',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    topicCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 18,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    topicText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
    },
});

export default Topics;