import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useListCoursesQuery } from '../components/services/userService';
import { useAppSelector } from '../components/redux/store';


// Custom Dropdown Component
const CustomDropdown = ({ label, value, options, onSelect, id }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ y: 0, height: 0 });

  const selectedLabel = options.find((o: any) => o.value === value)?.label || options[0]?.label;

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}
        onLayout={(event) => {
          const { y, height } = event.nativeEvent.layout;
          setButtonLayout({ y, height });
        }}
      >
        <Text style={styles.dropdownText} numberOfLines={1}>
          {selectedLabel}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          <ScrollView style={{ maxHeight: 220 }} nestedScrollEnabled>
            {options.map((option: any) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownItem,
                  option.value === value && styles.dropdownItemSelected,
                ]}
                onPress={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

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

  const examTypeOptions = [
    { label: 'Select type', value: '' },
    { label: 'Quiz', value: 'quiz' },
    { label: 'Exam', value: 'exam' }
  ];

  const topicOptions = [
    { label: 'Select Topic', value: '' },
    { label: 'All Topics', value: 'all' }
  ];

  const yearOptions = [
    { label: 'Select Year', value: '' },
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
    { label: '2025', value: '2025' }
  ];

  const timeOptions = [
    { label: '30 minutes', value: '30' },
    { label: '60 minutes', value: '60' },
    { label: '90 minutes', value: '90' },
    { label: '120 minutes', value: '120' }
  ];

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

              <ScrollView style={styles.modalScroll}>
                <CustomDropdown
                  id="examType"
                  label="Exam type"
                  value={examType}
                  options={examTypeOptions}
                  onSelect={setExamType}
                />

                <CustomDropdown
                  id="topic"
                  label="Topic"
                  value={topic}
                  options={topicOptions}
                  onSelect={setTopic}
                />

                <CustomDropdown
                  id="year"
                  label="Exam Year"
                  value={year}
                  options={yearOptions}
                  onSelect={setYear}
                />

                <CustomDropdown
                  id="time"
                  label="Time in Minutes"
                  value={timeMinutes}
                  options={timeOptions}
                  onSelect={setTimeMinutes}
                />
              </ScrollView>

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
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalScroll: {},
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 13, fontWeight: 'bold', width: "70%" },
  label: { fontSize: 14, marginBottom: 5, marginTop: 10 },
  beginButton: { backgroundColor: '#001f3f', borderRadius: 25, padding: 15, alignItems: 'center', marginTop: 10 },
  beginText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  // Custom Dropdown Styles
  dropdownWrapper: { marginBottom: 15, zIndex: 1 },


  dropdownContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  dropdownList: {
    marginTop: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',           // prevents content overflow
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemSelected: {
    backgroundColor: '#f0f8ff',   // light blue highlight for selected
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },
});