import { Stack } from 'expo-router';
import { persistor, store } from "../components/redux/store";
import { ActivityIndicator, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Toast from "react-native-toast-message";
import ActivityTracker from '../components/redux/ActivityTracker';

export default function RootLayout() {
  const LoadingSpinner = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} color={"red"} />
      </View>
    );
  };
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
         <ActivityTracker />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="availableCourses" />
            <Stack.Screen name="exam" />
            <Stack.Screen name="examResult" />
            <Stack.Screen name="aiDocumentAnalyzer" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <Toast />
        </PersistGate>
      </Provider>
    </>

  );
}