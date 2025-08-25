import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    // Here you would typically handle registration
    console.log("Sign up with:", username, email, password);
    // After successful registration, you might navigate to the main app
    // router.replace("/(tabs)");
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
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View className="w-full mb-6">
        <TouchableOpacity
          onPress={handleSignUp}
          className="bg-primary dark:bg-primary-dark py-4 rounded-full mb-4"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Create Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sign in redirect */}
      <View className="flex-row justify-center">
        <Text className="text-text-secondary dark:text-text-secondary-dark">
          Already have an account?{" "}
        </Text>
        <TouchableOpacity onPress={handleSignInRedirect}>
          <Text className="text-primary dark:text-primary-dark font-semibold">
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
