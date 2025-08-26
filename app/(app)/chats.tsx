import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data for chats
const chatData = [
  {
    id: "1",
    name: "John Doe",
    lastMessage: "Hey there! How are you doing?",
    time: "10:30 AM",
    unreadCount: 2,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    isOnline: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    lastMessage: "Let's meet tomorrow for coffee",
    time: "Yesterday",
    unreadCount: 0,
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    isOnline: false,
  },
  {
    id: "3",
    name: "Mike Wilson",
    lastMessage: "Did you see the latest project updates?",
    time: "Yesterday",
    unreadCount: 5,
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    isOnline: true,
  },
  {
    id: "4",
    name: "Emily Davis",
    lastMessage: "Thanks for your help with the presentation!",
    time: "Wednesday",
    unreadCount: 0,
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    isOnline: false,
  },
  {
    id: "5",
    name: "Alex Thompson",
    lastMessage: "Are we still on for the meeting?",
    time: "Tuesday",
    unreadCount: 0,
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    isOnline: false,
  },
  {
    id: "6",
    name: "Design Team",
    lastMessage: "Lisa: I've uploaded the new assets",
    time: "Monday",
    unreadCount: 12,
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    isOnline: true,
    isGroup: true,
  },
  {
    id: "7",
    name: "David Miller",
    lastMessage: "Can you send me those files?",
    time: "Sunday",
    unreadCount: 0,
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    isOnline: false,
  },
  {
    id: "8",
    name: "Jennifer Lee",
    lastMessage: "The event was amazing!",
    time: "9/15/2023",
    unreadCount: 0,
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    isOnline: false,
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter chats based on search query
  const filteredChats = chatData.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: (typeof chatData)[number] }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-element-border dark:border-element-border-dark"
      activeOpacity={0.7}
      // onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View className="relative">
        <Image
          source={{ uri: item.avatar }}
          className="w-14 h-14 rounded-full mr-4"
        />
        {item.isOnline && (
          <View className="absolute bottom-0 right-3 w-4 h-4 bg-status-online rounded-full border-2 border-background dark:border-background-dark" />
        )}
        {item.isGroup && (
          <View className="absolute bottom-0 right-3 w-4 h-4 bg-functional-blue-DEFAULT rounded-full border-2 border-background dark:border-background-dark items-center justify-center">
            <Text className="text-white text-xs">G</Text>
          </View>
        )}
      </View>

      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-lg font-semibold text-text dark:text-text-dark">
            {item.name}
          </Text>
          <Text className="text-sm text-text-secondary dark:text-text-secondary-dark">
            {item.time}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text
            className="text-text-secondary dark:text-text-secondary-dark flex-1 mr-2"
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>

          {item.unreadCount > 0 && (
            <View className="bg-primary dark:bg-primary-dark rounded-full min-w-[24px] h-6 items-center justify-center">
              <Text className="text-white text-xs font-bold px-1">
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="bg-primary dark:bg-primary-dark pt-12 px-4 pb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-white">Connectly</Text>
          <View className="flex-row">
            <TouchableOpacity className="ml-4">
              <Text className="text-white text-lg">🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity className="ml-4">
              <Text className="text-white text-lg">⋮</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="bg-background dark:bg-background-secondary-dark rounded-lg px-4 py-2 flex-row items-center">
          <Text className="text-text-secondary dark:text-text-secondary-dark mr-2">
            🔍
          </Text>
          <TextInput
            className="flex-1 text-text dark:text-text-dark"
            placeholder="Search or start new chat"
            placeholderTextColor="#667781"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        className="flex-1"
      />

      {/* New Chat Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 bg-primary dark:bg-primary-dark rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>
    </View>
  );
}
