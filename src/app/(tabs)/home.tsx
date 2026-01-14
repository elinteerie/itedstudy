import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    {
      title: 'Lecture Notes',
      subtitle: 'Get full access to your course outlines and read available topics',
      icon: 'book-outline',
      color: '#4A148C',
      route: '/notes'
    },
    {
      title: 'Past Question',
      subtitle: 'Get past questions, practice and ace your exams',
      icon: 'document-text-outline',
      color: '#1A237E',
      route: '/questions'
    },
    {
      title: 'C.G.P.A Calculator',
      subtitle: 'Calculate you semester GPA and cumulative GPA',
      icon: 'calculator-outline',
      color: '#0D47A1',
      route: '/cgpa/calculator'
    },
    {
      title: 'Uni Ai',
      subtitle: 'Your university Ai assistant',
      icon: 'sparkles-outline',
      color: '#B71C1C',
      route: '/ai'
    },
  ];

  const cards = [
    {
      title: 'Flash Cards',
      subtitle: 'Who is the software developer in the world currently',
      tags: ['AI', 'Recommendation on E-Marketing'],
      color: '#E3F2FD'
    },
    {
      title: 'App Update Available',
      subtitle: 'Check out the latest features and update availability',
      icon: 'notifications-outline',
      color: '#FFEBEE'
    },
    {
      title: 'Student Of the Semester',
      subtitle: 'Celebrating outstanding students of this semester',
      icon: 'trophy-outline',
      color: '#FFF3E0'
    },
    {
      title: 'Task/Refund',
      subtitle: 'Follow us on our platform',
      icons: ['logo-facebook', 'logo-twitter', 'logo-youtube'],
      color: '#E8F5E9'
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.greeting}>Ugwuanyanwu Emmanuel</Text>
          <View style={styles.headerIcons}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </View>
        </View>
        <Text style={styles.title}>Uni E-Study</Text>
        <Text style={styles.subtitle}>Best pathway to academic excellence</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cards.map((card, index) => (
          <View key={index} style={[styles.card, { backgroundColor: card.color }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.seeMore}>See more</Text>
            </View>
            <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            {card.tags && (
              <View style={styles.tags}>
                {card.tags.map((tag, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
            {card.icon && (
              <Ionicons name={card.icon as any} size={40} color="#666" style={styles.cardIcon} />
            )}
            {card.icons && (
              <View style={styles.socialIcons}>
                {card.icons.map((icon, i) => (
                  <Ionicons key={i} name={icon as any} size={24} color="#666" />
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: item.color }]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon as any} size={30} color="#fff" />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1A237E',
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    color: '#fff',
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeMore: {
    fontSize: 12,
    color: '#666',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  tags: {
    flexDirection: 'row',
    gap: 5,
  },
  tag: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  tagText: {
    fontSize: 10,
    color: '#666',
  },
  cardIcon: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  menuGrid: {
    gap: 15,
    paddingBottom: 20,
  },
  menuItem: {
    borderRadius: 15,
    padding: 20,
  },
  menuIconContainer: {
    marginBottom: 10,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  menuSubtitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
});