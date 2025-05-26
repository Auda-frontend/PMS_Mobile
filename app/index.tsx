import React from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { Car } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

export default function LandingScreen() {
  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <>
      <StatusBar style="light" />
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" }}
        style={styles.background}
      >
        <View style={styles.overlay} />
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Car size={64} color="white" />
            <Text style={styles.appName}>ParkEase</Text>
          </View>
          
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Find and Book Parking Spots</Text>
            <Text style={styles.subtitle}>
              Discover available parking spots near you, book in seconds, and manage your parking with ease.
            </Text>
            
            <Button 
              title="Get Started" 
              onPress={handleGetStarted} 
              style={styles.button}
            />
            
            <Button 
              title="Already have an account? Log in" 
              variant="outline" 
              onPress={() => router.push("/login")} 
              style={styles.loginButton}
              textStyle={styles.loginButtonText}
            />
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
    marginTop: 12,
  },
  contentContainer: {
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 26,
  },
  button: {
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  loginButtonText: {
    color: "white",
  },
});