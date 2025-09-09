import { Stack } from "expo-router";

export default function ConversationLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          title: "",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
