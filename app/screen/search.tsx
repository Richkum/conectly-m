import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// 1. IMPORT your useAuth hook and the configured axios instance (api)

// Define the structure of a user from the API response
interface ApiUser {
  _id: string;
  name: string;
  bio?: string;
  profilePicture?: string;
}

// Define the structure of a user for the UI
interface DisplayUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

// Define the structure for search history items
interface HistoryItem {
  id: string;
  name: string;
  avatar: string;
}

const DEFAULT_AVATAR = "https://i.pravatar.cc/150";
const BACKEND_URL = "http://192.168.1.167:5000";
const SEARCH_HISTORY_KEY = "search_history";

export default function SearchScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // 2. GET the authState from your context
  const { authState } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<HistoryItem[]>([]);
  const [searchResults, setSearchResults] = useState<DisplayUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 3. REFACTOR fetchUsers to use the 'api' (axios) instance
  const fetchUsers = useCallback(
    async (query: string) => {
      if (query.trim().length < 1 || !authState?.token) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);

      try {
        console.log(
          "Sending request to:",
          BACKEND_URL + "/users/search",
          "with query:",
          query
        );

        const response = await axios.get(`${BACKEND_URL}/users/search`, {
          params: { q: query },
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
        });

        const users: ApiUser[] = response.data;

        const formattedUsers: DisplayUser[] = users.map((user) => ({
          id: user._id,
          name: user.name,
          username:
            user.bio || `@${user.name.replace(/\s+/g, "").toLowerCase()}`,
          avatar: user.profilePicture || DEFAULT_AVATAR,
        }));

        setSearchResults(formattedUsers);
      } catch (error) {
        console.error("Error searching for users:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [authState?.token]
  );

  // This useEffect for debouncing remains the same and will work perfectly
  useEffect(() => {
    const isSearching = searchQuery.length > 0;
    if (isSearching) {
      const handler = setTimeout(() => {
        fetchUsers(searchQuery);
      }, 300);
      return () => {
        clearTimeout(handler);
      };
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, fetchUsers]);

  // Load search history on component mount
  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        setSearchHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading search history:", error);
    }
  };

  const saveSearchHistory = async (history: HistoryItem[]) => {
    try {
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  };

  const handleUserSelect = async (user: DisplayUser | HistoryItem) => {
    // Create new history array
    let newHistory = [...searchHistory];

    // Remove if already exists to avoid duplicates
    newHistory = newHistory.filter((item) => item.id !== user.id);

    // Add to beginning
    const historyItem: HistoryItem = {
      id: user.id,
      name: user.name,
      avatar: user.avatar || DEFAULT_AVATAR,
    };
    newHistory = [historyItem, ...newHistory];

    // Limit to 10 recent searches
    newHistory = newHistory.slice(0, 10);

    // Update state and save
    setSearchHistory(newHistory);
    await saveSearchHistory(newHistory);

    // Create or find chat with this user
    try {
      if (!authState?.token) {
        console.error("No auth token found");
        return;
      }

      setIsLoading(true);

      const response = await axios.post(
        `${BACKEND_URL}/chats/direct`,
        { otherUserId: user.id },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const chatData = response.data;
      console.log("Chat created/found:", chatData);

      // Navigate to conversation screen
      router.push({
        pathname: "/(conversation)/[id]",
        params: {
          id: chatData.id,
          chatName: user.name,
          userAvatar: user.avatar || DEFAULT_AVATAR,
        },
      });
    } catch (error) {
      console.error("Error creating/finding chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromHistory = async (id: string) => {
    const newHistory = searchHistory.filter((item) => item.id !== id);
    setSearchHistory(newHistory);
    await saveSearchHistory(newHistory);
  };

  const clearSearchHistory = async () => {
    setSearchHistory([]);
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  // --- NO CHANGES to any of the rendering logic below this line ---

  const renderSearchHistoryItem = ({ item }: { item: HistoryItem }) => (
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

  const renderSearchResult = ({ item }: { item: DisplayUser }) => (
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
      <View className="bg-primary dark:bg-primary-dark pt-12 px-4 pb-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white flex-1">
            Search Users
          </Text>
        </View>
        <View className="bg-background dark:bg-background-secondary-dark rounded-lg px-4 py-3 flex-row items-center">
          <Ionicons
            name="search"
            size={20}
            color={isDark ? "#8696A0" : "#54656F"}
          />
          <TextInput
            className="flex-1 text-text dark:text-text-dark ml-2"
            placeholder="Search by name"
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
      {searchHistory.length > 0 && searchQuery.length === 0 && (
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
      {searchQuery.length > 0 && (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              {isLoading ? (
                <ActivityIndicator
                  size="large"
                  color={isDark ? "#00A884" : "#25D366"}
                />
              ) : (
                <>
                  <Ionicons
                    name="search-outline"
                    size={48}
                    color={isDark ? "#8696A0" : "#54656F"}
                  />
                  <Text className="text-text-secondary dark:text-text-secondary-dark mt-2 text-center">
                    No users found for "{searchQuery}"
                  </Text>
                </>
              )}
            </View>
          }
        />
      )}
      {searchQuery.length === 0 && searchHistory.length === 0 && (
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons
            name="search-outline"
            size={64}
            color={isDark ? "#8696A0" : "#54656F"}
          />
          <Text className="text-text-secondary dark:text-text-secondary-dark mt-4 text-center text-lg">
            Search for users by name
          </Text>
        </View>
      )}
    </View>
  );
}
