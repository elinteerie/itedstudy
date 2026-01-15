import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function VerificationScreen() {
  const [code, setCode] = useState(['', '', '', '', '']);
  const [showModal, setShowModal] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    setShowModal(true);
  };

  const handleResend = () => {
    console.log('Resend code');
  };

  const handleContinue = () => {
    setShowModal(false);
    router.push('/auth/country'); 
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Verification</Text>

      <View style={styles.iconContainer}>
       
        <Image source={require('../../assets/image/One_Time_Password.png')} style={styles.image} />
      </View>

      <Text style={styles.subtitle}>
        We have sent the verification code to your email address
      </Text>

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref; }}
            style={styles.codeInput}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.resendButton} onPress={handleResend}>
        <Text style={styles.resendText}>Resend</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{justifyContent: 'center', alignItems: 'center',}}>
              <View style={{ alignItems: 'center', borderRadius: 20, height: 10, width: '50%', backgroundColor: 'white', marginBottom: 50 }} />
            </View>
            
            <Text style={styles.modalTitle}>Verified!</Text>
            <Text style={styles.modalText}>
              Your email address has been verified. You can now login and enjoy your amazing courses
            </Text>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  image: { width: 80, height: 80, marginTop: 20 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resendButton: {
    alignSelf: 'center',
    marginBottom: 180
  },
  resendText: {
    color: '#666',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#001f3f',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
  },
  submitText: {
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