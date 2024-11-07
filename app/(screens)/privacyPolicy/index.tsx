import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";

const PrivacyPolicy = () => {
  return (
    <LinearGradient colors={["#ffe7ba", "#fff5e6"]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={styles.heading}>Privacy Policy</Text>

        <Text style={styles.text}>
          <Text style={styles.boldText}>Effective Date: </Text>[Insert Date]
        </Text>

        <Text style={styles.text}>
          [App Name] ("we", "our", or "us") values your privacy. This Privacy
          Policy outlines how we collect, use, and protect your personal
          information when you use our services.
        </Text>

        <View style={styles.section}>
          <Text style={styles.subheading}>1. Information We Collect</Text>
          <Text style={styles.text}>
            We may collect the following types of information:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • Personal Identification Information (Name, Email, Phone number)
            </Text>
            <Text style={styles.listItem}>• Location data</Text>
            <Text style={styles.listItem}>
              • Usage data (App usage statistics, preferences)
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>2. How We Use Your Information</Text>
          <Text style={styles.text}>
            We use the information we collect for the following purposes:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • To provide, operate, and maintain the app and its features
            </Text>
            <Text style={styles.listItem}>
              • To improve user experience and perform analytics
            </Text>
            <Text style={styles.listItem}>
              • To communicate with you regarding updates, promotions, or
              support
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>3. Data Protection</Text>
          <Text style={styles.text}>
            We take the security of your personal information seriously and
            employ industry-standard security measures to protect your data.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>4. Sharing Your Information</Text>
          <Text style={styles.text}>
            We do not share or sell your personal data to third parties, except
            as required by law or with your consent.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>5. Your Rights</Text>
          <Text style={styles.text}>
            You have the right to access, correct, or delete your personal
            information. You can also opt out of promotional emails at any time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>6. Changes to This Policy</Text>
          <Text style={styles.text}>
            We may update this Privacy Policy from time to time. Any changes
            will be posted in this section with an updated effective date.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>7. Contact Us</Text>
          <Text style={styles.text}>
            If you have any questions about this Privacy Policy, please contact
            us at:
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
    backgroundColor: "transparent",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  subheading: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 15,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: "700",
  },
  section: {
    marginVertical: 15,
  },
  list: {
    marginLeft: 20,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
  },
  contact: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default PrivacyPolicy;
