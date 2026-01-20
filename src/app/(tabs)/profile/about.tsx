import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AboutScreen() {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    console.log('Message sent:', message);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactText}>Contact Us</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Text style={styles.title}>About Us</Text>
        <Text style={styles.subtitle}>Let's to know more about Ited Education Software</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>The App</Text>
          <Text style={styles.sectionText}>
            Ited Educational Software offers interactive lessons, access to e-books, and quizzes to evaluate knowledge and personalized learning with adaptive lessons, progress tracking, and tailored recommendations.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mission</Text>
          <Text style={styles.sectionText}>
            Ited Educational Software offers interactive lessons, access to e-books, and quizzes to evaluate knowledge and personalized learning with adaptive lessons, progress tracking, and tailored recommendations.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vision</Text>
          <Text style={styles.sectionText}>
            Ited Educational Software offers interactive lessons, access to e-books, and quizzes to evaluate knowledge and personalized learning with adaptive lessons, progress tracking, and tailored recommendations.
          </Text>
        </View>

        <View style={styles.messageSection}>
          <Text style={styles.messageTitle}>Leave us a message</Text>
          
          <TextInput
            style={styles.messageInput}
            placeholder="Type message..."
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: '#001f3f',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  contactText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  messageSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  messageInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 15,
  },
  sendButton: {
    backgroundColor: '#001f3f',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});