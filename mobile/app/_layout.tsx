import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";

const qc = new QueryClient();

export default function Root() {
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={qc}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="plan/new" options={{ title: "New Plan" }} />
          <Stack.Screen name="plan/view" options={{ title: "Plan" }} />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
