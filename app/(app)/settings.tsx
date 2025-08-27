import LogoutButton from "@/components/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [statusPrivacy, setStatusPrivacy] = useState(false);

  const user = {
    name: "John Doe",
    status: "Available",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  };

  const handleEditProfile = () => {
    // router.push("/edit-profile");
  };

  const handleLogout = () => {
    // Handle logout logic
    router.replace("/(auth)/signin");
  };

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Section */}
      <View className="items-center px-6 py-10 border-b border-element-border dark:border-element-border-dark">
        <Image
          source={{ uri: user.avatar }}
          className="w-24 h-24 rounded-full mb-4"
        />
        <Text className="text-2xl font-bold text-text dark:text-text-dark mb-1">
          {user.name}
        </Text>
        <Text className="text-text-secondary dark:text-text-secondary-dark mb-6">
          {user.status}
        </Text>
        <TouchableOpacity
          onPress={handleEditProfile}
          className="bg-primary dark:bg-primary-dark px-6 py-3 rounded-full flex-row items-center"
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={18} color="white" />
          <Text className="text-white font-medium ml-2">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Account Settings */}
      <View className="px-6 py-6">
        <Text className="text-lg font-semibold text-text dark:text-text-dark mb-4">
          Account
        </Text>

        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-element-border dark:border-element-border-dark">
          <View className="flex-row items-center">
            <Ionicons
              name="key-outline"
              size={22}
              color={isDark ? "#8696A0" : "#54656F"}
            />
            <Text className="text-text dark:text-text-dark ml-4">Privacy</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "#8696A0" : "#54656F"}
          />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-element-border dark:border-element-border-dark">
          <View className="flex-row items-center">
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color={isDark ? "#8696A0" : "#54656F"}
            />
            <Text className="text-text dark:text-text-dark ml-4">Security</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "#8696A0" : "#54656F"}
          />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-element-border dark:border-element-border-dark">
          <View className="flex-row items-center">
            <Ionicons
              name="cloud-download-outline"
              size={22}
              color={isDark ? "#8696A0" : "#54656F"}
            />
            <Text className="text-text dark:text-text-dark ml-4">
              Data and Storage
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "#8696A0" : "#54656F"}
          />
        </TouchableOpacity>
      </View>

      {/* App Settings */}
      <View className="px-6 py-6">
        <Text className="text-lg font-semibold text-text dark:text-text-dark mb-4">
          App Settings
        </Text>

        <View className="flex-row items-center justify-between py-4 border-b border-element-border dark:border-element-border-dark">
          <View className="flex-row items-center">
            <Ionicons
              name="notifications-outline"
              size={22}
              color={isDark ? "#8696A0" : "#54656F"}
            />
            <Text className="text-text dark:text-text-dark ml-4">
              Notifications
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            thumbColor={notifications ? "#25D366" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81c784" }}
          />
        </View>

        <View className="flex-row items-center justify-between py-4 border-b border-element-border dark:border-element-border-dark">
          <View className="flex-row items-center">
            <Ionicons
              name="eye-outline"
              size={22}
              color={isDark ? "#8696A0" : "#54656F"}
            />
            <Text className="text-text dark:text-text-dark ml-4">
              Read Receipts
            </Text>
          </View>
          <Switch
            value={readReceipts}
            onValueChange={setReadReceipts}
            thumbColor={readReceipts ? "#25D366" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81c784" }}
          />
        </View>

        <View className="flex-row items-center justify-between py-4 border-b border-element-border dark:border-element-border-dark">
          <View className="flex-row items-center">
            <Ionicons
              name="people-outline"
              size={22}
              color={isDark ? "#8696A0" : "#54656F"}
            />
            <Text className="text-text dark:text-text-dark ml-4">
              Status Privacy
            </Text>
          </View>
          <Switch
            value={statusPrivacy}
            onValueChange={setStatusPrivacy}
            thumbColor={statusPrivacy ? "#25D366" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81c784" }}
          />
        </View>

        <View className="flex-row items-center justify-between py-4 border-b border-element-border dark:border-element-border-dark">
          <View className="flex-row items-center">
            <Ionicons
              name="moon-outline"
              size={22}
              color={isDark ? "#8696A0" : "#54656F"}
            />
            <Text className="text-text dark:text-text-dark ml-4">
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleColorScheme}
            thumbColor={isDark ? "#25D366" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81c784" }}
          />
        </View>
      </View>

      {/* Support Section */}
      <View className="px-6 py-6">
        <Text className="text-lg font-semibold text-text dark:text-text-dark mb-4">
          Support
        </Text>

        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-element-border dark:border-element-border-dark">
          <View className="flex-row items-center">
            <Ionicons
              name="help-circle-outline"
              size={22}
              color={isDark ? "#8696A0" : "#54656F"}
            />
            <Text className="text-text dark:text-text-dark ml-4">
              Help Center
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "#8696A0" : "#54656F"}
          />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-element-border dark:border-element-border-dark">
          <View className="flex-row items-center">
            <Ionicons
              name="information-circle-outline"
              size={22}
              color={isDark ? "#8696A0" : "#54656F"}
            />
            <Text className="text-text dark:text-text-dark ml-4">About</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? "#8696A0" : "#54656F"}
          />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View className="px-6 py-8">
        <LogoutButton />
        <Text className="text-text-secondary dark:text-text-secondary-dark text-center mt-6">
          Connectly v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}
