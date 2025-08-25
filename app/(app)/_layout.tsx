import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarIcon: ({ color }) => (
          <Ionicons name="home" size={24} color={color} />
        ),
      }}
    >
      <Tabs.Screen
        name="chats"
        options={{ title: "chats", headerShown: false }}
      />
      <Tabs.Screen
        name="calls"
        options={{ title: "calls", headerShown: false }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "settings", headerShown: false }}
      />
    </Tabs>
  );
}
