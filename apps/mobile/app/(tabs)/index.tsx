import { useEffect, useState, Suspense } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Car,
  Clock,
  Droplets,
  MapPin,
  Navigation,
  Search,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { useWash } from "@/hooks/useWash";
import { useWashingStationsSuspenseQuery } from "@/hooks/washing-stations-hooks";
import { useMembershipsSuspenseQuery } from "@/hooks/memberships-hooks";
import { StationCard } from "@/components/stations/StationCard";
import { MembershipCard } from "@/components/membership/MembershipCard";
import { transformWashingStationToStation } from "@/utils/stationTransform";
import { Station } from "@/types/station";
import { HomeScreenSkeleton } from "@/components/skeletons/HomeScreenSkeleton";
import { useCarWashHistorySuspenseQuery } from "@/hooks/car-wash-hooks";

const ActiveWashBar = () => {
  const { activeWash } = useWash();

  if (!activeWash) return null;

  return (
    <TouchableOpacity
      style={styles.activeWashBar}
      onPress={() => router.push("/(modals)/wash-progress")}
    >
      <View style={styles.pulseDot} />
      <Text style={styles.activeWashText}>Wash in Progress</Text>
      <Text style={styles.viewText}>View</Text>
    </TouchableOpacity>
  );
};

function HomeScreenContent() {
  const { user } = useAuth();
  console.log("user", user);
  const { activeWash, detectLicensePlate } = useWash();
  const { data: washingStations } = useWashingStationsSuspenseQuery({
    isOpen: true,
  });
  const { data: memberships } = useMembershipsSuspenseQuery();
  const { data: recentWashes } = useCarWashHistorySuspenseQuery();
  const [nearbyStations, setNearbyStations] = useState<Station[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);

  // Transform washing stations to Station format and get nearest 3
  useEffect(() => {
    if (washingStations) {
      // For now, we'll use a mock user location (Copenhagen)
      // In a real app, you'd get this from the user's actual location
      const userLocation = { latitude: 55.6761, longitude: 12.5683 };

      const transformedStations = washingStations
        .map((station) =>
          transformWashingStationToStation(station, userLocation)
        )
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

      setNearbyStations(transformedStations);
    }
  }, [washingStations]);

  const handleStationPress = (stationId: string) => {
    router.push(`/station/${stationId}`);
  };

  const handleScanPress = () => {
    setIsDetecting(true);

    // Simulate license plate detection
    setTimeout(() => {
      setIsDetecting(false);
      const mockLicensePlate = "AB 12 345";
      detectLicensePlate(mockLicensePlate);
      router.push("/(modals)/wash-selector");
    }, 2000);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <LinearGradient
          colors={[COLORS.primary[700], COLORS.primary[600]]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>
                Hello, {user?.fullName?.split(" ")[0] || "Guest"}
              </Text>
              <Text style={styles.subGreeting}>Welcome to WashWorld</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Image
                source={{
                  uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {activeWash ? (
          <TouchableOpacity
            style={styles.activeWashCard}
            onPress={() => router.push("/(modals)/wash-progress")}
          >
            <View style={styles.activeWashHeader}>
              <View style={styles.pulseDot} />
              <Text style={styles.activeWashLabel}>Wash in Progress</Text>
            </View>
            <View style={styles.activeWashDetails}>
              <View style={styles.activeWashInfo}>
                <Text style={styles.activeWashType}>
                  {activeWash.washType.name}
                </Text>
                <Text style={styles.activeWashLocation}>
                  {activeWash.station.name}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => router.push("/(modals)/wash-progress")}
              >
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={handleScanPress}
              disabled={isDetecting}
            >
              <View style={styles.scanIconContainer}>
                <Car size={24} color={COLORS.primary[600]} />
              </View>
              <Text style={styles.scanText}>
                {isDetecting ? "Detecting..." : "I'm at a WashWorld station"}
              </Text>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push("/stations")}
              >
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: COLORS.teal[100] },
                  ]}
                >
                  <MapPin size={20} color={COLORS.teal[600]} />
                </View>
                <Text style={styles.actionText}>Find Stations</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push("/membership")}
              >
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: COLORS.accent[100] },
                  ]}
                >
                  <Droplets size={20} color={COLORS.accent[600]} />
                </View>
                <Text style={styles.actionText}>Membership</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {recentWashes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Washes</Text>
              <TouchableOpacity onPress={() => router.push("/history")}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {recentWashes.slice(0, 1).map((wash) => (
              <TouchableOpacity
                key={wash.id}
                style={styles.recentWashCard}
                onPress={() => router.push(`/wash-detail/${wash.id}`)}
              >
                <View style={styles.recentWashHeader}>
                  <View style={styles.washTypeIcon}>
                    <Droplets size={18} color={COLORS.primary[600]} />
                  </View>
                  <View style={styles.recentWashInfo}>
                    <Text style={styles.recentWashType}>
                      {wash.washType.name}
                    </Text>
                    <View style={styles.washStatusContainer}>
                      <View style={styles.completedDot} />
                      <Text style={styles.washStatus}>Completed</Text>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.recentWashPrice}>{wash.price} kr</Text>
                  </View>
                </View>

                <View style={styles.recentWashDetails}>
                  <View style={styles.detailItem}>
                    <Clock size={14} color={COLORS.gray[500]} />
                    <Text style={styles.detailText}>{wash.date}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <MapPin size={14} color={COLORS.gray[500]} />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {wash.station.name}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Car size={14} color={COLORS.gray[500]} />
                    <Text style={styles.detailText}>{wash.licensePlate}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Stations</Text>
            <TouchableOpacity onPress={() => router.push("/stations")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {nearbyStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
              onPress={() => handleStationPress(station.id)}
            />
          ))}
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Membership Plans</Text>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/membership")}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={memberships}
            renderItem={({ item }) => (
              <MembershipCard
                membership={item}
                onPress={() => router.push("/(modals)/membership")}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.membershipContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  return (
    <Suspense fallback={<HomeScreenSkeleton />}>
      <HomeScreenContent />
    </Suspense>
  );
}

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
  greeting: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#FFF",
  },
  subGreeting: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.primary[100],
    opacity: 0.9,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  quickActions: {
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
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  scanIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  scanText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: COLORS.primary[700],
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: COLORS.gray[800],
  },
  activeWashCard: {
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
  activeWashHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success[500],
    marginRight: 8,
  },
  activeWashLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: COLORS.success[700],
  },
  activeWashDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activeWashInfo: {
    flex: 1,
  },
  activeWashType: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  activeWashLocation: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
  },
  viewButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#FFF",
  },
  section: {
    padding: 24,
    paddingTop: 0,
  },
  lastSection: {
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
  },
  seeAllText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: COLORS.primary[600],
  },
  membershipContainer: {
    paddingRight: 16,
  },
  recentWashCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  recentWashHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  washTypeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  recentWashInfo: {
    flex: 1,
  },
  recentWashType: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
    marginBottom: 6,
  },
  washStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  completedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success[500],
    marginRight: 6,
  },
  washStatus: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
    color: COLORS.success[700],
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  recentWashPrice: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: COLORS.primary[700],
  },
  recentWashDetails: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 8,
    flex: 1,
  },
  cardIcon: {
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  cardIconText: {
    fontSize: 10,
  },
  activeWashBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary[600],
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeWashText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#FFF",
    flex: 1,
  },
  viewText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#FFF",
    opacity: 0.8,
  },
});
