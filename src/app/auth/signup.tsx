import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import {
    useCreateUserMutation,
    useResendOtpMutation,
    useListUniversitiesQuery,
} from "../../components/services/userService";
import { useAppDispatch } from "../../components/redux/store";
import { loginUser, updateExpires } from "../../components/redux/slices/authSlice";
import Toast from "react-native-toast-message";
import { CreateUserRequestBody } from '../../components/services/userService';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [institution, setInstitution] = useState(''); // now holds university_id (string)
    const [level, setLevel] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRetypePassword, setShowRetypePassword] = useState(false);

    const dispatch = useAppDispatch();
    const [createUser, { isLoading: creating }] = useCreateUserMutation();
    const [resendOtp, { isLoading: resending }] = useResendOtpMutation();

    // const { data: universities = [], isLoading: loadingUnis, error } = useListUniversitiesQuery();
    const { data: universities = [], isLoading: loadingUnis, error } = useListUniversitiesQuery();
    console.log("Universities:", universities);

    const handleSignUp = async () => {

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Toast.show({ type: "error", text1: "Invalid email format" });
            return;
        }
        if (password !== retypePassword) {
            Toast.show({ type: "error", text1: "Passwords do not match" });
            return;
        }

        if (!email || !fullName || !institution || !level || !department || !password) {
            Toast.show({ type: "error", text1: "Please fill all fields" });
            return;
        }

        try {
            const payload: CreateUserRequestBody = {
                full_name: fullName,
                email,
                university_id: Number(institution),   // convert to number
                level,
                department,
                password,
            };

            const response = await createUser(payload).unwrap();

            dispatch(loginUser(response.access_token));
            dispatch(updateExpires(response.token_expires));

            await resendOtp({ email }).unwrap();

            Toast.show({
                type: "success",
                text1: "Account created",
                text2: "Check your email for OTP",
            });

            router.push({
                pathname: "/auth/verification",
                params: { email },
            });
        } catch (err: any) {
            const msg = err?.data?.message || err?.message || "Registration failed";
            Toast.show({ type: "error", text1: "Error", text2: msg });
        }
    };

    return (

        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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
                            placeholder="Email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <View style={{ position: 'relative' }}>
                            <TextInput
                                style={[styles.input, { color: '#000' }]}
                                placeholder="Password"
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                textContentType="none"
                                autoCorrect={false}
                                autoComplete="off"
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ position: 'relative' }}>
                            <TextInput
                                style={[styles.input, { color: '#000' }]}
                                placeholder="Retype Password"
                                placeholderTextColor="#999"
                                value={retypePassword}
                                onChangeText={setRetypePassword}
                                secureTextEntry={!showRetypePassword}
                                 textContentType="none"
                                autoCorrect={false}
                                autoComplete="off"
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowRetypePassword(!showRetypePassword)}
                            >
                                <Ionicons name={showRetypePassword ? "eye" : "eye-off"} size={20} color="#666" />
                            </TouchableOpacity>
                        </View>


                        <View style={styles.pickerContainer}>
                            {loadingUnis ? (
                                <ActivityIndicator size="small" color="#001f3f" style={{ padding: 15 }} />
                            ) : error ? (
                                <Text style={{ color: 'red', padding: 15 }}>Failed to load universities</Text>
                            ) : (
                                <Picker
                                    selectedValue={institution}
                                    onValueChange={(value) => setInstitution(value)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select University" value="" />
                                    {universities.map((uni) => (
                                        <Picker.Item
                                            key={uni.id}
                                            label={uni.name}
                                            value={uni.id.toString()}
                                        />
                                    ))}
                                </Picker>
                            )}
                        </View>

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





                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSignUp}
                            disabled={creating || resending || loadingUnis || !institution}
                        >
                            <View style={styles.buttonContent}>
                                <View style={styles.checkCircle}>
                                    <Text style={styles.checkMark}>✓</Text>
                                </View>
                                <Text style={styles.buttonText}>
                                    {creating || resending ? "Creating..." : "Finish"}
                                </Text>
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
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingTop: 40,
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
    pickerContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
    },
    picker: {
        height: 55,
        color: '#000',
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
});