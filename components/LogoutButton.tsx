import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function LogoutButton() {
  const { onLogout } = useAuth();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [modalVisible, setModalVisible] = useState(false);

  // Color palette (can be imported from your theme file if available)
  const colors = {
    background: isDark ? "#1F2C33" : "#FFFFFF",
    text: isDark ? "#E9EDEF" : "#111B21",
    modalBg: isDark ? "#1F2C33" : "#FFFFFF",
    border: isDark ? "#2A3942" : "#E9EDEF",
    red: "#EA0038",
    redDark: "#FF5252",
    button: isDark ? "#00A884" : "#25D366",
    buttonText: "#FFFFFF",
    shadow: isDark ? "#111B21" : "#00000033",
  };

  const handleLogout = async () => {
    setModalVisible(false);
    await onLogout?.();
    router.replace("/(auth)/signin");
  };

  return (
    <>
      {/* The logout button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
        className="bg-functional-red-DEFAULT py-4 rounded-full items-center"
        style={{
          backgroundColor: colors.red,
          shadowColor: colors.shadow,
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        <Text className="text-white font-semibold text-lg">Log Out</Text>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: isDark ? "#111B21CC" : "#00000033" }}
        >
          <View
            className="w-80 p-6 rounded-2xl items-center"
            style={{
              backgroundColor: colors.modalBg,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          >
            <Ionicons
              name="log-out-outline"
              size={36}
              color={colors.red}
              style={{ marginBottom: 14 }}
            />
            <Text
              className="text-lg font-semibold mb-2 text-center"
              style={{ color: colors.text }}
            >
              Confirm Logout
            </Text>
            <Text
              className="text-text-secondary dark:text-text-secondary-dark text-center mb-6"
              style={{ color: isDark ? "#8696A0" : "#667781" }}
            >
              Are you sure you want to log out of your account?
            </Text>
            <View className="flex-row justify-between w-full">
              {/* Cancel button */}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
                className="flex-1 py-3 rounded-full items-center mr-2"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <Text
                  className="font-semibold"
                  style={{ color: colors.text, fontSize: 16 }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              {/* Confirm button */}
              <TouchableOpacity
                onPress={handleLogout}
                activeOpacity={0.8}
                className="flex-1 py-3 rounded-full items-center ml-2"
                style={{
                  backgroundColor: colors.red,
                }}
              >
                <Text
                  className="font-semibold"
                  style={{ color: colors.buttonText, fontSize: 16 }}
                >
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
