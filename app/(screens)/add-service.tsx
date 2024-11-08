import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { ADD_SERVICE } from "@/store/apps/services";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { AppDispatch } from "@/store";
import { REVERSE_GEO_TRACK } from "@/store/apps/reverseGeo";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "@/context/AuthContext";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { S3 } from "aws-sdk";

const AddService = () => {
  const auth = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // Added loading state
  const dispatch = useDispatch<AppDispatch>();

  const s3 = new S3({
    region: '',
    accessKeyId:'',
    secretAccessKey: ''
  });

  const uploadToS3 = async (uri: string): Promise<string | null> => {
    try {
      const fileName = uri.split("/").pop(); // Get the file name
      const fileExtension = fileName?.split(".").pop(); // Get file extension

      const fileBlob = await (await fetch(uri)).blob();

      const params = {
        Bucket: "",
        Key: `uploads/${fileName}`,
        Body: fileBlob,
        ContentType: `image/${fileExtension}`,
      };

      const data = await s3.upload(params).promise(); // Upload file to S3
      return data.Location; // Return the image URL from S3
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      return null;
    }
  };

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: userLocation.coords.latitude.toString(),
        longitude: userLocation.coords.longitude.toString(),
      });
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
      selectionLimit: 0,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!name || !description || !price || images.length === 0 || !category) {
        alert("Please fill all fields");
        return;
      }

      setLoading(true); // Start loading

      const uploadedImageUrls = await Promise.all(
        images.map((imageUri) => uploadToS3(imageUri))
      );
      const validImageUrls = uploadedImageUrls.filter((url) => url !== null);

      const serviceData = {
        user_id: String(auth.user?.user_id || 0),
        service_title: name,
        service_description: description,
        service_lat: Number(location.latitude),
        service_lon: Number(location.longitude),
        service_city: city,
        service_price: Number(price),
        service_category: category,
        service_images_urls: validImageUrls,
        service_completed_works_images: validImageUrls,
      };

      console.log("Service Data:", serviceData);

      await dispatch(ADD_SERVICE({ serviceData }));
      alert("Service added successfully!");

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImages([]);
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (location.latitude && location.longitude) {
      dispatch(
        REVERSE_GEO_TRACK({
          lat: Number(location.latitude),
          lon: Number(location.longitude),
        })
      )
        .then((res) => {
          const fetchedCity = res.payload?.address?.city;
          if (fetchedCity) {
            setCity(fetchedCity.toLowerCase());
          } else {
            console.error("City not found in response");
          }
        })
        .catch((error) => {
          console.error("Error fetching city:", error);
        });
    }
  }, [location]);

  return (
    <LinearGradient colors={["#ffe7ba", "#fff5e6"]} style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Add New Service</Text>

        <TextInput
          style={styles.input}
          placeholder="Service Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <TextInput
          style={styles.input}
          placeholder="Location (Lat, Long)"
          value={`Lat: ${location.latitude}, Long: ${location.longitude}`}
          editable={false}
        />

        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={setCity}
          editable={false}
        />

        <View style={styles.inputWrapper}>
          <MaterialIcons name="currency-rupee" size={20} color="#B0BEC5" style={styles.inputIcon} />
          <TextInput
            autoCapitalize="none"
            placeholder="Price"
            style={styles.inputField}
            value={price}
            onChangeText={setPrice}
          />
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            style={styles.picker}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Cleaning" value="cleaning" />
            <Picker.Item label="Plumbing" value="plumbing" />
            <Picker.Item label="Electrical" value="electrical" />
            <Picker.Item label="Teaching" value="teaching" />
            <Picker.Item label="Painting" value="painting" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
          <FontAwesome name="camera" size={24} color="#eb984e" />
          <Text style={styles.imageText}>Select Images</Text>
        </TouchableOpacity>

        {images.length > 0 && (
          <View style={styles.imagePreview}>
            {images.map((imageUri, index) => (
              <Image key={index} source={{ uri: imageUri }} style={styles.image} />
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading || city === ""}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Add Service</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default AddService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    height: 60,
    fontSize: 18,
    paddingVertical: 0,
    color: '#333',
  },
  input: {
    height: 60,
    borderColor: "#ffe7ba",
    borderWidth: 2,
    fontSize: 16,
    marginBottom: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: "#ffffff",
  },
  pickerContainer: {
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ffe7ba",
    marginBottom: 15,
  },
  picker: {
    height: "100%",
    width: "100%",
  },
  imagePicker: {
    height: 50,
    borderColor: "#eb984e",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    backgroundColor: "#ffe7ba",
  },
  imageText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#eb984e",
    fontWeight: "bold",
  },
  imagePreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#f39c12",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
