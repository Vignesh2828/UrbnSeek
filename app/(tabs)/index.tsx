import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  RefreshControl,
  Alert,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { GET_SERVICES } from "@/store/apps/services";
import CategoryCarousel from "@/components/CategoryCarousel";
import SearchService from "@/components/SearchService";
import Fuse from "fuse.js";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import { router } from "expo-router";
import { REVERSE_GEO_TRACK } from "@/store/apps/reverseGeo";
import * as Location from "expo-location";

const { width } = Dimensions.get('window');
const imageHeight = width * 9 / 16;

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10); // Track the current limit size
  const [loadingMore, setLoadingMore] = useState<boolean>(false); // Track loading state for infinite scroll
  const [location, setLocation] = useState<{ latitude: string; longitude: string }>({ latitude: "", longitude: "" });
  const [city, setCity] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number }>({});

  const servicesData = useSelector((state: RootState) => state.services.serviceList.data);
  const loading = useSelector((state: RootState) => state.services.serviceList.loading);
  const error = useSelector((state: RootState) => state.services.serviceList.error);

  useEffect(() => {
    fetchServices(limit);
  }, [limit]);

  const fetchServices = (currentLimit: number) => {
    setRefreshing(true);
    dispatch(GET_SERVICES({page : 1,  limit: currentLimit }))
      .finally(() => setRefreshing(false));
  };

  const loadMoreServices = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      setLimit((prevLimit) => prevLimit + 10);
      setLoadingMore(false);
    }
  };

  
  
  const locationFilteredServices = servicesData.filter((service) => service.service_city === city.toLowerCase());

  const fuse = new Fuse(locationFilteredServices, {
    keys: ["service_category", "service_title", "service_description"],
    includeScore: true,
    threshold: 0.3,
  });
  
  const filteredServices = searchTerm ? fuse.search(searchTerm).map(result => result.item) : locationFilteredServices;

  const handleScroll = (serviceId: string, event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentImageIndexes((prevState) => ({
      ...prevState,
      [serviceId]: index,
    }));
  };

    // Function to get user's location
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

    const reverse = async (lat: number, long: number) => {
      try {
        const response = await dispatch(
          REVERSE_GEO_TRACK({ lat: lat, lon: long })
        );
  
        if (
          response.payload &&
          response.payload.address &&
          response.payload.address.city
        ) {
          console.log("city", response.payload.address.city);
          setCity(response.payload.address.city);
        } else {
          console.log("City not found in reverse geocoding response.");
          setCity("");
        }
      } catch (error) {
        console.error("Error during reverse geocoding:", error);
        Alert.alert("Error fetching city from reverse geocoding");
      }
    };
    
    useEffect(() => {
      reverse(Number(location.latitude), Number(location.longitude));
    }, [location]);

  return (
    <LinearGradient colors={["#ffe7ba", "#fff6e5"]} style={styles.container}>
      <SearchService onSearch={setSearchTerm} />
      <CategoryCarousel />

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.service_id.toString()}
        renderItem={({ item: service }) => (
         <View style={styles.card}>
            <View>
              <FlatList
                data={service.service_images_urls}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.serviceImage} />
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                snapToAlignment="center"
                decelerationRate="fast"
                onScroll={(event) => handleScroll(String(service.service_id), event)}
                style={styles.carousel}
              />
              <View style={styles.imageCountContainer}>
                <Text style={styles.imageCountText}>
                  {currentImageIndexes[service.service_id] !== undefined
                    ? currentImageIndexes[service.service_id] + 1
                    : 1}/{service.service_images_urls.length}
                </Text>
              </View>
            </View>
             <Pressable
             key={service.service_id}
             style={({ pressed }) => [
               
               pressed && { opacity: 0.5 },
             ]}
             onPress={() => router.push(`/service-detail/${service.service_id}?city=${encodeURIComponent(city)}&userId=${service.user_id}`)}
             >
            <View style={styles.cardContent}>
              <Text style={styles.serviceName}>{service.service_title}</Text>
              <Text style={styles.serviceLocation}>{`${service.service_city}`}</Text>
              <Text style={styles.category}>{service.service_category}</Text>
              <Text style={styles.serviceDescription}>{service.service_description}</Text>
              <Text style={styles.servicePrice}>${service.service_price}</Text>
              
            </View>
          </Pressable>
            </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchServices(5)} />}
        onEndReached={loadMoreServices}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#f39c12" /> : null}
      />
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carousel: {
    width: width,
  },
  serviceImage: {
    width: width,
    height: imageHeight,
    resizeMode: 'cover',
  },
  imageCountContainer: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  imageCountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  serviceLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  category: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#fad7a0',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#f39c12',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
