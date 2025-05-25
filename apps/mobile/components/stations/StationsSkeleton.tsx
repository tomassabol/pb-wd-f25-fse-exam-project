import React from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { COLORS } from "@/constants/colors";

const { width } = Dimensions.get("window");

const SkeletonBox = ({
  width: boxWidth,
  height,
  style,
}: {
  width: number | string;
  height: number;
  style?: any;
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: boxWidth,
          height,
          backgroundColor: COLORS.gray[300],
          borderRadius: 8,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const StationsSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <SkeletonBox width={150} height={24} />
        <View style={styles.viewToggle}>
          <SkeletonBox
            width={40}
            height={36}
            style={{ borderRadius: 12, marginRight: 4 }}
          />
          <SkeletonBox width={40} height={36} style={{ borderRadius: 12 }} />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SkeletonBox width="100%" height={48} style={{ borderRadius: 12 }} />
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersList}>
          {[1, 2, 3, 4, 5].map((index) => (
            <SkeletonBox
              key={index}
              width={80}
              height={32}
              style={{ borderRadius: 16, marginRight: 8 }}
            />
          ))}
        </View>
      </View>

      {/* Station Cards */}
      <View style={styles.stationsList}>
        {[1, 2, 3, 4, 5].map((index) => (
          <View key={index} style={styles.stationCard}>
            <SkeletonBox
              width={80}
              height={80}
              style={{ borderRadius: 12, marginRight: 16 }}
            />
            <View style={styles.stationInfo}>
              <SkeletonBox
                width="70%"
                height={20}
                style={{ marginBottom: 8 }}
              />
              <SkeletonBox
                width="90%"
                height={16}
                style={{ marginBottom: 12 }}
              />
              <View style={styles.badgesContainer}>
                <SkeletonBox
                  width={60}
                  height={24}
                  style={{ borderRadius: 12, marginRight: 8 }}
                />
                <SkeletonBox
                  width={80}
                  height={24}
                  style={{ borderRadius: 12 }}
                />
              </View>
            </View>
            <View style={styles.distanceContainer}>
              <SkeletonBox width={50} height={16} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  viewToggle: {
    flexDirection: "row",
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  filtersContainer: {
    paddingVertical: 8,
  },
  filtersList: {
    flexDirection: "row",
    paddingHorizontal: 24,
  },
  stationsList: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  stationCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stationInfo: {
    flex: 1,
  },
  badgesContainer: {
    flexDirection: "row",
  },
  distanceContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
