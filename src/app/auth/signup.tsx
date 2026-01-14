import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';

export default function SignUpScreen() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [institution, setInstitution] = useState('');
    const [level, setLevel] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');

    const handleSignUp = () => {
        console.log('Sign Up:', { fullName, email, institution, level, department, password });
        router.push('/auth/verification');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <AntDesign name="arrow-left" size={24} color="black" />
            </TouchableOpacity>



            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Sign Up</Text>
                <Text style={styles.subtitle}>Enter your details to sign up</Text>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#999"
                        value={fullName}
                        onChangeText={setFullName}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Institution"
                        placeholderTextColor="#999"
                        value={institution}
                        onChangeText={setInstitution}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Level"
                        placeholderTextColor="#999"
                        value={level}
                        onChangeText={setLevel}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Department"
                        placeholderTextColor="#999"
                        value={department}
                        onChangeText={setDepartment}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Retype Password"
                        placeholderTextColor="#999"
                        value={retypePassword}
                        onChangeText={setRetypePassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                        <View style={styles.buttonContent}>
                            <View style={styles.checkCircle}>
                                <Text style={styles.checkMark}>✓</Text>
                            </View>
                            <Text style={styles.buttonText}>Finish</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push("/auth/login")}>
                            <Text style={styles.signInText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingTop: 50,
    },
    backButton: {
        marginBottom: 5,
    },
    backArrow: {
        fontSize: 24,
        color: '#000',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    form: {
        paddingBottom: 30,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#001f3f',
        borderRadius: 30,
        padding: 18,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkCircle: {
        backgroundColor: '#fff',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checkMark: {
        color: '#001f3f',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: '#666',
        fontSize: 14,
    },
    signInText: {
        color: '#001f3f',
        fontSize: 14,
        fontWeight: '600',
    },

});