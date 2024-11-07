import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { updateUser, updateUserProfileImage } from "@/store/apps/users";
import { AppDispatch } from "@/store";

const { height, width } = Dimensions.get("window");

interface UserData {
  user_name: string;
  user_aadhar: string;
  user_pan: string;
  user_phone: string;
  user_city: string;
  user_address: string;
}

const EditProfile = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [profileImage, setProfileImage] = useState(
    user?.user_image || "https://dummyimage.com/100x100/007BFF/ffffff&text=User"
  );
  const [isEditing, setIsEditing] = useState(true);
  const [userData, setUserData] = useState({
    user_name: user?.user_name || "",
    user_aadhar: user?.user_aadhar || "",
    user_pan: user?.user_pan || "",
    user_phone: user?.user_phone || "",
    user_city: user?.user_city || "",
    user_address: user?.user_address || "",
  });

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0]?.uri;
      setProfileImage(imageUri);

      // Dispatch the update action to Redux
      await dispatch(
        updateUserProfileImage({
          user_image: { user_image: imageUri },
          user_id: Number(user?.user_id),
        })
      ).then(() => {
        Alert.alert("Profile image updated successfully");
      });
    }
  };

  const handleSave = async () => {
    const updatedUserData = {
      ...userData,
      user_email: String(user?.user_email),
    };

    console.log("Updated User Data:", updatedUserData);
    console.log("User ID:", user?.user_id);

    await dispatch(
      updateUser({ user: updatedUserData, user_id: Number(user?.user_id) })
    ).then(() => {
      Alert.alert("Profile updated successfully");
      setIsEditing(false);
    });
  };

  return (
    <LinearGradient colors={["#ffe7ba", "#fff5e6"]} style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleImagePick}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <Text style={styles.changeImageText}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Fields */}
        <View style={styles.profileFields}>
          {Object.keys(userData).map((key) => (
            <View key={key}>
              <Text style={styles.fieldLabel}>
                {key.replace(/_/g, " ").replace("user ", "").toUpperCase()}
              </Text>
              <TextInput
                style={styles.inputField}
                placeholder={`Enter ${key.replace(/_/g, " ")}`}
                placeholderTextColor="#aaa"
                value={userData[key as keyof UserData]}
                onChangeText={(text) =>
                  setUserData({ ...userData, [key as keyof UserData]: text })
                }
                editable={isEditing}
              />
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.optionButton} onPress={handleSave}>
              <MaterialIcons
                name="check-circle"
                size={30}
                color={"#333"}
                style={styles.optionButtonText}
              />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.03, 
  },
  profileHeader: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: width * 0.05, 
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 2,
  },
  profileImage: {
    width: width * 0.25, 
    height: width * 0.25,
    borderRadius: (width * 0.25) / 2,
    borderWidth: 2,
    borderColor: "#ffe7ba",
  },
  changeImageText: {
    textAlign: "center",
    color: "#ff7e00",
    fontSize: 12,
    marginTop: 8,
  },
  profileFields: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    padding: width * 0.04, 
    borderRadius: 30,
  },
  fieldLabel: {
    fontSize: width * 0.035, 
    color: "#333",
    fontWeight: "bold",
    marginBottom: 8,
  },
  inputField: {
    fontSize: width * 0.035, 
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.3, 
    borderRadius: 30,
    alignSelf: "center",
  },
  optionButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
});

export default EditProfile;
