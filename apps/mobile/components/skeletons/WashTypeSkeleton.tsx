import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { COLORS } from "@/constants/colors";

const SkeletonBox = ({
  width,
  height,
  style,
}: {
  width: number | string;
  height: number;
  style?: any;
}) => {
  const shimmerValue = useSharedValue(0);

  React.useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.bezier(0.4, 0.0, 0.6, 1.0),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.3 + shimmerValue.value * 0.4,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: COLORS.gray[300],
          borderRadius: 8,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export function WashTypeSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.washTypeCard}>
        <View style={styles.washTypeContent}>
          <SkeletonBox width={60} height={60} style={styles.washTypeIcon} />
          <View style={styles.washTypeInfo}>
            <SkeletonBox width="70%" height={20} style={styles.washTypeName} />
            <SkeletonBox
              width="90%"
              height={16}
              style={styles.washTypeDescription}
            />
            <View style={styles.washTypeFeatures}>
              <SkeletonBox width={80} height={12} style={styles.featureItem} />
              <SkeletonBox width={90} height={12} style={styles.featureItem} />
              <SkeletonBox width={70} height={12} style={styles.featureItem} />
            </View>
          </View>
        </View>
        <View style={styles.washTypePriceContainer}>
          <SkeletonBox width={60} height={24} style={styles.washTypePrice} />
        </View>
      </View>
    </View>
  );
}

export function WashTypeListSkeleton() {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: 4 }).map((_, index) => (
        <WashTypeSkeleton key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  listContainer: {
    paddingTop: 16,
  },
  washTypeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  washTypeContent: {
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start",
    gap: 12,
  },
  washTypeIcon: {
    borderRadius: 12,
  },
  washTypeInfo: {
    flex: 1,
  },
  washTypeName: {
    marginBottom: 8,
  },
  washTypeDescription: {
    marginBottom: 12,
  },
  washTypeFeatures: {
    flexDirection: "column",
    gap: 6,
  },
  featureItem: {
    marginBottom: 4,
  },
  washTypePriceContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  washTypePrice: {
    marginBottom: 8,
  },
});
