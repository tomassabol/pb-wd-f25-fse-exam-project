import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/colors";

const SkeletonBox = ({
  width,
  height,
  borderRadius = 8,
  style = {},
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) => (
  <View
    style={[
      {
        width: width as any,
        height,
        backgroundColor: COLORS.gray[200],
        borderRadius,
      },
      style,
    ]}
  />
);

const SkeletonCard = ({
  width = "100%",
  height = 120,
}: {
  width?: number | string;
  height?: number;
}) => (
  <View style={[styles.skeletonCard, { width: width as any, height }]}>
    <SkeletonBox width="100%" height={height} borderRadius={12} />
  </View>
);

const MembershipSkeletonCard = () => (
  <View style={styles.membershipSkeletonCard}>
    {/* Header with gradient placeholder */}
    <View style={styles.membershipSkeletonHeader}>
      <SkeletonBox width={24} height={24} borderRadius={12} />
      <SkeletonBox
        width={120}
        height={20}
        borderRadius={10}
        style={{ marginTop: 8 }}
      />
      <SkeletonBox
        width={80}
        height={24}
        borderRadius={12}
        style={{ marginTop: 8 }}
      />
      <SkeletonBox
        width={60}
        height={14}
        borderRadius={7}
        style={{ marginTop: 4 }}
      />
    </View>

    {/* Features section */}
    <View style={styles.membershipSkeletonFeatures}>
      {[1, 2, 3].map((_, index) => (
        <View key={index} style={styles.featureSkeletonRow}>
          <SkeletonBox width={16} height={16} borderRadius={8} />
          <SkeletonBox
            width="70%"
            height={12}
            borderRadius={6}
            style={{ marginLeft: 8 }}
          />
        </View>
      ))}
    </View>
  </View>
);

const StationSkeletonCard = () => (
  <View style={styles.stationSkeletonCard}>
    <View style={styles.stationSkeletonContent}>
      <View style={styles.stationSkeletonInfo}>
        <SkeletonBox width="60%" height={16} borderRadius={8} />
        <SkeletonBox
          width="40%"
          height={12}
          borderRadius={6}
          style={{ marginTop: 4 }}
        />
        <SkeletonBox
          width="50%"
          height={12}
          borderRadius={6}
          style={{ marginTop: 4 }}
        />
      </View>
      <SkeletonBox width={60} height={32} borderRadius={16} />
    </View>
  </View>
);

const RecentWashSkeletonCard = () => (
  <View style={styles.recentWashSkeletonCard}>
    <View style={styles.recentWashSkeletonInfo}>
      <SkeletonBox width="50%" height={16} borderRadius={8} />
      <View style={styles.recentWashSkeletonDetails}>
        <SkeletonBox width={14} height={14} borderRadius={7} />
        <SkeletonBox
          width={60}
          height={12}
          borderRadius={6}
          style={{ marginLeft: 4 }}
        />
        <SkeletonBox
          width={14}
          height={14}
          borderRadius={7}
          style={{ marginLeft: 12 }}
        />
        <SkeletonBox
          width={80}
          height={12}
          borderRadius={6}
          style={{ marginLeft: 4 }}
        />
      </View>
    </View>
    <SkeletonBox width={50} height={16} borderRadius={8} />
  </View>
);

export const HomeScreenSkeleton = () => {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Header Skeleton */}
        <LinearGradient
          colors={[COLORS.primary[700], COLORS.primary[600]]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <SkeletonBox width={150} height={24} borderRadius={12} />
              <SkeletonBox
                width={120}
                height={16}
                borderRadius={8}
                style={{ marginTop: 4 }}
              />
            </View>
            <SkeletonBox width={48} height={48} borderRadius={24} />
          </View>
        </LinearGradient>

        {/* Quick Actions Skeleton */}
        <View style={styles.quickActionsSkeleton}>
          <View style={styles.scanButtonSkeleton}>
            <SkeletonBox width={40} height={40} borderRadius={20} />
            <SkeletonBox
              width={180}
              height={16}
              borderRadius={8}
              style={{ marginLeft: 12 }}
            />
          </View>

          <View style={styles.actionButtonsSkeleton}>
            <View style={styles.actionButtonSkeleton}>
              <SkeletonBox width={40} height={40} borderRadius={20} />
              <SkeletonBox
                width={80}
                height={14}
                borderRadius={7}
                style={{ marginTop: 8 }}
              />
            </View>
            <View style={styles.actionButtonSkeleton}>
              <SkeletonBox width={40} height={40} borderRadius={20} />
              <SkeletonBox
                width={80}
                height={14}
                borderRadius={7}
                style={{ marginTop: 8 }}
              />
            </View>
          </View>
        </View>

        {/* Recent Washes Skeleton */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SkeletonBox width={120} height={18} borderRadius={9} />
            <SkeletonBox width={60} height={14} borderRadius={7} />
          </View>

          <RecentWashSkeletonCard />
          <RecentWashSkeletonCard />
        </View>

        {/* Nearby Stations Skeleton */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SkeletonBox width={140} height={18} borderRadius={9} />
            <SkeletonBox width={60} height={14} borderRadius={7} />
          </View>

          <StationSkeletonCard />
          <StationSkeletonCard />
          <StationSkeletonCard />
        </View>

        {/* Membership Plans Skeleton */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SkeletonBox width={150} height={18} borderRadius={9} />
            <SkeletonBox width={60} height={14} borderRadius={7} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.membershipContainer}
          >
            <MembershipSkeletonCard />
            <MembershipSkeletonCard />
            <MembershipSkeletonCard />
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary[700],
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  quickActionsSkeleton: {
    margin: 24,
    marginTop: -24,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scanButtonSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  actionButtonsSkeleton: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButtonSkeleton: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: COLORS.gray[50],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  section: {
    padding: 24,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  skeletonCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  membershipSkeletonCard: {
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
  membershipSkeletonHeader: {
    padding: 20,
    alignItems: "center",
    minHeight: 140,
    justifyContent: "center",
    backgroundColor: COLORS.gray[200],
  },
  membershipSkeletonFeatures: {
    padding: 16,
    backgroundColor: "#FFF",
  },
  featureSkeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stationSkeletonCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  stationSkeletonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stationSkeletonInfo: {
    flex: 1,
  },
  recentWashSkeletonCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  recentWashSkeletonInfo: {
    flex: 1,
  },
  recentWashSkeletonDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  membershipContainer: {
    paddingRight: 16,
  },
});
