import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useResendOtpMutation, useResetPasswordMutation } from "../../../components/services/userService";
import { useAppSelector } from "../../../components/redux/store";
import Toast from "react-native-toast-message";

export default function ChangePasswordScreen() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const userEmail = useAppSelector((state) => state.user.user.email);
  const [resendOtp, { isLoading: sendingOtp }] = useResendOtpMutation();
  const [resetPassword, { isLoading: resetting }] = useResetPasswordMutation();

  const handleRequestOtp = async () => {
    const emailToUse = email || userEmail;
    
    if (!emailToUse) {
      Toast.show({ type: "error", text1: "Please enter your email" });
      return;
    }

    try {
      await resendOtp({ email: emailToUse }).unwrap();
      setOtpSent(true);
      Toast.show({ type: "success", text1: "OTP sent to your email" });
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Failed to send OTP",
        text2: err?.data?.message || "Please try again",
      });
    }
  };

  const handleUpdate = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      Toast.show({ type: "error", text1: "Please fill all fields" });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match" });
      return;
    }

    const emailToUse = email || userEmail;

    try {
      await resetPassword({
        email: emailToUse,
        otp,
        password: newPassword,
      }).unwrap();

      Toast.show({ type: "success", text1: "Password changed successfully" });
      router.push('/auth/login');
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Password reset failed",
        text2: err?.data?.message || "Please try again",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Change Password</Text>
      <Text style={styles.subtitle}>Update your password</Text>

      <View style={styles.form}>
        {!userEmail && (
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!otpSent}
          />
        )}

        {!otpSent ? (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleRequestOtp}
            disabled={sendingOtp}
          >
            {sendingOtp ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.updateText}>Request OTP</Text>
            )}
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor="#999"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
            />

            <View style={{ position: 'relative' }}>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#999"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons name={showNewPassword ? "eye" : "eye-off"} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={{ position: 'relative' }}>
              <TextInput
                style={[styles.input, { marginBottom: 10 }]}
                placeholder="Confirm New Password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleRequestOtp}
              disabled={sendingOtp}
            >
              <Text style={styles.resendText}>
                {sendingOtp ? "Resending..." : "Resend OTP"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
              disabled={resetting}
            >
              {resetting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.updateText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
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
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: '#001f3f',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  updateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  resendButton: {
    alignItems: 'center',
    marginBottom: 10,
  },
  resendText: {
    color: '#001f3f',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});