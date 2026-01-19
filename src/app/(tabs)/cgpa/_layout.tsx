import { Stack } from 'expo-router';

export default function CGPALayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="calculator"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}