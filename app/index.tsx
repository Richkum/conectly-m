import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LoadingScreen from "../components/LoadingScreen";
import ThemeToggleButton from "../components/ThemeToggleButton";

export default function Index() {
  const { authState, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (authState?.authenticated) {
        router.replace("/(app)/chats");
      }
      // else stay on landing page
    }
  }, [isLoading, authState?.authenticated]);

  const handleGetStarted = () => {
    router.push("/(auth)/signup");
  };

  const handleSignIn = () => {
    router.push("/(auth)/signin");
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show landing page only if not authenticated and not loading
  return (
    <View className="flex-1 justify-center items-center bg-background dark:bg-background-dark p-6">
      {/* Logo/App Name */}
      <View className="items-center mb-12">
        <Text className="text-4xl font-bold text-primary dark:text-primary-dark mb-2">
          Connectly
        </Text>
        <Text className="text-lg text-text-secondary dark:text-text-secondary-dark">
          Connect with people that matter
        </Text>
      </View>

      {/* Illustration/Icon */}
      <View className="items-center mb-12">
        <View className="w-40 h-40 rounded-full bg-primary dark:bg-primary-dark justify-center items-center mb-4">
          <Text className="text-6xl text-white">💬</Text>
        </View>
        <Text className="text-center text-text dark:text-text-dark text-xl font-medium mt-4">
          Simple, Secure Messaging
        </Text>
        <Text className="text-center text-text-secondary dark:text-text-secondary-dark mt-2 px-4">
          Message your friends and family with end-to-end encryption
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="w-full px-4">
        <TouchableOpacity
          onPress={handleGetStarted}
          className="bg-primary dark:bg-primary-dark py-4 rounded-full mb-4 shadow-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Create Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignIn}
          className="border border-element-border dark:border-element-border-dark py-4 rounded-full"
          activeOpacity={0.8}
        >
          <Text className="text-primary dark:text-primary-dark text-center text-lg font-semibold">
            Sign In
          </Text>
        </TouchableOpacity>
      </View>

      {/* Theme Toggle */}
      <View className="absolute top-12 right-6">
        <ThemeToggleButton />
      </View>
    </View>
  );
}
