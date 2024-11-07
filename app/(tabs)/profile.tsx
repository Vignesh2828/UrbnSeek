import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const scale = (size: number) => width / 450 * size; 

const Profile = () => {
  const { logout, user } = useAuth();
  const [profileImage, setProfileImage] = useState(
    user?.user_image || "https://dummyimage.com/100x100/007BFF/ffffff&text=User"
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
      console.log("User successfully logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const options = [
    { title: "Add Service", icon: "add-circle", onPress: () => router.push("/add-service") },
    { title: "My Service", icon: "view-column", onPress: () => router.push("/add-service") },
    { title: "Favorites", icon: "favorite", onPress: () => router.push("/") },
    { title: "Feedback", icon: "feedback", onPress: () => router.push("/") },
    { title: "Reports", icon: "insert-chart", onPress: () => router.push("/") },
    { title: "Privacy Policy", icon: "privacy-tip", onPress: () => router.push("/privacyPolicy") },
    { title: "Terms & Condtions", icon: "insert-drive-file", onPress: () => router.push("/termsAndConditions") },
    { title: "Logout", icon: "logout", onPress: handleLogout, color: "#ff4d00" },
  ];

  return (
    <LinearGradient colors={["#ffe7ba", "#fff5e6"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.user_name}</Text>
            <Text style={styles.userEmail}>{user?.user_email}</Text>
            <TouchableOpacity style={styles.editProfileButton} onPress={() => router.push("/editProfile")}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Options List */}
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={option.onPress}
            >
              <View style={styles.optionContent}>
                <MaterialIcons name={option.icon} size={25} color={option.color || "#333"} />
                <Text style={styles.optionText}>{option.title}</Text>
              </View>
              <FontAwesome name="angle-right" size={20} color="#888" />
            </TouchableOpacity>
          ))}
        </View>
        
      </ScrollView>
    </LinearGradient>
  );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: scale(20),
      paddingVertical: scale(30),
    },
    profileHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: scale(10),
      backgroundColor: "#FFFFFF",
      padding: scale(15),
      borderRadius: scale(30),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: scale(4),
      elevation: 4,
    },
    profileImage: {
      width: scale(120),
      height: scale(120),
      borderRadius: scale(60),
      borderWidth: scale(2),
      borderColor: "#ffe7ba",
    },
    userInfo: {
      flex: 1,
      marginLeft: scale(16),
    },
    userName: {
      fontSize: scale(22),
      fontWeight: "bold",
      color: "#333",
      marginBottom: scale(5),
    },
    userEmail: {
      fontSize: scale(14),
      color: "#777",
      marginBottom: scale(12),
    },
    editProfileButton: {
      backgroundColor: "#f5b041",
      paddingVertical: scale(8),
      paddingHorizontal: scale(30),
      borderRadius: scale(30),
      alignSelf: "flex-start",
    },
    editProfileText: {
      color: "#FFF",
      fontSize: scale(14),
      fontWeight: "500",
    },
    optionsContainer: {
      flex: 1,
      backgroundColor: "#FFFFFF",
      borderRadius: scale(30),
      paddingVertical: scale(10),
      paddingHorizontal: scale(5),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: scale(3),
      elevation: 3,
      marginTop: scale(20),
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: scale(12),
      paddingHorizontal: scale(15),
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    optionContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    optionText: {
      fontSize: scale(18),
      color: "#333",
      marginLeft: scale(15),
    },
  });
  
