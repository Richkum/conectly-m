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

// Mock data for calls
const callData = [
  {
    id: "1",
    name: "John Doe",
    time: "10:30 AM",
    date: "Today",
    type: "outgoing",
    status: "completed",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    time: "Yesterday, 2:45 PM",
    date: "Yesterday",
    type: "incoming",
    status: "missed",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    name: "Mike Wilson",
    time: "Yesterday, 11:20 AM",
    date: "Yesterday",
    type: "incoming",
    status: "completed",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "4",
    name: "Emily Davis",
    time: "September 20, 4:15 PM",
    date: "September 20",
    type: "outgoing",
    status: "completed",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "5",
    name: "Alex Thompson",
    time: "September 19, 9:30 AM",
    date: "September 19",
    type: "incoming",
    status: "completed",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: "6",
    name: "Design Team",
    time: "September 18, 3:00 PM",
    date: "September 18",
    type: "outgoing",
    status: "missed",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    isGroup: true,
  },
  {
    id: "7",
    name: "David Miller",
    time: "September 17, 5:40 PM",
    date: "September 17",
    type: "incoming",
    status: "completed",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: "8",
    name: "Jennifer Lee",
    time: "September 15, 11:15 AM",
    date: "September 15",
    type: "outgoing",
    status: "completed",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
  },
];

export default function CallsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter calls based on search query
  const filteredCalls = callData.filter((call) =>
    call.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCallIcon = (type: string, status: string) => {
    if (type === "outgoing") {
      return status === "completed" ? "📞" : "📞❌";
    } else {
      return status === "completed" ? "📞" : "📞⤴️";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "missed"
      ? "text-functional-red-DEFAULT"
      : "text-text-secondary dark:text-text-secondary-dark";
  };

  const renderCallItem = ({ item }: { item: (typeof callData)[0] }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-element-border dark:border-element-border-dark"
      activeOpacity={0.7}
      // onPress={() => router.push(`/call/${item.id}`)}
    >
      <View className="relative">
        <Image
          source={{ uri: item.avatar }}
          className="w-14 h-14 rounded-full mr-4"
        />
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
          <Text className={`text-sm ${getStatusColor(item.status)}`}>
            {item.time}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text className={`mr-2 ${getStatusColor(item.status)}`}>
            {getCallIcon(item.type, item.status)}
          </Text>
          <Text className={getStatusColor(item.status)}>
            {item.type === "incoming" ? "Incoming" : "Outgoing"} •
            {item.status === "completed" ? " Completed" : " Missed"}
          </Text>
        </View>
      </View>

      <TouchableOpacity className="p-2">
        <Text className="text-primary dark:text-primary-dark text-xl">📞</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="bg-primary dark:bg-primary-dark pt-12 px-4 pb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-white">Calls</Text>
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
            placeholder="Search calls"
            placeholderTextColor="#667781"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Create Call Link Button */}
      <TouchableOpacity className="flex-row items-center p-4 border-b border-element-border dark:border-element-border-dark">
        <View className="w-12 h-12 bg-primary/10 dark:bg-primary-dark/20 rounded-full items-center justify-center mr-4">
          <Text className="text-primary dark:text-primary-dark text-xl">
            🔗
          </Text>
        </View>
        <Text className="text-primary dark:text-primary-dark font-medium">
          Create call link
        </Text>
      </TouchableOpacity>

      {/* Recent Text */}
      <View className="px-4 py-2">
        <Text className="text-text-secondary dark:text-text-secondary-dark font-medium">
          Recent
        </Text>
      </View>

      {/* Calls List */}
      <FlatList
        data={filteredCalls}
        renderItem={renderCallItem}
        keyExtractor={(item) => item.id}
        className="flex-1"
      />

      {/* New Call Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 bg-primary dark:bg-primary-dark rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
      >
        <Text className="text-white text-3xl">📞</Text>
      </TouchableOpacity>
    </View>
  );
}
