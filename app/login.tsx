import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons'; // Using icon library
import { LinearGradient } from 'expo-linear-gradient';

const Login = () => {
  const { login, signup } = useAuth();
  const { type } = useLocalSearchParams<{ type: string }>();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error);
      Alert.alert('Sign in failed', error.message);
    }
    setLoading(false);
  };

  const register = async () => {
    if (!userName || !email || !password) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await signup(userName, email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log(error);
      Alert.alert('Sign up failed', error.message);
    }
    setLoading(false);
  };

  return (
    <LinearGradient
    colors={["#e67e22", "#f5b041"]}
      style={styles.container}
    >
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <Text style={styles.title}>{type === 'login' ? 'Welcome back' : 'Create your account'}</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="email" size={20} color="#B0BEC5" style={styles.inputIcon} />
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            style={styles.inputField}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {type === 'register' && (
          <View style={styles.inputWrapper}>
            <MaterialIcons name="person" size={20} color="#B0BEC5" style={styles.inputIcon} />
            <TextInput
              autoCapitalize="none"
              placeholder="Username"
              style={styles.inputField}
              value={userName}
              onChangeText={setUserName}
            />
          </View>
        )}

        <View style={styles.inputWrapper}>
          <MaterialIcons name="lock" size={20} color="#B0BEC5" style={styles.inputIcon} />
          <TextInput
            autoCapitalize="none"
            placeholder="Password"
            style={styles.inputField}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      {type === 'login' ? (
        <TouchableOpacity onPress={signIn} style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>Login</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={register} style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>Create Account</Text>
        </TouchableOpacity>
      )}

      {type === 'login' && (
        <TouchableOpacity  style={styles.forgotPasswordLink}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 30,
    color: '#fff',
  },
  formContainer: {
    marginBottom: 30,
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
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
  btnPrimary: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  btnPrimaryText: {
    color: '#e67e22',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordLink: {
    alignSelf: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#fff',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
