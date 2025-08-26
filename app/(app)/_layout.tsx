import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? "#111B21" : "#FFFFFF",
          borderTopColor: isDark ? "#2A3942" : "#E9EDEF",
          elevation: 8,
          shadowColor: isDark ? "#000" : "#64748b",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 4,
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarShowLabel: true,
        headerShown: false,
        tabBarActiveTintColor: isDark ? "#00A884" : "#25D366",
        tabBarInactiveTintColor: isDark ? "#8696A0" : "#54656F",
      }}
    >
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: "Calls",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "call" : "call-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
