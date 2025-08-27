import { Stack } from "expo-router";

export default function ScreenLayout() {
  return (
    <Stack>
      <Stack.Screen name="search" options={{ headerShown: false }} />
    </Stack>
  );
}
