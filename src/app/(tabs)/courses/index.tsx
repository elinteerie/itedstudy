import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Modal } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useListCoursesQuery } from '../../../components/services/userService';
import { useAppSelector } from '../../../components/redux/store';
import MathImage from "../../../assets/image/Maths.png";
import ChemImage from "../../../assets/image/Chem.png";
import BioImage from "../../../assets/image/Bio.png";
import PhyImage from "../../../assets/image/Physics.png";
import { Picker } from '@react-native-picker/picker';

const defaultImages: { [key: string]: any } = {
  'Mathematics': MathImage,
  'Chemistry': ChemImage,
  'Physics': PhyImage,
  'Biology': BioImage,
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('Courses');
  const token = useAppSelector((state) => state.auth.token);
  const { data: courses = [], isLoading, error } = useListCoursesQuery(token || '');

  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [examType, setExamType] = useState('');
  const [topic, setTopic] = useState('');
  const [year, setYear] = useState('');
  const [timeMinutes, setTimeMinutes] = useState('60');

  const handleBegin = () => {
    setShowModal(false);
    router.push({
      pathname: '/exam',
      params: { courseId: selectedCourse?.id, courseName: selectedCourse?.name, time: timeMinutes }
    });
  };

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
          <Text style={[styles.tabText, activeTab === 'Courses' && styles.activeTabText]}>Courses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Past Questions' && styles.activeTab]}
          onPress={() => setActiveTab('Past Questions')}
        >
          <Text style={[styles.tabText, activeTab === 'Past Questions' && styles.activeTabText]}>Past Questions</Text>
        </TouchableOpacity>
      </View>


      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#001f3f" style={{ marginTop: 50 }} />
        ) : error ? (
          <Text style={{ textAlign: 'center', marginTop: 50, color: 'red' }}>Failed to load courses</Text>
        ) : courses.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Ionicons name="school-outline" size={60} color="#ccc" />
            <Text style={{ color: '#666', marginTop: 15, fontSize: 16 }}>No courses available</Text>
          </View>
        ) : (
          courses.map((course: any) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              onPress={() => {
                if (activeTab === 'Courses') {
                  router.push({
                    pathname: '/(tabs)/courses/topics',
                    params: { courseName: course.name, courseId: course.id }
                  });
                } else {
                  setSelectedCourse(course);
                  setShowModal(true);
                }
              }}
            >
              <Image
                source={course.image ? { uri: course.image } : (defaultImages[course.name] || MathImage)}
                style={styles.courseImage}
              />
              <View style={styles.courseInfo}>
                <Text style={styles.courseLabel}>Course Title:</Text>
                <Text style={styles.courseTitle}>{course.name}</Text>
                <Text style={styles.courseLabel}>Course Code:</Text>
                <Text style={styles.courseCode}>{course.course_code || `${course.name?.slice(0, 4)} 101`}</Text>
              </View>
              <View style={styles.iconContainer}>
                <Ionicons name="flag" size={20} color="#000" style={styles.iconBtn} />
                <Ionicons name={course.free ? "lock-open" : "lock-closed"} size={20} color={course.free ? "#4CAF50" : "#000"} />
              </View>
            </TouchableOpacity>
          ))
        )}


        <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowModal(false)}>
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedCourse?.name}</Text>
                  <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Ionicons name="close" size={24} color="#FF0000" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Exam type</Text>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={examType} onValueChange={setExamType} style={styles.picker}>
                    <Picker.Item label="Select type" value="" />
                    <Picker.Item label="Quiz" value="quiz" />
                    <Picker.Item label="Exam" value="exam" />
                  </Picker>
                </View>

                <Text style={styles.label}>Topic</Text>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={topic} onValueChange={setTopic} style={styles.picker}>
                    <Picker.Item label="Select Topic" value="" />
                    <Picker.Item label="All Topics" value="all" />
                  </Picker>
                </View>

                <Text style={styles.label}>Exam Year</Text>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={year} onValueChange={setYear} style={styles.picker}>
                    <Picker.Item label="Select Year" value="" />
                    <Picker.Item label="2023" value="2023" />
                    <Picker.Item label="2024" value="2024" />
                    <Picker.Item label="2025" value="2025" />
                  </Picker>
                </View>

                <Text style={styles.label}>Time in Minutes</Text>
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={timeMinutes} onValueChange={setTimeMinutes} style={styles.picker}>
                    <Picker.Item label="30 minutes" value="30" />
                    <Picker.Item label="60 minutes" value="60" />
                    <Picker.Item label="90 minutes" value="90" />
                    <Picker.Item label="120 minutes" value="120" />
                  </Picker>
                </View>

                <TouchableOpacity style={styles.beginButton} onPress={handleBegin}>
                  <Text style={styles.beginText}>Begin</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, gap: 10 },
  tab: { paddingVertical: 10, paddingHorizontal: 25, borderRadius: 25, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0' },
  activeTab: { backgroundColor: '#001f3f', borderColor: '#001f3f' },
  tabText: { fontSize: 14, color: '#000', fontWeight: '500' },
  activeTabText: { color: '#fff' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  courseCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 3 },
  courseImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  courseInfo: { flex: 1, justifyContent: 'center' },
  courseLabel: { fontSize: 11, color: '#666', marginBottom: 2 },
  courseTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 5 },
  courseCode: { fontSize: 14, color: '#000', fontWeight: '500' },
  iconContainer: { justifyContent: 'space-around', alignItems: 'center' },
  iconBtn: { marginBottom: 10 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', paddingHorizontal: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 13, fontWeight: 'bold', width: "70%"},
  label: { fontSize: 14, marginBottom: 5, marginTop: 10 },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 15 },
  picker: { height: 50 },
  beginButton: { backgroundColor: '#001f3f', borderRadius: 25, padding: 15, alignItems: 'center', marginTop: 10 },
  beginText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default Index;