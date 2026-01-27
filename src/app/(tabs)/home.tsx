import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import ProfileIcon2 from "../../assets/image/Male_User.png"
import Updates from "../../assets/image/Updates.png"
import { useAppSelector, useAppDispatch } from "../../components/redux/store";
import { setUserInfo } from '../../components/redux/slices/userSlice';

import {
  ProfileIcon, Instagram, Facebook, Telegram, Tiktok, UNIAI, CGPACalculator
  , PastQuestion, LectureNotes, UniversityCampus
} from '../../assets/svg';
import { useGetUserInfoQuery } from "../../components/services/userService";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const token = useAppSelector((state) => state.auth.token);
  const userName = useAppSelector((state) => state.user.user.full_name);
  const activationStatus = useAppSelector((state) => state.user.user.activated);

  const { data: userInfo, error: userInfoError } = useGetUserInfoQuery(token || '', {
    skip: !token,
  });
  console.log("User Info in HomeScreen:", userInfo, token);

  const dispatch = useAppDispatch();

  useEffect(() => {
  if (!token || userInfoError) {
    router.replace('/auth/login');
  }
}, [token, userInfoError]);

useEffect(() => {
  if (userInfo) {
    dispatch(setUserInfo({
      full_name: userInfo.full_name,
      email: userInfo.email,
      level: userInfo.level,
      department: userInfo.department,
      activated: userInfo.active,
   
    }));
  }
}, [userInfo, dispatch]);

  const menuItems = [
    {
      title: 'Lecture Notes',
      subtitle: 'Get full access to your course outlines and read available topics',
      Icon: LectureNotes,
      color: '#0F065E',
      route: '/(tabs)/courses'
    },
    {
      title: 'Past Question',
      subtitle: 'Get past questions, practice and ace your exams',
      Icon: PastQuestion,
      color: '#0F065E',
      route: '/availableCourses'
    },
    {
      title: 'C.G.P.A Calculator',
      subtitle: 'Calculate you semester GPA and cumulative GPA',
      Icon: CGPACalculator,
      color: '#0F065E',
      route: '/(tabs)/cgpa'
    },
    {
      title: 'Uni Ai',
      subtitle: 'Your university Ai assistant',
      Icon: UNIAI,
      color: '#F70000',
      route: '/aiDocumentAnalyzer'
    },
  ];

  const cards = [
    {
      title: 'Flash Cards',
      subtitle: 'Who is the software developer in the world currently',
      tags: [{ 'A)': 'Ogbonnaya Daniel Kalu - known as (Tech Daniel)' },
      { 'B)': 'Osunde Micheal known as (MichealKing)' }
      ],

      color: '#ffffff'
    },

  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{ userInfo?.full_name  || userName || 'Guest User'}</Text>
            <View style={{ flexDirection: "row", gap: 5, justifyContent: "flex-end", alignItems: "center" }}>
              <View style={styles.smallCircle} />

              <Text style={{ fontSize: 10, color: "white" }}>{ userInfo?.active || activationStatus ? "Active" : "Inactive"}</Text>
            </View>
          </View>

          <View style={styles.headerIcons}>

            {/* <ProfileIcon /> */}
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile/settings')}>
              <ProfileIcon />
              {/* <Image source={ProfileIcon2} /> */}
            </TouchableOpacity>
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
              <Text style={styles.seeMore}>See more ></Text>
            </View>
            <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            {card.tags && (
              <View style={styles.tags}>
                {card.tags && (
                  <View style={styles.tags}>
                    {card.tags.map((tag, i) => {
                      const key = Object.keys(tag)[0];
                      const value = Object.values(tag)[0];
                      return (
                        <View key={i} style={styles.tag}>
                          <Text style={styles.tagText}>{key}</Text>
                          <Text style={styles.tagText}>{value}</Text>
                        </View>
                      );
                    })}
                  </View>
                )}
                <Text style={styles.flashCardFooter}>Introduction to software development SOE 202</Text>
              </View>
            )}

          </View>
        ))}

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => {
            const IconComponent = item.Icon;// Extract the SVG component

            return (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { backgroundColor: item.color }]}
                onPress={() => router.push(item.route as any)}
              >
               <View style={{ width: "70%" }}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <IconComponent width={60} height={60} />
              </TouchableOpacity>
            );
          })}

        
        </View>

        <View style={styles.fifthContainer}>
          <TouchableOpacity style={styles.fourthContainer}>
            <View style={{ width: "80%" }}>
              <Text style={styles.seventhText}>App Update Available </Text>
              <Text style={styles.eighthText}>
                Ited Jambee latest software version available .{" "}
              </Text>
            </View>
            <View style={styles.smallContainer}>
              <Image source={Updates} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fourthContainer}
            onPress={() => {
              router.push("/(tabs)/home");
            }}
          >
            <View style={{ width: "80%" }}>
              <Text style={styles.seventhText}>
                Student Of the Semester{" "}
              </Text>
              <Text style={styles.eighthText}>
                Get updates on our program “Student of the semester"{" "}
              </Text>
            </View>
            <View style={styles.smallContainer}>
              <UniversityCampus />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fourthContainer}
            onPress={() => {
              router.push("/(tabs)/home");
            }}
          >
            <View style={{ width: "50%" }}>
              <Text style={styles.seventhText}>Task/Refund</Text>
              <Text style={styles.eighthText}>
                Follow on our social media platforms{" "}
              </Text>
            </View>
            <View
              style={{
                width: "50%",
                gap: 10,
                justifyContent: "flex-end",
                alignItems: "flex-start",
                flexDirection: "row",
              }}
            >
              <Instagram />
              <Telegram />
              <Facebook />
              <Tiktok />
              {/* <Image source={Instagram} />
              <Image source={Telegram} />
              <Image source={Facebook} />
              <Image source={Tiktok} /> */}

            </View>
          </TouchableOpacity>

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
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  smallCircle: {
    height: 5,
    width: 5,
    borderRadius: 5,
    backgroundColor: "#4DFF04"
  },
  greeting: {
    color: '#fff',
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 2,
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
    color: "#0F065E"
  },
  seeMore: {
    fontSize: 12,
    color: '#0F065E',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#0F065E',
    marginBottom: 10,
  },
  tags: {
    gap: 5,
  },
  tag: {
    backgroundColor: '#D9D9D9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    flexDirection: "row",
    gap: 5
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
    marginBottom: 20
  },
  menuItem: {
    borderRadius: 15,
    padding: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
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


  card: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    borderRadius: 15,
    padding: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  flashCardFooter: {
    fontSize: 10,
    color: '#0F065E',
    marginTop: 10,
    textAlign: 'right',
  },


  smallContainer: {
    width: "20%", justifyContent: "flex-end", flexDirection: "row"
  },

  fifthContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    elevation: 20,
    shadowOffset: {
      height: 20,
      width: 20,
    },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    shadowColor: "#333333",
    marginBottom: 50,
    borderWidth: 1,
    borderColor: "#00052D"
  },

  fourthContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  seventhText: {
    fontSize: 15,
    color: "#0F065E",
    textDecorationLine: "underline",
    fontWeight: "800",
  },
  eighthText: {
    fontSize: 10,
    color: "#0F065E",
    fontWeight: "600",
  },

});