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

import { useAuth } from "../../context/AuthContext";

export default function SignUp() {
  const router = useRouter();
  const authContext = useAuth(); // Get the register function from context
  const { onRegister } = authContext;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSignUp = async () => {
    console.log("=== SignUp Process Started ===");

    if (!username || !email || !password) {
      console.log("Validation failed: Missing fields");
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    console.log("Auth context at signup:", authContext);
    console.log("onRegister availability:", !!onRegister);

    // Check if onRegister is available
    if (!onRegister) {
      console.error(
        "onRegister is undefined! AuthProvider is likely not wrapping this component."
      );
      Alert.alert(
        "Error",
        "Registration service is not available. Please check if AuthProvider is properly set up."
      );
      return;
    }

    console.log("Starting registration process...");
    setIsLoading(true); // Start loading

    try {
      console.log("Calling onRegister...");
      // Call the register function from our auth context
      const result = await onRegister(email, password, username);

      console.log("Registration result:", result);

      if (result.error) {
        console.log("Registration failed:", result.msg);
        Alert.alert("Registration Error", result.msg);
      } else {
        console.log("Registration successful!");
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => router.replace("/(app)/chats") },
        ]);
      }
    } catch (error) {
      console.error("Signup error caught:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      console.log("Registration process completed");
      setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  const handleSignInRedirect = () => {
    router.push("/(auth)/signin");
  };

  return (
    <View className="flex-1 justify-center bg-background dark:bg-background-dark p-6">
      {/* Header */}
      <View className="items-center mb-12">
        <Text className="text-3xl font-bold text-primary dark:text-primary-dark mb-2">
          Create Account
        </Text>
        <Text className="text-lg text-text-secondary dark:text-text-secondary-dark">
          Join Connectly today
        </Text>
      </View>

      {/* Form */}
      <View className="w-full mb-8">
        <View className="mb-6">
          <Text className="text-text dark:text-text-dark mb-2 font-medium">
            Username
          </Text>
          <TextInput
            className="bg-background-secondary dark:bg-background-secondary-dark rounded-lg p-4 text-text dark:text-text-dark border border-element-border dark:border-element-border-dark"
            placeholder="Choose a username"
            placeholderTextColor="#667781"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!isLoading} // Disable when loading
          />
        </View>

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
            placeholder="Create a password"
            placeholderTextColor="#667781"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading} // Disable when loading
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View className="w-full mb-6">
        <TouchableOpacity
          onPress={handleSignUp}
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
              Create Account
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Sign in redirect */}
      <View className="flex-row justify-center">
        <Text className="text-text-secondary dark:text-text-secondary-dark">
          Already have an account?{" "}
        </Text>
        <TouchableOpacity
          onPress={handleSignInRedirect}
          disabled={isLoading} // Disable when loading
        >
          <Text
            className="text-primary dark:text-primary-dark font-semibold"
            style={{ opacity: isLoading ? 0.5 : 1 }} // Visual feedback
          >
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
