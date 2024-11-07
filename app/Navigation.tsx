// app/_layout.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Navigation() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        console.log('User is logged in', token);
        router.replace("/(tabs)");
      } else {
        router.replace('/');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
        <View style={{flex:1, justifyContent:'center', alignItems : 'center'}}>
            <Text>Loading...</Text>
        </View>
    )
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(screens)"
        options={{ headerShown: false }} 
      />
    </Stack>
  );
};

