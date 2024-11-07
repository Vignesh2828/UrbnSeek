import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { axiosInstance } from "@/store/httpclient";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: {
    user_id: number;
    user_email: string;
    user_role: string;
    user_name: string;
    user_image: string;
    user_city: string;
    user_aadhar: string;
    user_pan: string;
    user_phone: string;
    user_whatsapp: string;
    user_address: string;
  } | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    user_name: string,
    user_email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

interface JwtPayload {
  user_id: number;
  user_email: string;
  user_role: string;
  user_name: string;
  user_image: string;
  user_city: string;
  user_aadhar: string;
  user_pan: string;
  user_phone: string;
  user_whatsapp: string;
  user_address: string;
  iat: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{
    user_id: number;
    user_email: string;
    user_role: string;
    user_name: string;
    user_image: string;
    user_city: string;
    user_aadhar: string;
    user_pan: string;
    user_phone: string;
    user_whatsapp: string;
    user_address: string;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from SecureStore on startup
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync("jwt_token");
      if (storedToken) {
        setToken(storedToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
        console.log("storedToken", storedToken);
        // Decode token to get user details
        const decodedToken = jwtDecode<JwtPayload>(storedToken);
        setUser({
          user_id: decodedToken.user_id,
          user_email: decodedToken.user_email,
          user_role: decodedToken.user_role,
          user_name: decodedToken.user_name,
          user_image: decodedToken.user_image,
          user_city: decodedToken.user_city,
          user_aadhar: decodedToken.user_aadhar,
          user_pan: decodedToken.user_pan,
          user_phone: decodedToken.user_phone,
          user_whatsapp: decodedToken.user_whatsapp,
          user_address: decodedToken.user_address,
        });
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  // Login function
  const login = async (user_email: string, user_password: string) => {
    setIsLoading(true);
    const response = await axiosInstance.post("/api/users/login", {
      user_email,
      user_password,
    });
    const { token: receivedToken } = response.data;

    await SecureStore.setItemAsync("jwt_token", receivedToken);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${receivedToken}`;
    setToken(receivedToken);

    // Decode token to get user details
    const decodedToken = jwtDecode<JwtPayload>(receivedToken);
    setUser({
      user_id: decodedToken.user_id,
      user_email: decodedToken.user_email,
      user_role: decodedToken.user_role,
      user_name: decodedToken.user_name,
      user_image: decodedToken.user_image,
      user_city: decodedToken.user_city,
      user_aadhar: decodedToken.user_aadhar,
      user_pan: decodedToken.user_pan,
      user_phone: decodedToken.user_phone,
      user_whatsapp: decodedToken.user_whatsapp,
      user_address: decodedToken.user_address,
    });
    setIsLoading(false);
  };

  // Signup function
  const signup = async (
    user_name: string,
    user_email: string,
    user_password: string
  ) => {
    setIsLoading(true);
    const response = await axiosInstance.post("/api/users/register", {
      user_name,
      user_email,
      user_password,
    });
    const { token: receivedToken } = response.data;

    await SecureStore.setItemAsync("jwt_token", receivedToken);
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${receivedToken}`;
    setToken(receivedToken);

    // Decode token to get user details
    const decodedToken = jwtDecode<JwtPayload>(receivedToken);
    setUser({
      user_id: decodedToken.user_id,
      user_email: decodedToken.user_email,
      user_role: decodedToken.user_role,
      user_name: decodedToken.user_name,
      user_image: decodedToken.user_image,
      user_city: decodedToken.user_city,
      user_aadhar: decodedToken.user_aadhar,
      user_pan: decodedToken.user_pan,
      user_phone: decodedToken.user_phone,
      user_whatsapp: decodedToken.user_whatsapp,
      user_address: decodedToken.user_address,
    });
    setIsLoading(false);
  };

  // Logout function
  const logout = async () => {
    await SecureStore.deleteItemAsync("jwt_token");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
