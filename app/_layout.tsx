import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, router, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import React from "react";


export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();

  // Redirect to login if not authenticated and trying to access protected routes
  useEffect(() => {
    if (!isAuthenticated) {
      if (pathname && pathname.startsWith("/(tabs)")) {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, pathname]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerBackTitle: "Back",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          headerTintColor: colors.primary,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="parking/[id]" 
          options={{ 
            title: "Parking Details",
            presentation: "card",
          }} 
        />
        <Stack.Screen 
          name="booking/[id]" 
          options={{ 
            title: "Booking Details",
            presentation: "card",
          }} 
        />
        <Stack.Screen 
          name="checkout/[id]" 
          options={{ 
            title: "Checkout",
            presentation: "modal",
          }} 
        />
        <Stack.Screen 
          name="ticket" 
          options={{ 
            title: "Parking Ticket",
            presentation: "modal",
          }} 
        />
      </Stack>
    </>
  );
}