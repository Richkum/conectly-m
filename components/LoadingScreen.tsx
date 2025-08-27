import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

const LoadingScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const dotAnim1 = useRef(new Animated.Value(0)).current;
  const dotAnim2 = useRef(new Animated.Value(0)).current;
  const dotAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulsing logo animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Loading dots animation
    const dotAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim3, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim1, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim2, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnim3, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    dotAnimation.start();

    return () => {
      pulseAnimation.stop();
      dotAnimation.stop();
    };
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-background dark:bg-background-dark">
      {/* Background gradient effect */}
      <View className="absolute inset-0 bg-gradient-to-b from-primary-50 to-background dark:from-background-dark dark:to-background-secondary-dark opacity-50" />

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="items-center"
      >
        {/* Logo Container */}
        <Animated.View
          style={{
            transform: [{ scale: pulseAnim }],
          }}
          className="relative mb-8"
        >
          {/* Outer glow ring */}
          <View className="absolute inset-0 w-32 h-32 rounded-full bg-primary dark:bg-primary-dark opacity-20 scale-110" />

          {/* Main logo circle */}
          <View className="w-32 h-32 rounded-full bg-primary dark:bg-primary-dark justify-center items-center shadow-lg">
            {/* Message bubble icon */}
            <View className="relative">
              <Text className="text-5xl text-white">💬</Text>
              {/* Connection indicator */}
              <View className="absolute -top-1 -right-1 w-4 h-4 bg-status-online rounded-full border-2 border-white" />
            </View>
          </View>

          {/* Rotating ring */}
          <View className="absolute inset-0 w-32 h-32 rounded-full border-2 border-primary dark:border-primary-dark border-dashed opacity-30" />
        </Animated.View>

        {/* App Name */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-primary dark:text-primary-dark mb-2">
            Connectly
          </Text>
          <Text className="text-lg text-text-secondary dark:text-text-secondary-dark">
            Connecting you securely
          </Text>
        </View>

        {/* Loading Dots */}
        <View className="flex-row items-center space-x-2">
          <Animated.View
            style={{
              opacity: dotAnim1,
              transform: [
                {
                  translateY: dotAnim1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            }}
            className="w-3 h-3 rounded-full bg-primary dark:bg-primary-dark"
          />
          <Animated.View
            style={{
              opacity: dotAnim2,
              transform: [
                {
                  translateY: dotAnim2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            }}
            className="w-3 h-3 rounded-full bg-primary dark:bg-primary-dark"
          />
          <Animated.View
            style={{
              opacity: dotAnim3,
              transform: [
                {
                  translateY: dotAnim3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            }}
            className="w-3 h-3 rounded-full bg-primary dark:bg-primary-dark"
          />
        </View>
      </Animated.View>

      {/* Bottom text */}
      <View className="absolute bottom-16 items-center">
        <Text className="text-sm text-text-tertiary dark:text-text-tertiary-dark">
          Securing your conversations...
        </Text>
      </View>
    </View>
  );
};

export default LoadingScreen;
