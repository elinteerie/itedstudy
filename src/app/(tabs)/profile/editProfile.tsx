import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Modal } from 'react-native';
import { useUpdateUserInfoMutation } from "../../../components/services/userService";
import { useAppSelector, useAppDispatch } from "../../../components/redux/store";
import Toast from "react-native-toast-message";
import { setUserInfo } from '../../../components/redux/slices/userSlice';
import { UpdateUserInfoRequestBody } from '../../../components/services/userService';
import { useGetUserInfoQuery } from "../../../components/services/userService";
import { useEffect } from 'react';

export default function EditProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const [showModal, setShowModal] = useState(false);

  const userFromState = useAppSelector((state) => state.user.user);
  const token = useAppSelector((state) => state.auth.token);
  const { data: userInfo } = useGetUserInfoQuery(token || '', {
    skip: !token,
  });

  useEffect(() => {
    if (userInfo) {
      if (userInfo.full_name) setFullName(userInfo.full_name || ''); else if (userFromState.full_name) setFullName(userFromState.full_name || '');
      setEmail(userInfo.email || '');
      setDepartment(userInfo.department || '');
      setLevel(userInfo.level || '');
    } else if (userFromState.full_name) {
      setFullName(userFromState.full_name || '');
      setEmail(userFromState.email || '');
      setDepartment(userFromState.department || '');
      setLevel(userFromState.level || '');
    }
  }, [userInfo, userFromState]);


  const dispatch = useAppDispatch();
  const [updateUserInfo, { isLoading: updating }] = useUpdateUserInfoMutation();
  console.log("Token in EditProfileScreen:", token, userInfo?.full_name);

  // const handleUpdate = () => {
  //   setShowModal(true);
  //   console.log('Update Profile:', { fullName, email, department, level });
  // };

  const handleUpdate = async () => {
    if (!token) {
      Toast.show({ type: "error", text1: "Not authenticated" });
      return;
    }
    console.log("Updating profile with:", { fullName, email, department, level });
    try {
      const payload: UpdateUserInfoRequestBody = {};

      if (fullName) payload.full_name = fullName;
      if (level) payload.level = level;
      if (department) payload.deparment = department;
      payload.university_id = Number(4);
      console.log(2)
      console.log("Payload for update:", payload);
      const res = await updateUserInfo({ token, body: payload }).unwrap();
      console.log("Update response:", res);

      // Optional: refresh user info or just update local state
      dispatch(setUserInfo({
        full_name: fullName,
        level,
        department,
        // university_id if you allow changing it
      }));

      setShowModal(true);
    } catch (err: any) {
      console.log("Update error:", err);
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: err?.data?.message || "Please try again",
      });
    }
  };

  const handleContinue = () => {
    setShowModal(false);
    router.push('/auth/login');
  };

  return (
    // <View style={styles.container}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Edit Profile</Text>
        <Text style={styles.subtitle}>Update your profile</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Department"
            placeholderTextColor="#999"
            value={department}
            onChangeText={setDepartment}
          />

          <TextInput
            style={styles.input}
            placeholder="Level"
            placeholderTextColor="#999"
            value={level}
            onChangeText={setLevel}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdate}
            disabled={updating || !token}
          >
            <View style={styles.buttonContent}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
              <Text style={styles.buttonText}>
                {updating ? "Updating..." : "Update Profile"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ alignItems: 'center', borderRadius: 20, height: 10, width: '50%', backgroundColor: 'white', marginBottom: 50 }} />
            </View>

            <Text style={styles.modalTitle}>Updated!!</Text>
            <Text style={styles.modalText}>
              Your profile information was updated successfully
            </Text>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
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
  backArrow: {
    fontSize: 24,
    color: '#000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    paddingBottom: 30,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#001f3f',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    backgroundColor: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkMark: {
    color: '#001f3f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#001f3f',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingTop: 2,
    paddingBottom: 50,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
  },
  continueText: {
    color: '#001f3f',
    fontSize: 16,
    fontWeight: '600',
  },
});