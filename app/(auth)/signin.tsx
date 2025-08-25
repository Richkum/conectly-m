import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    // Here you would typically handle authentication
    console.log("Sign in with:", email, password);
    // After successful authentication, you might navigate to the main app
    // router.replace("/(tabs)");
  };

  const handleSignUpRedirect = () => {
    router.push("/(auth)/signup");
  };

  return (
    <View className="flex-1 justify-center bg-background dark:bg-background-dark p-6">
      {/* Header */}
      <View className="items-center mb-12">
        <Text className="text-3xl font-bold text-primary dark:text-primary-dark mb-2">
          Welcome Back
        </Text>
        <Text className="text-lg text-text-secondary dark:text-text-secondary-dark">
          Sign in to your account
        </Text>
      </View>

      {/* Form */}
      <View className="w-full mb-8">
        <View className="mb-6">
          <Text className="text-text dark:text-text-dark mb-2 font-medium">
            Email
          </Text>
          <TextInput
            className="bg-background-secondary dark:bg-background-secondary-dark rounded-lg p-4 text-text dark:text-text-dark border border-element-border dark:border-element-border-dark"
            placeholder="Enter your email"
            placeholderTextColor="#667781"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <Text className="text-text dark:text-text-dark mb-2 font-medium">
            Password
          </Text>
          <TextInput
            className="bg-background-secondary dark:bg-background-secondary-dark rounded-lg p-4 text-text dark:text-text-dark border border-element-border dark:border-element-border-dark"
            placeholder="Enter your password"
            placeholderTextColor="#667781"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity>
          <Text className="text-primary dark:text-primary-dark text-right font-medium">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View className="w-full mb-6">
        <TouchableOpacity
          onPress={handleSignIn}
          className="bg-primary dark:bg-primary-dark py-4 rounded-full mb-4"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Sign In
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sign up redirect */}
      <View className="flex-row justify-center">
        <Text className="text-text-secondary dark:text-text-secondary-dark">
          Don't have an account?{" "}
        </Text>
        <TouchableOpacity onPress={handleSignUpRedirect}>
          <Text className="text-primary dark:text-primary-dark font-semibold">
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
