import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAppSelector } from '../../../components/redux/store';
import { useGetUserInfoQuery } from "../../../components/services/userService";

export default function SettingsScreen() {
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const user = useAppSelector((state) => state.user.user);
  const token = useAppSelector((state) => state.auth.token);
  const { data: userInfo } = useGetUserInfoQuery(token || '', {
    skip: !token,
  });
  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit My Bio',
      subtitle: 'Update the general profile',
      route: '/(tabs)/profile/editProfile',
    },
    {
      icon: 'lock-closed-outline',
      title: 'Password Reset',
      subtitle: 'Change your password',
      route: '/(tabs)/profile/changePassword',
    },
    {
      icon: 'key-outline',
      title: 'App Activation',
      subtitle: 'Get activated to unlock full access',
      route: '/(tabs)/profile/activate',
    },
    {
      icon: 'information-circle-outline',
      title: 'About Us',
      subtitle: 'Mission, Vision, Terms and Conditions',
      route: '/(tabs)/profile/about',
    },
    {
      icon: 'log-out-outline',
      title: 'Log out',
      subtitle: 'Sign out of your account',
      route: '/auth/login',
    },
  ];

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.push('/auth/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Text style={styles.activeLabel}>{userInfo?.active || user.activated ? 'Active' : 'Inactive'}</Text>
            <Text style={styles.profileName}>{userInfo?.full_name || user.full_name || 'Guest user'}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{userInfo?.level || user.level || '100'}</Text>
            <Text style={styles.statLabel}>LEVEL</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{userInfo?.department || user.department || 'Null'}</Text>
            <Text style={styles.statLabel}>DEPARTMENT</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{user.cgpa || '0.00'}</Text>
            <Text style={styles.statLabel}>C.G.P.A</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                if (item.title === 'Log out') {
                  setShowLogoutModal(true);
                } else {
                  router.push(item.route as any);
                }
              }}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon as any} size={24} color="#000" />
                </View>
                <View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {showLogoutModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.alertIcon}>
              <Ionicons name="alert-circle" size={40} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>Alert!</Text>
            <Text style={styles.modalMessage}>
              Are you really sure you want to sign out?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signOutButton}
                onPress={handleLogout}
              >
                <Text style={styles.signOutText}>Sign out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,

  },
  backButton: {
    marginBottom: 20,
    marginHorizontal: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#001f3f',
    padding: 20,
    marginBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: "#fff",
    marginTop: -60,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    marginBottom: 30,
  },
  profileHeader: {
    marginBottom: 20,
    alignItems: 'center',

  },
  activeLabel: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  profileName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  stat: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statValue: {
    color: '#00052D',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#00052D',
    fontSize: 11,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
  },


  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#001f3f',
    borderRadius: 15,
    padding: 30,
    width: '80%',
    alignItems: 'center',
  },
  alertIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  cancelButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelText: {
    color: '#001f3f',
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  signOutText: {
    color: '#fff',
    fontWeight: '600',
  },
});