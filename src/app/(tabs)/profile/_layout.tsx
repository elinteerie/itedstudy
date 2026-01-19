import { Stack } from 'expo-router';

export default function ProfileLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' }
            }}
        >
            <Stack.Screen
                name="settings"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="editProfile"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="changePassword"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="activate"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="about"
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    );
}