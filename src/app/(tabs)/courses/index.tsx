import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import MathImage from "../../../assets/image/Maths.png";
import ChemImage from "../../../assets/image/Chem.png";
import BioImage from "../../../assets/image/Bio.png";
import PhyImage from "../../../assets/image/Physics.png";

const Index = () => {
  const [activeTab, setActiveTab] = useState('Courses');
  
  const courses = [
    { id: 1, title: 'Mathematics', code: 'Maths 101', image: MathImage },
    { id: 2, title: 'Chemistry', code: 'Chem 101', image: ChemImage },
    { id: 3, title: 'Physics', code: 'Phy 101', image: PhyImage },
    { id: 4, title: 'Biology', code: 'Bio 101', image: BioImage },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Courses' && styles.activeTab]}
          onPress={() => setActiveTab('Courses')}
        >
          <Text style={[styles.tabText, activeTab === 'Courses' && styles.activeTabText]}>
            Courses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Past Questions' && styles.activeTab]}
          onPress={() => setActiveTab('Past Questions')}
        >
          <Text style={[styles.tabText, activeTab === 'Past Questions' && styles.activeTabText]}>
            Past Questions
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.courseCard}
            onPress={() => router.push({
              pathname: '/(tabs)/courses/topics',
              params: { courseName: course.title }
            })}
          >
            <Image source={course.image} style={styles.courseImage} />
            <View style={styles.courseInfo}>
              <Text style={styles.courseLabel}>Course Title:</Text>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseLabel}>Course Code:</Text>
              <Text style={styles.courseCode}>{course.code}</Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="flag" size={20} color="#000" style={styles.iconBtn} />
              <Ionicons name="lock-closed" size={20} color="#000" />
            </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
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
  courseCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  courseInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  courseLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  courseCode: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  iconContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconBtn: {
    marginBottom: 10,
  },
});

export default Index;