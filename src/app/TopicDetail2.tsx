import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Markdown from 'react-native-markdown-display';

const TopicDetail2 = () => {
  const staticContent = `# Introduction to React Native

This is a sample markdown content with **bold text** and *italic text*.

## What is React Native?
React Native is a framework for building mobile applications using JavaScript and React.

### Key Features
- Cross-platform development
- Native performance
- Hot reloading
- Large community

### Code Example
Inline code: \`const x = 5;\`

\`\`\`javascript
function hello() {
  console.log("Hello World");
  return "Success";
}
\`\`\`

## Benefits
1. Write once, run anywhere
2. Fast development
3. Cost-effective

This demonstrates how markdown renders in your app.`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sample Topic</Text>
        <TouchableOpacity style={styles.pastQBtn}>
          <Text style={styles.pastQText}>Past Questions</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Introduction to React Native</Text>
          <Markdown style={markdownStyles}>
            {staticContent}
          </Markdown>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15, flex: 1 },
  pastQBtn: { backgroundColor: '#001f3f', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  pastQText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  scrollView: { flex: 1 },
  content: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 15, marginBottom: 70 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
});

const markdownStyles = {
  body: { fontSize: 14, lineHeight: 22, color: '#333' },
  heading1: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  heading2: { fontSize: 18, fontWeight: 'bold', marginVertical: 8 },
  code_inline: { backgroundColor: '#f0f0f0', padding: 2, borderRadius: 3 },
  code_block: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5 },
};

export default TopicDetail2;