import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

const TermsAndConditions = () => {
    return (
        <LinearGradient colors={["#ffe7ba", "#fff5e6"]} style={styles.container}>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer} >
            <Text style={styles.heading}>Terms and Conditions</Text>

            <Text style={styles.text}>
                Effective Date: [Insert Date]
            </Text>

            <Text style={styles.text}>
                By using [App Name] ("we", "our", or "us"), you agree to the following Terms and Conditions. Please read these terms carefully before using our services.
            </Text>

            <View style={styles.section}>
                <Text style={styles.subheading}>1. Acceptance of Terms</Text>
                <Text style={styles.text}>
                    By accessing or using our app, you agree to comply with these Terms and Conditions and our Privacy Policy. If you do not agree, you should not use the app.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subheading}>2. User Account</Text>
                <Text style={styles.text}>
                    To use certain features of the app, you may need to create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify us immediately if you suspect any unauthorized use of your account.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subheading}>3. Use of the App</Text>
                <Text style={styles.text}>
                    You agree to use the app only for lawful purposes and in accordance with these Terms. You must not use the app to engage in any illegal or harmful activities.
                </Text>
                <Text style={styles.text}>
                    You must not:
                </Text>
                <View style={styles.list}>
                    <Text style={styles.listItem}>• Violate any laws or regulations.</Text>
                    <Text style={styles.listItem}>• Engage in any fraudulent activities.</Text>
                    <Text style={styles.listItem}>• Attempt to hack, interfere with, or disrupt the app’s functionality.</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.subheading}>4. Intellectual Property</Text>
                <Text style={styles.text}>
                    All content in the app, including text, images, logos, and software, is owned by [App Name] or its licensors and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works of any part of the app without explicit permission from [App Name].
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subheading}>5. Limitation of Liability</Text>
                <Text style={styles.text}>
                    To the maximum extent permitted by law, [App Name] is not responsible for any damages arising from your use of the app or the inability to use the app, including direct, indirect, incidental, or consequential damages. This includes damages related to your device, loss of data, or any other related issues.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subheading}>6. Termination</Text>
                <Text style={styles.text}>
                    We may suspend or terminate your access to the app at any time for violation of these Terms, including any unlawful activity or breach of the terms outlined.
                </Text>
                <Text style={styles.text}>
                    Upon termination, you must immediately stop using the app and uninstall any copies you may have installed.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subheading}>7. Changes to Terms</Text>
                <Text style={styles.text}>
                    We reserve the right to update or modify these Terms at any time. Any changes will be effective immediately upon posting on this page. We encourage you to review these terms periodically to stay informed about updates.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subheading}>8. Governing Law</Text>
                <Text style={styles.text}>
                    These Terms and Conditions are governed by the laws of [Jurisdiction], and any disputes will be resolved in the appropriate courts located in [Location]. If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subheading}>9. Contact Us</Text>
                <Text style={styles.text}>
                    If you have any questions regarding these Terms and Conditions, please contact us at:
                </Text>
                <Text style={styles.contact}>[Contact Information]</Text>
            </View>
        </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    heading: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    subheading: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
        marginTop: 15,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    list: {
        marginLeft: 20,
        marginTop: 10,
    },
    listItem: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    contact: {
        fontSize: 16,
        color: '#0066CC',
        marginTop: 5,
    },
    section: {
        marginVertical: 15,
    },
});

export default TermsAndConditions;
