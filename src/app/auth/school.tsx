import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function SchoolScreen() {
  const [school, setSchool] = useState('');

  const handleNext = () => {
    router.push('/auth/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>School</Text>
      <Text style={styles.subtitle}>Select your school</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={school}
          onValueChange={(value) => setSchool(value)}
          style={styles.picker}
        >
          <Picker.Item label="Universities/Polytechnic" value="" />
          <Picker.Item label="University of Lagos" value="unilag" />
          <Picker.Item label="University of Ibadan" value="ui" />
          <Picker.Item label="Obafemi Awolowo University" value="oau" />
          <Picker.Item label="University of Benin" value="uniben" />
          <Picker.Item label="Covenant University" value="covenant" />
        </Picker>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 30,
    right: 30,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#001f3f',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  arrowCircle: {
    backgroundColor: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    color: '#001f3f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});