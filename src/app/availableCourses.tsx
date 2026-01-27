import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useListCoursesQuery } from '../components/services/userService';
import { useAppSelector } from '../components/redux/store';

export default function AvailableCoursesScreen() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [examType, setExamType] = useState('');
  const [topic, setTopic] = useState('');
  const [year, setYear] = useState('');
  const [timeMinutes, setTimeMinutes] = useState('60');

  const token = useAppSelector((state) => state.auth.token);
  const { data: courses = [], isLoading, error } = useListCoursesQuery(token || '');

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleBegin = () => {
    setShowModal(false);
    router.push({
      pathname: '/exam',
      params: { courseId: selectedCourse?.id, courseName: selectedCourse?.name, time: timeMinutes }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available Courses</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#001f3f" style={{ marginTop: 50 }} />
        ) : error ? (
          <Text style={styles.emptyText}>Failed to load courses</Text>
        ) : courses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No courses available yet</Text>
            <Text style={styles.emptySubtext}>Check back later for available courses</Text>
          </View>
        ) : (
          courses.map((course: any, index: number) => (
            <TouchableOpacity
              key={course.id}
              style={[
                styles.courseCard,
                index === courses.length - 1 && { marginBottom: 60 }
              ]}
              onPress={() => handleCourseClick(course)}
            >
              <Text style={styles.courseText}>{course.name}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: '600', marginLeft: 10 },
  courseCard: { backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 15, padding: 20, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  courseText: { fontSize: 16, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#666', marginTop: 20, textAlign: 'center' },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' },
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