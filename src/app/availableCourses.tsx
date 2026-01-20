import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AvailableCoursesScreen() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [examType, setExamType] = useState('');
  const [topic, setTopic] = useState('');
  const [year, setYear] = useState('');
  const [timeMinutes, setTimeMinutes] = useState('');

  const courses = [
    'Cyber Security (CYB 201)',
    'Computer Science (CSC 202)',
    'Forensic (FRN 312)',
    'Mathematics (MTH 201)',
    'Mathematics (MTH 201)',
    'Chemistry (CHM 201)',
    'Physics (PHY 201)',
    'Real Numbers',
    'Information Technology (IFT 201)',
  ];

  const handleCourseClick = (course: string) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleBegin = () => {
    setShowModal(false);
    router.push('/exam');
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
        {courses.map((course, index) => (
          <TouchableOpacity
            key={index}
            style={styles.courseCard}
            onPress={() => handleCourseClick(course)}
          >
            <Text style={styles.courseText}>{course}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
         <TouchableOpacity 
    style={styles.modalOverlay} 
    activeOpacity={1} 
    onPress={() => setShowModal(false)}
  >
    <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedCourse}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
            
                <Ionicons name="close" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Exam type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={examType}
                onValueChange={setExamType}
                style={styles.picker}
              >
                <Picker.Item label="Select type" value="" />
                <Picker.Item label="Quiz" value="quiz" />
                <Picker.Item label="Exam" value="exam" />
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={topic}
                onValueChange={setTopic}
                style={styles.picker}
              >
                <Picker.Item label="Select Topic" value="" />
                <Picker.Item label="Topic 1" value="topic1" />
                <Picker.Item label="Topic 2" value="topic2" />
              </Picker>
            </View>

            <Text style={styles.label}>Exam Year</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={year}
                onValueChange={setYear}
                style={styles.picker}
              >
                <Picker.Item label="Select Year" value="" />
                <Picker.Item label="2023" value="2023" />
                <Picker.Item label="2024" value="2024" />
              </Picker>
            </View>

            <Text style={styles.label}>Time in Minutes</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>{timeMinutes || '60'}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontWeight: '600',
    marginLeft: 10,
  },
 courseCard: {
  backgroundColor: '#fff',
  marginHorizontal: 20,
  marginBottom: 15,
  padding: 20,
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
},
  courseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  inputText: {
    fontSize: 16,
  },
  beginButton: {
    backgroundColor: '#001f3f',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  beginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});