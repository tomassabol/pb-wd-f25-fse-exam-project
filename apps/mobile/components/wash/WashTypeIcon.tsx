import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Car, Sparkles, Crown, Zap } from "lucide-react-native";
import { COLORS } from "@/constants/colors";

interface WashTypeIconProps {
  washTypeName: string;
  size?: number;
}

const getWashTypeConfig = (name: string) => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("basic")) {
    return {
      icon: Car,
      gradient: ["#6B7280", "#4B5563"], // Gray gradient for basic
      iconColor: "#FFFFFF",
    };
  }

  if (lowerName.includes("bronze")) {
    return {
      icon: Sparkles,
      gradient: ["#CD7F32", "#A0522D"], // Bronze gradient
      iconColor: "#FFFFFF",
    };
  }

  if (lowerName.includes("silver")) {
    return {
      icon: Sparkles,
      gradient: ["#C0C0C0", "#A8A8A8"], // Silver gradient
      iconColor: "#374151",
    };
  }

  if (lowerName.includes("gold")) {
    return {
      icon: Crown,
      gradient: ["#FFD700", "#FFA500"], // Gold gradient
      iconColor: "#374151",
    };
  }

  if (lowerName.includes("platinum")) {
    return {
      icon: Crown,
      gradient: ["#E5E4E2", "#B8B8B8"], // Platinum gradient
      iconColor: "#374151",
    };
  }

  // Default - use a distinct teal color
  return {
    icon: Car,
    gradient: ["#06B6D4", "#0891B2"], // Cyan gradient
    iconColor: "#FFFFFF",
  };
};

export function WashTypeIcon({ washTypeName, size = 60 }: WashTypeIconProps) {
  const config = getWashTypeConfig(washTypeName);
  const IconComponent = config.icon;

  return (
    <LinearGradient
      colors={config.gradient as any}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size * 0.2,
        },
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.iconContainer}>
        <IconComponent
          size={size * 0.4}
          color={config.iconColor}
          strokeWidth={2}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
