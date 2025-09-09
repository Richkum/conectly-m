import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BACKEND_URL = "http://192.168.1.167:5000";
const DEFAULT_AVATAR = "https://i.pravatar.cc/150";

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
  };
  text: string;
  createdAt: string;
  isOwn?: boolean;
}

interface ChatData {
  _id: string;
  chatType: string;
  participants: Array<{
    user: {
      _id: string;
      name: string;
      profilePicture?: string;
      isOnline?: boolean;
    };
  }>;
}

export default function ConversationScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { authState } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  // Get chat ID from route params
  const { id: chatId } = useLocalSearchParams<{ id: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [otherUser, setOtherUser] = useState<any>(null);

  // Load chat data and messages when component mounts
  useEffect(() => {
    if (chatId && authState?.token) {
      loadChatData();
      loadMessages();
    }
  }, [chatId, authState?.token]);

  const loadChatData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${authState?.token}`,
        },
      });

      const chat: ChatData = response.data;
      setChatData(chat);

      // Find the other user in direct chats
      if (chat.chatType === "direct") {
        const other = chat.participants.find(
          (p) => p.user._id !== authState?.user.id
        );
        setOtherUser(other?.user);
      }
    } catch (error) {
      console.error("Error loading chat data:", error);
      Alert.alert("Error", "Could not load chat information");
    }
  };

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/chats/${chatId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${authState?.token}`,
          },
        }
      );

      const messagesData = response.data.map((msg: any) => ({
        ...msg,
        isOwn: msg.sender._id === authState?.user.id,
      }));

      setMessages(messagesData);

      // Scroll to bottom after loading messages
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !authState?.token || isSending) return;

    const tempId = `temp_${Date.now()}`;
    const tempMessage: Message = {
      _id: tempId,
      sender: {
        _id: authState.user.id!,
        name: "You",
      },
      text: messageText.trim(),
      createdAt: new Date().toISOString(),
      isOwn: true,
    };

    // Add message to UI immediately
    setMessages((prev) => [...prev, tempMessage]);
    const currentMessage = messageText;
    setMessageText("");
    setIsSending(true);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/chats/${chatId}/messages`,
        { text: currentMessage },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update with real message data
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...response.data, isOwn: true } : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove failed message and restore text
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
      setMessageText(currentMessage);
      Alert.alert("Error", "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => (
      <View
        className={`flex-row mb-4 ${
          item.isOwn ? "justify-end" : "justify-start"
        } px-4`}
      >
        {!item.isOwn && (
          <View className="w-8 h-8 rounded-full bg-primary dark:bg-primary-dark items-center justify-center mr-2 mt-1">
            {otherUser?.profilePicture ? (
              <Image
                source={{ uri: otherUser.profilePicture }}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <Text className="text-white text-xs font-semibold">
                {getInitials(otherUser?.name || "U")}
              </Text>
            )}
          </View>
        )}

        <View
          className={`max-w-[75%] px-3 py-2 rounded-2xl ${
            item.isOwn
              ? "bg-bubble-outgoing-DEFAULT dark:bg-bubble-outgoing-dark rounded-br-md"
              : "bg-bubble-incoming-DEFAULT dark:bg-bubble-incoming-dark rounded-bl-md"
          }`}
        >
          <Text
            className={`text-base leading-5 ${
              item.isOwn
                ? "text-text dark:text-white"
                : "text-text dark:text-text-dark"
            }`}
          >
            {item.text}
          </Text>
          <View className="flex-row items-center justify-end mt-1">
            <Text
              className={`text-xs ${
                item.isOwn
                  ? "text-text-tertiary dark:text-text-tertiary-dark"
                  : "text-text-secondary dark:text-text-secondary-dark"
              }`}
            >
              {formatTime(item.createdAt)}
            </Text>
            {item.isOwn && (
              <View className="ml-1">
                <Ionicons
                  name="checkmark-done"
                  size={14}
                  className="text-status-delivered"
                />
              </View>
            )}
          </View>
        </View>
      </View>
    ),
    [otherUser, isDark]
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6">
      <View className="w-20 h-20 rounded-full bg-primary dark:bg-primary-dark items-center justify-center mb-4">
        {otherUser?.profilePicture ? (
          <Image
            source={{ uri: otherUser.profilePicture }}
            className="w-20 h-20 rounded-full"
          />
        ) : (
          <Text className="text-white text-xl font-bold">
            {getInitials(otherUser?.name || "U")}
          </Text>
        )}
      </View>
      <Text className="text-lg font-semibold text-text dark:text-text-dark mb-2 text-center">
        Start your conversation with {otherUser?.name || "this user"}
      </Text>
      <Text className="text-text-secondary dark:text-text-secondary-dark text-center">
        Send a message to begin chatting
      </Text>
    </View>
  );

  const handleInputChange = (text: string) => {
    setMessageText(text);
  };

  if (isLoading && !chatData) {
    return (
      <View className="flex-1 bg-background-chat dark:bg-background-chat-dark items-center justify-center">
        <ActivityIndicator
          size="large"
          color={isDark ? "#00A884" : "#25D366"}
        />
        <Text className="text-text-secondary dark:text-text-secondary-dark mt-2">
          Loading conversation...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-chat dark:bg-background-chat-dark"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {/* Header */}
      <View className="bg-primary dark:bg-primary-dark pt-12 pb-3 px-4 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 p-2 -ml-2 rounded-full"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center flex-1"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
              {otherUser?.profilePicture ? (
                <Image
                  source={{ uri: otherUser.profilePicture }}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <Text className="text-white text-sm font-semibold">
                  {getInitials(otherUser?.name || "U")}
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-white font-semibold text-lg">
                {otherUser?.name || "User"}
              </Text>
              <Text className="text-white/80 text-sm">
                {otherUser?.isOnline ? "Online" : "Last seen recently"}
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex-row">
            <TouchableOpacity
              className="p-2 mx-1 rounded-full"
              activeOpacity={0.7}
            >
              <Ionicons name="videocam" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              className="p-2 mx-1 rounded-full"
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              className="p-2 ml-1 rounded-full"
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Messages */}
      <View className="flex-1">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size="large"
              color={isDark ? "#00A884" : "#25D366"}
            />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{
              paddingVertical: 16,
              flexGrow: 1,
            }}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => {
              if (messages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: true });
              }
            }}
          />
        )}
      </View>

      {/* Message Input */}
      <View className="bg-background dark:bg-background-dark px-4 py-3 border-t border-element-border dark:border-element-border-dark">
        <View className="flex-row items-end">
          <TouchableOpacity
            className="p-2 mr-2 rounded-full"
            activeOpacity={0.7}
          >
            <Ionicons
              name="add-circle"
              size={28}
              color={isDark ? "#8696A0" : "#54656F"}
            />
          </TouchableOpacity>

          <View className="flex-1 bg-background-secondary dark:bg-background-secondary-dark rounded-3xl px-4 py-3 mr-2 border border-element-border dark:border-element-border-dark min-h-[48px] max-h-32">
            <TextInput
              className="text-text dark:text-text-dark text-base leading-5"
              placeholder="Type a message..."
              placeholderTextColor={isDark ? "#8696A0" : "#54656F"}
              value={messageText}
              onChangeText={handleInputChange}
              multiline
              maxLength={1000}
              style={{
                textAlignVertical: "top",
              }}
            />
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            disabled={!messageText.trim() || isSending}
            className={`p-3 rounded-full ${
              messageText.trim() && !isSending
                ? "bg-primary dark:bg-primary-dark"
                : "bg-element-border dark:bg-element-border-dark"
            }`}
            activeOpacity={0.7}
          >
            {isSending ? (
              <ActivityIndicator size={20} color="white" />
            ) : messageText.trim() ? (
              <Ionicons name="send" size={20} color="white" />
            ) : (
              <Ionicons
                name="mic"
                size={20}
                color={isDark ? "#8696A0" : "#54656F"}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
