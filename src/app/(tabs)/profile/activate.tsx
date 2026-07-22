import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useActivateAccountMutation } from '../../../components/services/userService';
import Toast from 'react-native-toast-message';
import { useAppSelector, useAppDispatch } from '../../../components/redux/store';
import { setUserInfo } from '../../../components/redux/slices/userSlice';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAYSTACK_PUBLIC_KEY = 'pk_live_2459774595b58e1ea21e4195df313bf65ef32db1';
const PAYMENT_AMOUNT_KOBO = 200000;

export default function ActivateAppScreen() {
    const [activationCode, setActivationCode] = useState('');
    const [paymentEmail, setPaymentEmail] = useState('');
    const [paymentVisible, setPaymentVisible] = useState(false);
    const [paymentReference, setPaymentReference] = useState('');
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch();
    const [activateAccount, { isLoading }] = useActivateAccountMutation();

    const openPayment = () => {
        const email = paymentEmail.trim();
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            Toast.show({ type: 'error', text1: 'Enter a valid payment email' });
            return;
        }
        setPaymentVisible(true);
    };

    const paymentHtml = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>
      <script src="https://js.paystack.co/v1/inline.js"></script><script>
      function send(data){ window.ReactNativeWebView.postMessage(JSON.stringify(data)); }
      window.onload=function(){
        var handler=PaystackPop.setup({
          key:${JSON.stringify(PAYSTACK_PUBLIC_KEY)},
          email:${JSON.stringify(paymentEmail.trim())},
          amount:${PAYMENT_AMOUNT_KOBO},
          currency:'NGN',
          ref:'ITED-' + Date.now(),
          metadata:{custom_fields:[{display_name:'Product',variable_name:'product',value:'UniStudy Activation Pin'}]},
          callback:function(response){send({type:'success',reference:response.reference});},
          onClose:function(){send({type:'cancel'});}
        });
        handler.openIframe();
      };
      </script></body></html>`;

    const handlePaymentMessage = (event: any) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            setPaymentVisible(false);
            if (message.type === 'success') {
                setPaymentReference(message.reference || '');
                Toast.show({ type: 'success', text1: 'Payment received', text2: 'Your activation pin will be sent by email after verification' });
            }
        } catch {
            Toast.show({ type: 'error', text1: 'Unable to read payment response' });
        }
    };

    const handleActivate = async () => {
        console.log('Activation Code:', activationCode);
        if (!activationCode) {
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
                    <Text style={styles.label}>Enter your activation code to access full app features</Text>
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
                    <Text style={styles.deliveryText}>Purchase an activation pin for ₦2,000. After payment is verified, the pin will be delivered to the email address below.</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Payment Email"
                        placeholderTextColor="#999"
                        value={paymentEmail}
                        onChangeText={setPaymentEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TouchableOpacity style={styles.paymentCard} onPress={openPayment}>
                        <View style={styles.paymentHeader}>
                            <View style={styles.smallRectangle} />
                            <View style={styles.smallRectangle} />
                            <View style={styles.smallRectangle} />
                            <View style={[styles.smallRectangle, { width: 18 }]} />
                        </View>
                        <View style={styles.paymentInfo}>
                            <Text style={styles.paymentTitle}>Pay with Paystack</Text>
                            <Text style={styles.paymentAmount}>₦2,000</Text>
                        </View>
                    </TouchableOpacity>

                    {!!paymentReference && <Text style={styles.referenceText}>Payment reference: {paymentReference}{'\n'}Your activation pin will be delivered to {paymentEmail} after verification.</Text>}

                    <View style={styles.bankDetails}>
                        <Text style={styles.bankTitle}>Pay Through Bank Transfer</Text>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>Amount:</Text><Text style={styles.detailValue}>₦2,000</Text></View>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>Bank Name:</Text><Text style={styles.detailValue}>Opay</Text></View>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>Account Number:</Text><Text style={styles.detailValue}>8156604439</Text></View>
                        <View style={styles.detailRow}><Text style={styles.detailLabel}>Account Name:</Text><Text style={styles.detailValue}>Ogbonnaya Daniel Kalu</Text></View>
                    </View>
                </View>
            </ScrollView>

            <Modal visible={paymentVisible} animationType="slide" onRequestClose={() => setPaymentVisible(false)}>
                <SafeAreaView style={styles.paymentModal} edges={['top', 'bottom']}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Pay ₦2,000</Text>
                        <TouchableOpacity onPress={() => setPaymentVisible(false)}><Ionicons name="close" size={28} color="#fff" /></TouchableOpacity>
                    </View>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: paymentHtml, baseUrl: 'https://paystack.com' }}
                        onMessage={handlePaymentMessage}
                        javaScriptEnabled
                        domStorageEnabled
                    />
                </SafeAreaView>
            </Modal>
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
    deliveryText: { fontSize: 13, color: '#666', lineHeight: 19, marginBottom: 15 },
    paymentCard: { backgroundColor: '#E3F2FD', borderRadius: 10, padding: 20, marginBottom: 20, elevation: 3, flexDirection: 'row', alignItems: 'center' },
    paymentHeader: { width: '30%', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 2 },
    paymentInfo: { flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' },
    smallRectangle: { height: 7, width: 35, backgroundColor: '#1758FF' },
    paymentTitle: { fontSize: 16, fontWeight: '600' },
    paymentAmount: { fontSize: 20, fontWeight: 'bold' },
    referenceText: { color: '#1B5E20', fontSize: 12, lineHeight: 18, marginBottom: 20 },
    paymentModal: { flex: 1, backgroundColor: '#fff' },
    modalHeader: { backgroundColor: '#001f3f', marginTop: 8, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    bankDetails: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 20 },
    bankTitle: { fontSize: 16, fontWeight: '600', marginBottom: 15 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    detailLabel: { fontSize: 14, color: '#666' },
    detailValue: { fontSize: 14, fontWeight: '600' },
});
