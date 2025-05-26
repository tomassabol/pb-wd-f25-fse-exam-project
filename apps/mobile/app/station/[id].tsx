import { useState, useEffect, Suspense, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/colors";
import {
  ArrowLeft,
  Clock,
  Heart,
  Navigation,
  Star,
  Car,
  Droplets,
  MapPin,
  Phone,
  CircleCheck as CheckCircle,
} from "lucide-react-native";

import { useWash } from "@/hooks/useWash";
import { useAuth } from "@/hooks/useAuth";
import {
  useAddWashingStationToFavoritesMutation,
  useRemoveWashingStationFromFavoritesMutation,
  useWashingStationByIdSuspenseQuery,
} from "@/hooks/washing-stations-hooks";
import { useMembershipsSuspenseQuery } from "@/hooks/memberships-hooks";
import { transformWashingStationToStation } from "@/utils/stationTransform";
import { useLocation } from "@/contexts/LocationContext";
import { StationMap } from "@/components/stations/StationMap";
import { MembershipCard } from "@/components/membership/MembershipCard";
import { StationDetailSkeleton } from "@/components/skeletons/StationDetailSkeleton";
import { openMapsWithDirections } from "@/utils/mapUtils";

function StationDetailContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { detectLicensePlate } = useWash();
  const { userLocation } = useLocation();
  const { data: washingStation } = useWashingStationByIdSuspenseQuery(id!);
  const { data: memberships } = useMembershipsSuspenseQuery();
  const { mutateAsync: addWashingStationToFavorites } =
    useAddWashingStationToFavoritesMutation();
  const { mutateAsync: removeWashingStationFromFavorites } =
    useRemoveWashingStationFromFavoritesMutation();
  const [scrollY] = useState(new Animated.Value(0));

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Transform the washing station data to Station format
  const station = transformWashingStationToStation(
    washingStation,
    userLocation
      ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
      : undefined
  );

  const toggleFavorite = useCallback(async () => {
    if (washingStation.isFavorite) {
      return await removeWashingStationFromFavorites(washingStation.id);
    }

    return await addWashingStationToFavorites(washingStation.id);
  }, [
    washingStation.isFavorite,
    addWashingStationToFavorites,
    removeWashingStationFromFavorites,
  ]);

  const handleScanPress = () => {
    if (user?.licensePlate) {
      detectLicensePlate(user.licensePlate);
      router.push("/(modals)/wash-selector");
    }
  };

  const handleGetDirections = () => {
    openMapsWithDirections(station.coordinate, station.name);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.animatedHeader, { opacity: headerOpacity }]}
      >
        <SafeAreaView style={styles.headerSafeArea} edges={["top"]}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{station.name}</Text>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={toggleFavorite}
            >
              <Heart
                size={20}
                color="#FFF"
                fill={washingStation.isFavorite ? "#FFF" : "transparent"}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: station.imageUrl }}
            style={styles.stationImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.imageForeground}
          >
            <SafeAreaView style={styles.imageSafeArea}>
              <View style={styles.imageNavigation}>
                <TouchableOpacity
                  style={styles.navigationButton}
                  onPress={() => router.back()}
                >
                  <ArrowLeft size={20} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.navigationButton}
                  onPress={toggleFavorite}
                >
                  <Heart
                    size={20}
                    color="#FFF"
                    fill={washingStation.isFavorite ? "#FFF" : "transparent"}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.stationInfoContainer}>
                <Text style={styles.stationName}>{station.name}</Text>
                <Text style={styles.stationAddress}>{station.address}</Text>

                <View style={styles.badgeContainer}>
                  {station.isOpen ? (
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: COLORS.success[500] },
                      ]}
                    >
                      <Text style={styles.badgeText}>Open Now</Text>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: COLORS.error[500] },
                      ]}
                    >
                      <Text style={styles.badgeText}>Closed</Text>
                    </View>
                  )}

                  {station.type.map((type, index) => (
                    <View
                      key={index}
                      style={[
                        styles.badge,
                        { backgroundColor: COLORS.primary[500] },
                        index > 0 && { marginLeft: 8 },
                      ]}
                    >
                      <Text style={styles.badgeText}>
                        {type === "manual" ? "Manual Wash" : "Automatic Wash"}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleScanPress}
            >
              <Car size={24} color="#FFF" />
              <Text style={styles.actionButtonText}>Start Wash</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={handleGetDirections}
            >
              <Navigation size={24} color={COLORS.primary[600]} />
              <Text style={styles.secondaryButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Star size={20} color={COLORS.warning[500]} />
              </View>
              <View>
                <Text style={styles.detailValue}>{station.rating}</Text>
                <Text style={styles.detailLabel}>Rating</Text>
              </View>
            </View>

            <View style={styles.detailSeparator} />

            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Clock size={20} color={COLORS.info[500]} />
              </View>
              <View>
                <Text style={styles.detailValue}>{station.hours}</Text>
                <Text style={styles.detailLabel}>Hours</Text>
              </View>
            </View>

            <View style={styles.detailSeparator} />

            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Droplets size={20} color={COLORS.primary[500]} />
              </View>
              <View>
                <Text style={styles.detailValue}>{station.waitTime} min</Text>
                <Text style={styles.detailLabel}>Wait Time</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{station.description}</Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Available Services</Text>
            <View style={styles.servicesContainer}>
              {station.services.map((service, index) => (
                <View key={index} style={styles.serviceItem}>
                  <CheckCircle size={16} color={COLORS.success[500]} />
                  <Text style={styles.serviceText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.mapContainer}>
              <StationMap
                stations={[station]}
                initialRegion={{
                  latitude: station.coordinate.latitude,
                  longitude: station.coordinate.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                onStationPress={() => {}}
              />
            </View>

            <View style={styles.locationInfo}>
              <View style={styles.locationInfoItem}>
                <MapPin size={20} color={COLORS.primary[600]} />
                <Text style={styles.locationInfoText}>{station.address}</Text>
              </View>

              <View style={styles.locationInfoItem}>
                <Phone size={20} color={COLORS.primary[600]} />
                <Text style={styles.locationInfoText}>{station.phone}</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Membership Plans</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.membershipContainer}
            >
              {memberships.map((membership) => (
                <MembershipCard
                  key={membership.id}
                  membership={membership}
                  onPress={() => router.push("/(modals)/membership")}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: COLORS.gray[600],
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: COLORS.primary[600],
  },
  headerSafeArea: {
    width: "100%",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#FFF",
  },
  imageContainer: {
    height: 300,
    position: "relative",
  },
  stationImage: {
    width: "100%",
    height: "100%",
  },
  imageForeground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageSafeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  imageNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  stationInfoContainer: {
    padding: 16,
  },
  stationName: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#FFF",
    marginBottom: 4,
  },
  stationAddress: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#FFF",
    opacity: 0.9,
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: "row",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#FFF",
  },
  contentContainer: {
    padding: 24,
  },
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary[600],
    borderRadius: 12,
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: COLORS.primary[50],
    borderWidth: 1,
    borderColor: COLORS.primary[200],
    marginRight: 0,
    marginLeft: 8,
  },
  actionButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFF",
    marginLeft: 8,
  },
  secondaryButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: COLORS.primary[600],
    marginLeft: 8,
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
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailValue: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: COLORS.gray[900],
  },
  detailLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
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
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
    marginBottom: 16,
  },
  aboutText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[700],
    lineHeight: 24,
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
  serviceText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[700],
    marginLeft: 8,
  },

  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
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
  locationInfoText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[700],
    marginLeft: 12,
  },
  membershipContainer: {
    paddingRight: 16,
  },
});

export default function StationDetailScreen() {
  return (
    <Suspense fallback={<StationDetailSkeleton />}>
      <StationDetailContent />
    </Suspense>
  );
}
