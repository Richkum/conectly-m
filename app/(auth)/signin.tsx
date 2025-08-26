import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignIn() {
  const router = useRouter();
  const { onLogin } = useAuth(); // Get the login function from context

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      // Call the login function from our auth context
      const result = await onLogin!(email, password);

      if (result.error) {
        Alert.alert("Sign In Error", result.msg);
      } else {
        // Login successful!
        // Alert.alert("Success", "logged in successfully!", [
        //   { text: "OK", onPress: () => router.replace("/(app)/chats") },
        // ]);
        console.log("Sign in successful");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
      console.error("Signin error:", error);
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
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
            editable={!isLoading} // Disable when loading
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
            editable={!isLoading} // Disable when loading
          />
        </View>

        <TouchableOpacity disabled={isLoading}>
          <Text
            className="text-primary dark:text-primary-dark text-right font-medium"
            style={{ opacity: isLoading ? 0.5 : 1 }} // Visual feedback
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View className="w-full mb-6">
        <TouchableOpacity
          onPress={handleSignIn}
          className="bg-primary dark:bg-primary-dark py-4 rounded-full mb-4 items-center justify-center"
          activeOpacity={0.8}
          disabled={isLoading} // Disable button when loading
          style={{ opacity: isLoading ? 0.7 : 1 }} // Visual feedback for disabled state
        >
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF" // White spinner for contrast on green
            />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Sign In
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Sign up redirect */}
      <View className="flex-row justify-center">
        <Text className="text-text-secondary dark:text-text-secondary-dark">
          Don't have an account?{" "}
        </Text>
        <TouchableOpacity
          onPress={handleSignUpRedirect}
          disabled={isLoading} // Disable when loading
        >
          <Text
            className="text-primary dark:text-primary-dark font-semibold"
            style={{ opacity: isLoading ? 0.5 : 1 }} // Visual feedback
          >
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
