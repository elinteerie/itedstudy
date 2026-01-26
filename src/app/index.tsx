import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAppSelector } from '../components/redux/store';

export default function App() {
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/onboarding');
    }
  }, [token]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#001f3f" />
    </View>
  );
}