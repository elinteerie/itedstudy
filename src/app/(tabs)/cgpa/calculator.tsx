import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useAppDispatch } from '../../../components/redux/store';
import { setUserInfo } from '../../../components/redux/slices/userSlice';

interface Course {
    course: string;
    credit: string;
    grade: string;
}

const gradePoints: { [key: string]: number } = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };
const grades = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function LevelCalculatorScreen() {
    const { semester: initialSemester } = useLocalSearchParams();
    const [semester, setSemester] = useState<'first' | 'second'>((initialSemester as 'first' | 'second') || 'first');
    const [level, setLevel] = useState('100');
    const dispatch = useAppDispatch();

    const initialCourses: Course[] = Array(8).fill(null).map(() => ({ course: '', credit: '', grade: 'A' }));
    const [firstSemesterCourses, setFirstSemesterCourses] = useState<Course[]>([...initialCourses]);
    const [secondSemesterCourses, setSecondSemesterCourses] = useState<Course[]>([...initialCourses]);
    const [gpa, setGpa] = useState({ first: '0.00', second: '0.00', cgpa: '0.00' });

    const currentCourses = semester === 'first' ? firstSemesterCourses : secondSemesterCourses;
    const setCourses = semester === 'first' ? setFirstSemesterCourses : setSecondSemesterCourses;

    const updateCourse = (index: number, field: keyof Course, value: string) => {
        const updated = [...currentCourses];
        updated[index] = { ...updated[index], [field]: value };
        setCourses(updated);
    };

    const cycleGrade = (index: number) => {
        const updated = [...currentCourses];
        const currentIdx = grades.indexOf(updated[index].grade);
        updated[index] = { ...updated[index], grade: grades[(currentIdx + 1) % grades.length] };
        setCourses(updated);
    };

    const calculateGPA = () => {
        const validCourses = currentCourses.filter(c => c.credit && parseFloat(c.credit) > 0);
        if (validCourses.length === 0) {
            Toast.show({ type: 'error', text1: 'Please enter at least one course with credit' });
            return;
        }

        let totalCreditLoad = 0;
        let totalCredits = 0;

        validCourses.forEach(course => {
            const credit = parseFloat(course.credit);
            const point = gradePoints[course.grade] || 0;
            totalCreditLoad += credit * point;
            totalCredits += credit;
        });

        const semesterGPA = totalCredits > 0 ? (totalCreditLoad / totalCredits).toFixed(2) : '0.00';

        const newGpa = { ...gpa };
        if (semester === 'first') {
            newGpa.first = semesterGPA;
        } else {
            newGpa.second = semesterGPA;
        }

        const first = parseFloat(newGpa.first);
        const second = parseFloat(newGpa.second);

        if (first > 0 && second > 0) {
            newGpa.cgpa = ((first + second) / 2).toFixed(2);
        } else if (first > 0) {
            newGpa.cgpa = first.toFixed(2);
        } else if (second > 0) {
            newGpa.cgpa = second.toFixed(2);
        } else {
            newGpa.cgpa = '0.00';
        }

        setGpa(newGpa);
        Toast.show({ type: 'success', text1: `${semester === 'first' ? 'First' : 'Second'} Semester GPA: ${semesterGPA}` });
    };

    const saveRecord = async () => {
        if (parseFloat(gpa.cgpa) === 0) {
            Toast.show({ type: 'error', text1: 'Calculate GPA first before saving' });
            return;
        }

        try {
            const existing = await AsyncStorage.getItem('cgpa_records');
            const records = existing ? JSON.parse(existing) : [];

            const newRecord = {
                id: Date.now().toString(),
                level: `${level} Level`,
                firstGPA: gpa.first,
                secondGPA: gpa.second,
                cgpa: gpa.cgpa,
                createdAt: new Date().toISOString(),
            };

            records.push(newRecord);
            await AsyncStorage.setItem('cgpa_records', JSON.stringify(records));

            // Calculate total CGPA and update Redux
            const totalCGPA = records.reduce((sum: number, l: any) => sum + parseFloat(l.cgpa), 0) / records.length;
            dispatch(setUserInfo({ cgpa: totalCGPA.toFixed(2) }));

            Toast.show({ type: 'success', text1: 'Record saved successfully' });
            router.back();
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Failed to save record' });
        }
    };

    const handleSemesterChange = (sem: 'first' | 'second') => {
        setSemester(sem);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <View style={styles.levelSelector}>
                <Text style={styles.title}>{level} Level</Text>
                <View style={styles.levelBtns}>
                    {['100', '200', '300', '400', '500'].map(l => (
                        <TouchableOpacity key={l} onPress={() => setLevel(l)} style={[styles.levelBtn, level === l && styles.levelBtnActive]}>
                            <Text style={[styles.levelBtnText, level === l && styles.levelBtnTextActive]}>{l}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.semesterTabs}>
                <TouchableOpacity style={[styles.tab, semester === 'first' && styles.tabActive]} onPress={() => handleSemesterChange('first')}>
                    <Text style={[styles.tabText, semester === 'first' && styles.tabTextActive]}>First Semester</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, semester === 'second' && styles.tabActive]} onPress={() => handleSemesterChange('second')}>
                    <Text style={[styles.tabText, semester === 'second' && styles.tabTextActive]}>Second Semester</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.gpaDisplay}>
                <Text style={styles.gpaValue}>{semester === 'first' ? gpa.first : gpa.second}</Text>
                <Text style={styles.gpaLabel}>{semester === 'first' ? 'First' : 'Second'} Semester GPA | CGPA: {gpa.cgpa}</Text>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    style={styles.tableContainer}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.tableHeader}>
                        <Text style={[styles.headerText, { flex: 2 }]}>Course</Text>
                        <Text style={styles.headerText}>Credit</Text>
                        <Text style={styles.headerText}>Grade</Text>
                    </View>

                    {currentCourses.map((course, index) => (
                        <View key={index} style={styles.tableRow}>
                            <TextInput
                                style={styles.courseInput}
                                value={course.course}
                                onChangeText={(text) => updateCourse(index, 'course', text)}
                                placeholder="Course"
                                placeholderTextColor="#999"
                            />
                            <TextInput
                                style={styles.creditInput}
                                value={course.credit}
                                onChangeText={(text) => updateCourse(index, 'credit', text.replace(/[^0-9]/g, ''))}
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor="#999"
                                maxLength={1}
                            />
                            <TouchableOpacity style={styles.gradeButton} onPress={() => cycleGrade(index)}>
                                <Text style={styles.gradeText}>{course.grade}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.calculateButton} onPress={calculateGPA}>
                        <Text style={styles.calculateText}>Calculate GPA</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.saveButton} onPress={saveRecord}>
                        <Text style={styles.saveText}>Save Record</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 50, paddingHorizontal: 20 },
    backButton: { marginBottom: 15 },
    levelSelector: { marginBottom: 15 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    levelBtns: { flexDirection: 'row', gap: 8 },
    levelBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 15, backgroundColor: '#f0f0f0' },
    levelBtnActive: { backgroundColor: '#001f3f' },
    levelBtnText: { fontSize: 12, color: '#666', fontWeight: '600' },
    levelBtnTextActive: { color: '#fff' },
    semesterTabs: { flexDirection: 'row', marginBottom: 15, backgroundColor: '#e0e0e0', borderRadius: 25, padding: 4 },
    tab: { flex: 1, paddingVertical: 10, borderRadius: 22, alignItems: 'center' },
    tabActive: { backgroundColor: '#001f3f' },
    tabText: { fontSize: 13, fontWeight: '600', color: '#666' },
    tabTextActive: { color: '#fff' },
    gpaDisplay: { alignItems: 'center', marginBottom: 15 },
    gpaValue: { fontSize: 42, fontWeight: 'bold', color: '#001f3f' },
    gpaLabel: { fontSize: 12, color: '#666' },
    tableContainer: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 15, padding: 12 },
    tableHeader: { flexDirection: 'row', backgroundColor: '#001f3f', paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8, marginBottom: 10 },
    headerText: { color: '#fff', fontWeight: 'bold', fontSize: 13, flex: 1, textAlign: 'center' },
    tableRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
    courseInput: { flex: 2, backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 14, borderWidth: 1, borderColor: '#ddd' },
    creditInput: { flex: 0.8, backgroundColor: '#fff', borderRadius: 8, padding: 12, fontSize: 14, textAlign: 'center', borderWidth: 1, borderColor: '#ddd' },
    gradeButton: { flex: 0.8, backgroundColor: '#4CAF50', borderRadius: 8, alignItems: 'center', justifyContent: 'center', minHeight: 45 },
    gradeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    calculateButton: { backgroundColor: '#001f3f', borderRadius: 25, padding: 16, alignItems: 'center', marginTop: 15 },
    calculateText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    saveButton: { backgroundColor: '#4CAF50', borderRadius: 25, padding: 16, alignItems: 'center', marginTop: 10, marginBottom: 30 },
    saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});