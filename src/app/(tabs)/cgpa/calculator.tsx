import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function LevelCalculatorScreen() {
    const [semester, setSemester] = useState<'first' | 'second'>('first');
    const [courses, setCourses] = useState([
        { course: '', credit: '', grade: '' },
        { course: '', credit: '', grade: '' },
        { course: '', credit: '', grade: '' },
        { course: '', credit: '', grade: '' },
        { course: '', credit: '', grade: '' },
        { course: '', credit: '', grade: '' },
        { course: '', credit: '', grade: '' },
        { course: '', credit: '', grade: '' },
    ]);

    const [gpa, setGpa] = useState({ first: '0.00', second: '0.00', cgpa: '0.00' });
    const [firstSemesterCourses, setFirstSemesterCourses] = useState([...courses]);
    const [secondSemesterCourses, setSecondSemesterCourses] = useState([...courses]);
    const gradePoints: { [key: string]: number } = {
        'A': 5.0,
        'B': 4.0,
        'C': 3.0,
        'D': 2.0,
        'E': 1.0,
        'F': 0.0,
    };

    const updateCourse = (index: number, field: string, value: string) => {
        const newCourses = [...courses];
        newCourses[index] = { ...newCourses[index], [field]: value };
        setCourses(newCourses);
    };

    const calculateGPA = () => {
        let totalPoints = 0;
        let totalCredits = 0;

        courses.forEach(course => {
            const credit = parseFloat(course.credit) || 0;
            const point = gradePoints[course.grade] || 0;
            totalPoints += credit * point;
            totalCredits += credit;
        });

        const currentGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

        const newGpa = { ...gpa };
        if (semester === 'first') {
            newGpa.first = currentGPA;
        } else {
            newGpa.second = currentGPA;
        }

        const first = parseFloat(newGpa.first);
        const second = parseFloat(newGpa.second);
        newGpa.cgpa = ((first + second) / 2).toFixed(2);

        setGpa(newGpa);
    };

    const handleSemesterChange = (sem: 'first' | 'second') => {
        if (sem === 'first') {
            setSecondSemesterCourses(courses);
            setCourses(firstSemesterCourses);
        } else {
            setFirstSemesterCourses(courses);
            setCourses(secondSemesterCourses);
        }
        setSemester(sem);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.title}>100 Level</Text>

            <View style={styles.semesterTabs}>
                <TouchableOpacity
                    style={[styles.tab, semester === 'first' && styles.tabActive]}
                    onPress={() => handleSemesterChange('first')}
                >
                    <Text style={[styles.tabText, semester === 'first' && styles.tabTextActive]}>
                        First Semester
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, semester === 'second' && styles.tabActive]}
                    onPress={() => handleSemesterChange('second')}
                >
                    <Text style={[styles.tabText, semester === 'second' && styles.tabTextActive]}>
                        Second Semester
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.gpaDisplay}>
                {/* <Text style={styles.gpaValue}>{gpa}</Text>
                <Text style={styles.gpaLabel}>Total G.P.A for First Semester</Text> */}
                <Text style={styles.gpaValue}>{semester === 'first' ? gpa.first : gpa.second}</Text>
                <Text style={styles.gpaLabel}>Total G.P.A for {semester === 'first' ? 'First' : 'Second'} Semester | CGPA: {gpa.cgpa}</Text>
            </View>


            <ScrollView style={styles.tableContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.tableHeader}>
                    <Text style={styles.headerText}>Course</Text>
                    <Text style={styles.headerText}>Credit</Text>
                    <Text style={styles.headerText}>Grade</Text>
                </View>

                {courses.map((course, index) => (
                    <View key={index} style={styles.tableRow}>
                        <TextInput
                            style={styles.courseInput}
                            value={course.course}
                            onChangeText={(text) => updateCourse(index, 'course', text)}
                            placeholder=""
                        />
                        <TextInput
                            style={styles.creditInput}
                            value={course.credit}
                            onChangeText={(text) => updateCourse(index, 'credit', text)}
                            keyboardType="numeric"
                            placeholder=""
                        />
                        <TouchableOpacity
                            style={styles.gradeButton}
                            onPress={() => {
                                const grades = ['A', 'B', 'C', 'D', 'E', 'F'];
                                const currentIndex = grades.indexOf(course.grade);
                                const nextGrade = grades[(currentIndex + 1) % grades.length];
                                updateCourse(index, 'grade', nextGrade);
                            }}
                        >
                            <Text style={styles.gradeText}>{course.grade || 'A'}</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity style={styles.calculateButton} onPress={calculateGPA}>
                    <Text style={styles.calculateText}>Calculate GPA</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    backButton: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    semesterTabs: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
        backgroundColor: '#B5B2B2',
        borderRadius: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    tabInactive: {
        backgroundColor: '#E0E0E0',
    },
    tabActive: {
        backgroundColor: '#001f3f',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    tabTextInactive: {
        color: '#666',
    },
    tabTextActive: {
        color: '#fff',
    },
    gpaDisplay: {
        alignItems: 'center',
        marginBottom: 20,
    },
    gpaValue: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    gpaLabel: {
        fontSize: 12,
        color: '#666',
    },
    tableContainer: {
        flex: 1,
        backgroundColor: '#D9D9D9',
        borderRadius: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 5,
        marginBottom: 10,
    },
    headerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        flex: 1,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        gap: 5,
        marginBottom: 8,
    },
    courseInput: {
        flex: 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#00052D',
    },
    creditInput: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        padding: 10,
        fontSize: 14,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#00052D',
    },
    gradeButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    gradeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    calculateButton: {
        backgroundColor: '#001f3f',
        borderRadius: 25,
        padding: 15,
        alignItems: 'center',
        marginVertical: 20,
        marginBottom: 30,
    },
    calculateText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});