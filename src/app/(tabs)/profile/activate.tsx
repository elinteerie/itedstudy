import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useActivateAccountMutation } from '../../../components/services/userService';
import Toast from 'react-native-toast-message';
import { useAppSelector, useAppDispatch } from '../../../components/redux/store';
import { setUserInfo } from '../../../components/redux/slices/userSlice';

export default function ActivateAppScreen() {
    const [activationCode, setActivationCode] = useState('');
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch();
    const [activateAccount, { isLoading }] = useActivateAccountMutation();

    const handleActivate = async () => {
        if (!activationCode || activationCode.length < 15) {
            Toast.show({ type: 'error', text1: 'Please enter a valid 15-digit activation code' });
            return;
        }
        if (!token) {
            Toast.show({ type: 'error', text1: 'Please login first' });
            return;
        }

        try {
            const response = await activateAccount({ token, activation_pin: activationCode }).unwrap();
            dispatch(setUserInfo({ activated: true }));
            Toast.show({ type: 'success', text1: 'Success', text2: response.message || 'Account activated successfully' });
            router.back();
        } catch (error: any) {
            Toast.show({ type: 'error', text1: 'Activation failed', text2: error?.data?.detail || error?.data?.message || 'Invalid activation code' });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Activate App</Text>
                <Text style={styles.subtitle}>access full app features</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>Enter your 15 digit activation code to access full app features</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Activation Code"
                        placeholderTextColor="#999"
                        value={activationCode}
                        onChangeText={setActivationCode}
                        maxLength={15}
                    />
                    <TouchableOpacity style={styles.activateButton} onPress={handleActivate} disabled={isLoading}>
                        <Text style={styles.activateText}>{isLoading ? 'Activating...' : 'Activate'}</Text>
                    </TouchableOpacity>

                    <Text style={styles.pinLabel}>To get your activation pin...</Text>

                    <View style={styles.paymentCard}>
                        <View style={styles.paymentHeader}>
                            <View style={styles.smallRectangle} />
                            <View style={styles.smallRectangle} />
                            <View style={styles.smallRectangle} />
                            <View style={[styles.smallRectangle, { width: 18 }]} />
                        </View>
                        <View style={styles.paymentInfo}>
                            <Text style={styles.paymentTitle}>Pay with Paystack</Text>
                            <Text style={styles.paymentAmount}>N2500</Text>
                        </View>
                    </View>

                    <View style={styles.bankDetails}>
                        <Text style={styles.bankTitle}>Pay Through Bank Transfer</Text>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>Amount:</Text><Text style={styles.detailValue}>N2500</Text></View>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>Bank Name:</Text><Text style={styles.detailValue}>Opay</Text></View>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>Account Number:</Text><Text style={styles.detailValue}>8188604438</Text></View>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>Account Name:</Text><Text style={styles.detailValue}>Ited Edu</Text></View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 50, paddingHorizontal: 20 },
    backButton: { marginBottom: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 30 },
    form: { paddingBottom: 30 },
    label: { fontSize: 14, color: '#000', marginBottom: 15, lineHeight: 20 },
    input: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 20 },
    activateButton: { backgroundColor: '#001f3f', borderRadius: 30, padding: 18, alignItems: 'center', marginBottom: 30 },
    activateText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    pinLabel: { fontSize: 14, fontWeight: '600', marginBottom: 15 },
    paymentCard: { backgroundColor: '#E3F2FD', borderRadius: 10, padding: 20, marginBottom: 20, elevation: 3, flexDirection: 'row', alignItems: 'center' },
    paymentHeader: { width: '30%', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 2 },
    paymentInfo: { flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' },
    smallRectangle: { height: 7, width: 35, backgroundColor: '#1758FF' },
    paymentTitle: { fontSize: 16, fontWeight: '600' },
    paymentAmount: { fontSize: 20, fontWeight: 'bold' },
    bankDetails: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 20 },
    bankTitle: { fontSize: 16, fontWeight: '600', marginBottom: 15 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    detailLabel: { fontSize: 14, color: '#666' },
    detailValue: { fontSize: 14, fontWeight: '600' },
});