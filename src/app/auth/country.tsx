import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function CountryScreen() {
  const [country, setCountry] = useState('');

  const handleNext = () => {
    router.push('/auth/school');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Country</Text>
      <Text style={styles.subtitle}>Select your residence</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={country}
          onValueChange={(value) => setCountry(value)}
          style={styles.picker}
        >
          <Picker.Item label="Country" value="" />
          <Picker.Item label="Nigeria" value="nigeria" />
          <Picker.Item label="Ghana" value="ghana" />
          <Picker.Item label="Kenya" value="kenya" />
          <Picker.Item label="South Africa" value="south-africa" />
          <Picker.Item label="United States" value="usa" />
          <Picker.Item label="United Kingdom" value="uk" />
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
    paddingHorizontal: 20,
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