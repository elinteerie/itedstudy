import { Stack } from 'expo-router';

export default function CoursesindexLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="topics" />
       <Stack.Screen name="topicDetail" />
      <Stack.Screen name="pastQuestions" />
    </Stack>
  );
}