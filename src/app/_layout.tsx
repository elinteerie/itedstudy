import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
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
  );
}