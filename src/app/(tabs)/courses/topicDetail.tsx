import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

const TopicDetail = () => {
  const { topicName, courseName } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{topicName || 'Scalars'}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Scalars: A Detailed Overview</Text>
          
          <Text style={styles.heading}>Definition</Text>
          <Text style={styles.text}>
            A scalar is a quantity that is fully characterized by its magnitude alone. A scalar is always accompanied by a unit of measure, and it does not have direction component. Scalars are fundamental in various disciplines, including physics, mathematics, engineering, and computer science.
          </Text>

          <Text style={styles.heading}>Characteristics of Scalars</Text>
          <Text style={styles.text}>
            1. <Text style={styles.bold}>Magnitude Only:</Text> Scalars are defined solely by their magnitude. Unlike vectors, scalars do not possess direction.
          </Text>
          <Text style={styles.text}>
            2. <Text style={styles.bold}>Arithmetic Operations:</Text> Scalars can be added or subtracted by simple arithmetic operations. For example, adding two temperatures (20°C + 30°C = 50°C) or two masses (5 kg + 10 kg = 15 kg).
          </Text>
          <Text style={styles.text}>
            3. <Text style={styles.bold}>Multiplication and Division:</Text> Scalars can be multiplied or divided, yielding another scalar quantity. For instance, dividing distance by time gives speed, a scalar quantity.
          </Text>
          <Text style={styles.text}>
            4. <Text style={styles.bold}>Invariance under Coordinate System Changes:</Text> The value of a scalar remains unchanged irrespective of the coordinate system used, as they do not have direction.
          </Text>

          <Text style={styles.heading}>Examples of Scalar Quantities</Text>
          <Text style={styles.text}>
            1. <Text style={styles.bold}>Temperature:</Text> For instance, 25°C
          </Text>
          <Text style={styles.text}>
            2. <Text style={styles.bold}>Mass:</Text> Descriptive value like temperature is a measure of...
          </Text>
        </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default TopicDetail;