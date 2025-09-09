import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Mock data for status updates
const statusData = [
  {
    type: "myStatus",
    user: {
      id: "me",
      name: "My Status",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      time: "Just now",
    },
    statuses: [
      {
        id: "1",
        type: "image",
        content: "https://images.unsplash.com/photo-1579546929662-711aa81148cf",
        time: "10:30 AM",
        seen: false,
      },
    ],
  },
  {
    type: "recent",
    title: "Recent updates",
    statuses: [
      {
        id: "2",
        user: {
          id: "2",
          name: "Sarah Johnson",
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
          time: "10 minutes ago",
        },
        content: "https://images.unsplash.com/photo-1606787366850-de6330128bfc",
        seen: false,
      },
      {
        id: "3",
        user: {
          id: "3",
          name: "Mike Wilson",
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
          time: "25 minutes ago",
        },
        content: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
        seen: false,
      },
    ],
  },
  {
    type: "viewed",
    title: "Viewed updates",
    statuses: [
      {
        id: "4",
        user: {
          id: "4",
          name: "Emily Davis",
          avatar: "https://randomuser.me/api/portraits/women/4.jpg",
          time: "1 hour ago",
        },
        content: "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
        seen: true,
      },
      {
        id: "5",
        user: {
          id: "5",
          name: "Alex Thompson",
          avatar: "https://randomuser.me/api/portraits/men/5.jpg",
          time: "3 hours ago",
        },
        content: "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
        seen: true,
      },
    ],
  },
];

export default function StatusScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [statuses, setStatuses] = useState(statusData);

  const handleAddStatus = () => {
    // Navigate to camera or status creation screen
    // router.push("/camera");
  };

  const handleStatusPress = (
    status:
      | {
          id: string;
          type: string;
          content: string;
          time: string;
          seen: boolean;
        }
      | {
          id: string;
          user: { id: string; name: string; avatar: string; time: string };
          content: string;
          seen: boolean;
        }
  ) => {
    // Navigate to status viewer
    // router.push({
    //   pathname: "/status-viewer",
    //   params: { statusId: status.id }
    // });
  };

  const renderMyStatus = () => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-element-border dark:border-element-border-dark"
      onPress={() => handleStatusPress(statuses[0].statuses[0])}
    >
      <View className="relative">
        <Image
          source={{ uri: statuses[0].user?.avatar }}
          className="w-16 h-16 rounded-full"
        />
        <TouchableOpacity
          onPress={handleAddStatus}
          className="absolute bottom-0 right-0 w-6 h-6 bg-primary dark:bg-primary-dark rounded-full items-center justify-center border-2 border-background dark:border-background-dark"
        >
          <Ionicons name="add" size={16} color="white" />
        </TouchableOpacity>
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-lg font-semibold text-text dark:text-text-dark">
          {statuses[0].user?.name}
        </Text>
        <Text className="text-text-secondary dark:text-text-secondary-dark">
          {statuses[0].user?.time}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderStatusItem = ({
    item,
  }: {
    item: {
      id: string;
      user: { id: string; name: string; avatar: string; time: string };
      content: string;
      seen: boolean;
    };
  }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-element-border dark:border-element-border-dark"
      onPress={() => handleStatusPress(item)}
    >
      <View className="relative">
        <Image
          source={{ uri: item.user.avatar }}
          className="w-14 h-14 rounded-full"
        />
        {!item.seen && (
          <View className="absolute -top-1 -right-1 w-4 h-4 bg-primary dark:bg-primary-dark rounded-full border-2 border-background dark:border-background-dark" />
        )}
      </View>
      <View className="ml-4 flex-1">
        <Text
          className={`text-lg font-semibold ${item.seen ? "text-text-secondary dark:text-text-secondary-dark" : "text-text dark:text-text-dark"}`}
        >
          {item.user.name}
        </Text>
        <Text className="text-text-secondary dark:text-text-secondary-dark text-sm">
          {item.user.time}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderStatusSection = ({
    item,
  }: {
    item: {
      type: string;
      title?: string;
      statuses: any[];
      user?: { id: string; name: string; avatar: string; time: string };
      content?: string;
      seen?: boolean;
    };
  }) => {
    if (item.type === "myStatus") {
      return renderMyStatus();
    }

    return (
      <View className="border-b border-element-border dark:border-element-border-dark">
        <Text className="text-text-secondary dark:text-text-secondary-dark font-medium px-4 py-2 bg-background-secondary dark:bg-background-secondary-dark">
          {item.title}
        </Text>
        <FlatList
          data={item.statuses}
          renderItem={renderStatusItem}
          keyExtractor={(status) => status.id}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="bg-primary dark:bg-primary-dark pt-12 px-4 pb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-bold text-white">Status</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status List */}
      <FlatList
        data={statuses}
        renderItem={renderStatusSection}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-10">
            <Ionicons
              name="camera-outline"
              size={64}
              color={isDark ? "#8696A0" : "#54656F"}
            />
            <Text className="text-text-secondary dark:text-text-secondary-dark mt-4 text-center text-lg">
              No status updates yet
            </Text>
            <TouchableOpacity
              onPress={handleAddStatus}
              className="bg-primary dark:bg-primary-dark px-6 py-3 rounded-full mt-6"
            >
              <Text className="text-white font-medium">
                Add your first status
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Floating Buttons */}
      <View className="absolute bottom-6 right-6 flex-row">
        <TouchableOpacity
          className="w-14 h-14 bg-element-icon dark:bg-element-icon-dark rounded-full items-center justify-center mr-4"
          activeOpacity={0.8}
        >
          <Ionicons
            name="camera"
            size={24}
            color={isDark ? "#111B21" : "white"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-14 h-14 bg-primary dark:bg-primary-dark rounded-full items-center justify-center"
          activeOpacity={0.8}
          onPress={handleAddStatus}
        >
          <Ionicons name="pencil" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
