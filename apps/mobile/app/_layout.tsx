import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { SplashScreen } from "expo-router";
import { AuthProvider } from "@/contexts/AuthContext";
import { WashProvider } from "@/contexts/WashContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = new QueryClient();
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
  });

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <LocationProvider>
          <AuthProvider>
            <WashProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(modals)"
                  options={{ presentation: "modal" }}
                />
                <Stack.Screen name="+not-found" options={{ title: "Oops!" }} />
              </Stack>
              <StatusBar style="auto" />
            </WashProvider>
          </AuthProvider>
        </LocationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
