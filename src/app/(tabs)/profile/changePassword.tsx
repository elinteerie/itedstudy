import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function ChangePasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdate = () => {
    console.log('Update password');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Change Password</Text>
      <Text style={styles.subtitle}>Update your password</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#999"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showPassword}
        />

        <TextInput
          style={[styles.input, { marginBottom: 10 }]}
          placeholder="Confirm New Password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setShowPassword(!showPassword)}
        >
          <View style={styles.checkbox}>
            {showPassword && <Ionicons name="checkmark" size={16} color="#001f3f" />}
          </View>
          <Text style={styles.checkboxLabel}>Show Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateText}>Update Password</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
  },
  form: {
    flex: 1,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 45,

  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-end",
    marginBottom: 100,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#001f3f',
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#000',
  },
  updateButton: {
    backgroundColor: '#001f3f',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
  },
  updateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});