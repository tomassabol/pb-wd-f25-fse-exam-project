import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

export const StationDetailSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Image Container Skeleton */}
      <View style={styles.imageContainer}>
        <SkeletonBox width="100%" height={300} style={{ borderRadius: 0 }} />

        {/* Navigation buttons overlay */}
        <View style={styles.imageNavigation}>
          <SkeletonBox width={40} height={40} style={{ borderRadius: 20 }} />
          <SkeletonBox width={40} height={40} style={{ borderRadius: 20 }} />
        </View>

        {/* Station info overlay */}
        <View style={styles.stationInfoContainer}>
          <SkeletonBox width="70%" height={24} style={{ marginBottom: 4 }} />
          <SkeletonBox width="90%" height={16} style={{ marginBottom: 12 }} />

          {/* Badges */}
          <View style={styles.badgeContainer}>
            <SkeletonBox
              width={80}
              height={24}
              style={{ borderRadius: 4, marginRight: 8 }}
            />
            <SkeletonBox width={100} height={24} style={{ borderRadius: 4 }} />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <SkeletonBox width="48%" height={56} style={{ borderRadius: 12 }} />
            <SkeletonBox width="48%" height={56} style={{ borderRadius: 12 }} />
          </View>

          {/* Details Row */}
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <SkeletonBox
                width={40}
                height={40}
                style={{ borderRadius: 20, marginRight: 12 }}
              />
              <View>
                <SkeletonBox
                  width={40}
                  height={16}
                  style={{ marginBottom: 4 }}
                />
                <SkeletonBox width={50} height={14} />
              </View>
            </View>

            <View style={styles.detailSeparator} />

            <View style={styles.detailItem}>
              <SkeletonBox
                width={40}
                height={40}
                style={{ borderRadius: 20, marginRight: 12 }}
              />
              <View>
                <SkeletonBox
                  width={60}
                  height={16}
                  style={{ marginBottom: 4 }}
                />
                <SkeletonBox width={40} height={14} />
              </View>
            </View>

            <View style={styles.detailSeparator} />

            <View style={styles.detailItem}>
              <SkeletonBox
                width={40}
                height={40}
                style={{ borderRadius: 20, marginRight: 12 }}
              />
              <View>
                <SkeletonBox
                  width={50}
                  height={16}
                  style={{ marginBottom: 4 }}
                />
                <SkeletonBox width={60} height={14} />
              </View>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.sectionContainer}>
            <SkeletonBox width={80} height={18} style={{ marginBottom: 16 }} />
            <SkeletonBox width="100%" height={16} style={{ marginBottom: 8 }} />
            <SkeletonBox width="90%" height={16} style={{ marginBottom: 8 }} />
            <SkeletonBox width="70%" height={16} />
          </View>

          {/* Services Section */}
          <View style={styles.sectionContainer}>
            <SkeletonBox width={140} height={18} style={{ marginBottom: 16 }} />
            <View style={styles.servicesContainer}>
              {[1, 2, 3, 4].map((index) => (
                <View key={index} style={styles.serviceItem}>
                  <SkeletonBox
                    width={16}
                    height={16}
                    style={{ borderRadius: 8, marginRight: 8 }}
                  />
                  <SkeletonBox width={120} height={14} />
                </View>
              ))}
            </View>
          </View>

          {/* Location Section */}
          <View style={styles.sectionContainer}>
            <SkeletonBox width={80} height={18} style={{ marginBottom: 16 }} />
            <SkeletonBox
              width="100%"
              height={200}
              style={{ borderRadius: 12, marginBottom: 16 }}
            />

            <View style={styles.locationInfo}>
              <View style={styles.locationInfoItem}>
                <SkeletonBox
                  width={20}
                  height={20}
                  style={{ borderRadius: 10, marginRight: 12 }}
                />
                <SkeletonBox width="70%" height={16} />
              </View>
              <View style={styles.locationInfoItem}>
                <SkeletonBox
                  width={20}
                  height={20}
                  style={{ borderRadius: 10, marginRight: 12 }}
                />
                <SkeletonBox width="60%" height={16} />
              </View>
            </View>
          </View>

          {/* Membership Section */}
          <View style={styles.sectionContainer}>
            <SkeletonBox width={140} height={18} style={{ marginBottom: 16 }} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.membershipContainer}
            >
              {[1, 2, 3].map((index) => (
                <View key={index} style={styles.membershipCard}>
                  <View style={styles.membershipHeader}>
                    <SkeletonBox
                      width={24}
                      height={24}
                      style={{ borderRadius: 12, marginBottom: 8 }}
                    />
                    <SkeletonBox
                      width={80}
                      height={20}
                      style={{ marginBottom: 8 }}
                    />
                    <SkeletonBox
                      width={60}
                      height={24}
                      style={{ marginBottom: 4 }}
                    />
                    <SkeletonBox width={40} height={14} />
                  </View>
                  <View style={styles.membershipFeatures}>
                    {[1, 2, 3].map((featureIndex) => (
                      <View key={featureIndex} style={styles.featureRow}>
                        <SkeletonBox
                          width={16}
                          height={16}
                          style={{ borderRadius: 8, marginRight: 8 }}
                        />
                        <SkeletonBox width="70%" height={12} />
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  imageContainer: {
    height: 300,
    position: "relative",
  },
  imageNavigation: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stationInfoContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  badgeContainer: {
    flexDirection: "row",
  },
  contentContainer: {
    padding: 24,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  detailSeparator: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray[200],
    marginHorizontal: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 12,
  },

  locationInfo: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
  },
  locationInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  membershipContainer: {
    paddingRight: 16,
  },
  membershipCard: {
    width: 280,
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  membershipHeader: {
    padding: 20,
    alignItems: "center",
    minHeight: 140,
    justifyContent: "center",
    backgroundColor: COLORS.gray[200],
  },
  membershipFeatures: {
    padding: 16,
    backgroundColor: "#FFF",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
});
