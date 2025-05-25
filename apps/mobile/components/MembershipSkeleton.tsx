import React from "react";
import { View, StyleSheet, Animated } from "react-native";
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
          width,
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

export const MembershipSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Hero Section Skeleton */}
      <View style={styles.heroSection}>
        <SkeletonBox width="80%" height={32} style={{ marginBottom: 8 }} />
        <SkeletonBox width="60%" height={20} style={{ marginBottom: 16 }} />
        <SkeletonBox width={200} height={36} style={{ borderRadius: 18 }} />
      </View>

      {/* Membership Cards Skeleton */}
      <View style={styles.membershipsContainer}>
        {[1, 2, 3].map((index) => (
          <View key={index} style={styles.membershipCard}>
            {/* Header */}
            <View style={styles.membershipHeader}>
              <SkeletonBox
                width={40}
                height={40}
                style={{ borderRadius: 20, marginBottom: 12 }}
              />
              <SkeletonBox
                width={120}
                height={28}
                style={{ marginBottom: 16 }}
              />
              <SkeletonBox
                width={150}
                height={36}
                style={{ marginBottom: 8 }}
              />
              <SkeletonBox width={80} height={20} />
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              {[1, 2, 3, 4].map((featureIndex) => (
                <View key={featureIndex} style={styles.featureRow}>
                  <SkeletonBox
                    width={24}
                    height={24}
                    style={{ borderRadius: 12 }}
                  />
                  <SkeletonBox
                    width="70%"
                    height={16}
                    style={{ marginLeft: 12 }}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Payment Section Skeleton */}
      <View style={styles.paymentSection}>
        <SkeletonBox width={150} height={24} style={{ marginBottom: 8 }} />
        <SkeletonBox width={200} height={16} style={{ marginBottom: 20 }} />

        {[1, 2].map((index) => (
          <View key={index} style={styles.paymentOption}>
            <SkeletonBox width={48} height={48} style={{ borderRadius: 12 }} />
            <View style={styles.paymentInfo}>
              <SkeletonBox
                width={100}
                height={18}
                style={{ marginBottom: 4 }}
              />
              <SkeletonBox width={180} height={14} />
            </View>
          </View>
        ))}
      </View>

      {/* Footer Button Skeleton */}
      <View style={styles.footer}>
        <SkeletonBox width="100%" height={56} style={{ borderRadius: 16 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  heroSection: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  membershipsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  membershipCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: COLORS.gray[200],
  },
  membershipHeader: {
    padding: 24,
    alignItems: "center",
    backgroundColor: COLORS.gray[100],
    minHeight: 140,
    justifyContent: "center",
  },
  featuresContainer: {
    padding: 24,
    backgroundColor: "#FFF",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  paymentSection: {
    padding: 24,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
  },
  paymentInfo: {
    marginLeft: 16,
    flex: 1,
  },
  footer: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
});
