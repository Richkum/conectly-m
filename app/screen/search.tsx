import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data for search history
const initialSearchHistory = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Sarah",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    name: "Mike Wilson",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "4",
    name: "Emily",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "5",
    name: "Design Team",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

// Mock data for search results
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    username: "@johndoe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "6",
    name: "John Smith",
    username: "@johnsmith",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "7",
    name: "Johnny Davis",
    username: "@johnd",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
  },
  {
    id: "8",
    name: "Johnson Mike",
    username: "@johnsonm",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    username: "@sarahj",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    name: "Mike Wilson",
    username: "@mikew",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState(initialSearchHistory);
  const [searchResults, setSearchResults] = useState<
    { id: string; name: string; username: string; avatar: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.length > 1) {
      setIsSearching(true);
      const filtered = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleUserSelect = (user: {
    id: any;
    name?: string;
    avatar?: string;
    username?: string;
  }) => {
    // Add to search history if not already there
    if (!searchHistory.some((item) => item.id === user.id)) {
      setSearchHistory([
        {
          id: user.id,
          name: user.name || "", // Provide a default value
          avatar: user.avatar || "", // Provide a default value
        },
        ...searchHistory,
      ]);
    }
    // Navigate to chat with this user
    // router.push(`/chat/${user.id}`);
  };

  const removeFromHistory = (id: string) => {
    setSearchHistory(searchHistory.filter((item) => item.id !== id));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const renderSearchHistoryItem = ({
    item,
  }: {
    item: { id: string; name: string; avatar: string };
  }) => (
    <View className="relative mr-4 items-center">
      <TouchableOpacity
        onPress={() => handleUserSelect(item)}
        className="w-16 h-16 rounded-full bg-background-secondary dark:bg-background-secondary-dark items-center justify-center"
      >
        <Image
          source={{ uri: item.avatar }}
          className="w-14 h-14 rounded-full"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => removeFromHistory(item.id)}
        className="absolute -top-1 -right-1 bg-functional-red-DEFAULT rounded-full w-5 h-5 items-center justify-center"
      >
        <Ionicons name="close" size={14} color="white" />
      </TouchableOpacity>
      <Text
        className="text-xs text-text dark:text-text-dark mt-1 max-w-16"
        numberOfLines={1}
      >
        {item.name.split(" ")[0]}
      </Text>
    </View>
  );

  const renderSearchResult = ({
    item,
  }: {
    item: { id: string; name: string; username: string; avatar: string };
  }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-element-border dark:border-element-border-dark"
      onPress={() => handleUserSelect(item)}
    >
      <Image
        source={{ uri: item.avatar }}
        className="w-12 h-12 rounded-full mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-text dark:text-text-dark">
          {item.name}
        </Text>
        <Text className="text-text-secondary dark:text-text-secondary-dark">
          {item.username}
        </Text>
      </View>
      <TouchableOpacity className="p-2">
        <Ionicons
          name="chatbox-ellipses-outline"
          size={24}
          color={isDark ? "#00A884" : "#25D366"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Header with Search Bar */}
      <View className="bg-primary dark:bg-primary-dark pt-12 px-4 pb-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white flex-1">
            Search Users
          </Text>
        </View>

        {/* Search Input */}
        <View className="bg-background dark:bg-background-secondary-dark rounded-lg px-4 py-3 flex-row items-center">
          <Ionicons
            name="search"
            size={20}
            color={isDark ? "#8696A0" : "#54656F"}
          />
          <TextInput
            className="flex-1 text-text dark:text-text-dark ml-2"
            placeholder="Search by name or username"
            placeholderTextColor={isDark ? "#8696A0" : "#54656F"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={isDark ? "#8696A0" : "#54656F"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search History */}
      {searchHistory.length > 0 && !isSearching && (
        <View className="px-4 py-4 border-b border-element-border dark:border-element-border-dark">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-text-secondary dark:text-text-secondary-dark font-medium">
              Recent Searches
            </Text>
            <TouchableOpacity onPress={clearSearchHistory}>
              <Text className="text-primary dark:text-primary-dark text-sm">
                Clear all
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={searchHistory}
            renderItem={renderSearchHistoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          />
        </View>
      )}

      {/* Search Results */}
      {isSearching && (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Ionicons
                name="search-outline"
                size={48}
                color={isDark ? "#8696A0" : "#54656F"}
              />
              <Text className="text-text-secondary dark:text-text-secondary-dark mt-2 text-center">
                No users found for "{searchQuery}"
              </Text>
            </View>
          }
        />
      )}

      {/* Empty State when not searching */}
      {!isSearching &&
        searchQuery.length === 0 &&
        searchHistory.length === 0 && (
          <View className="flex-1 items-center justify-center px-4">
            <Ionicons
              name="search-outline"
              size={64}
              color={isDark ? "#8696A0" : "#54656F"}
            />
            <Text className="text-text-secondary dark:text-text-secondary-dark mt-4 text-center text-lg">
              Search for users by name or username
            </Text>
          </View>
        )}
    </View>
  );
}
