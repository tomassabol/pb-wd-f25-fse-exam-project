import { useState, useMemo, Suspense, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Search,
  List,
  MapPin,
  ChevronRight,
  Navigation,
} from "lucide-react-native";
import { COLORS } from "@/constants/colors";
import { StationCard } from "@/components/stations/StationCard";
import { StationMap } from "@/components/stations/StationMap";
import { StationsSkeleton } from "@/components/stations/StationsSkeleton";
import {
  useAddWashingStationToFavoritesMutation,
  useRemoveWashingStationFromFavoritesMutation,
  useWashingStationsSuspenseQuery,
} from "@/hooks/washing-stations-hooks";
import { transformWashingStationsToStations } from "@/utils/stationTransform";
import { useLocation } from "@/contexts/LocationContext";
import { WashingStation } from "../../../api/db/schema";

const { width } = Dimensions.get("window");

function StationsContent() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Derive API filter parameters from selected filters
  const apiFilters = useMemo(() => {
    const filters: {
      isOpen?: boolean;
      isPremium?: boolean;
      type?: "manual" | "automatic";
      favorite?: boolean;
    } = {};

    if (selectedFilters.includes("Open Now")) {
      filters.isOpen = true;
    }
    if (selectedFilters.includes("Premium")) {
      filters.isPremium = true;
    }
    if (selectedFilters.includes("Favorites")) {
      filters.favorite = true;
    }
    if (
      selectedFilters.includes("Manual") &&
      !selectedFilters.includes("Automatic")
    ) {
      filters.type = "manual";
    } else if (
      selectedFilters.includes("Automatic") &&
      !selectedFilters.includes("Manual")
    ) {
      filters.type = "automatic";
    }

    return filters;
  }, [selectedFilters]);

  const { data: washingStations } = useWashingStationsSuspenseQuery(apiFilters);

  const {
    userLocation,
    hasLocationPermission,
    requestLocationPermission,
    isLocationLoading,
  } = useLocation();

  const { mutateAsync: addWashingStationToFavorites } =
    useAddWashingStationToFavoritesMutation();

  const { mutateAsync: removeWashingStationFromFavorites } =
    useRemoveWashingStationFromFavoritesMutation();

  const handleFavoritePress = useCallback(
    async (station: WashingStation & { isFavorite: boolean }) => {
      if (station.isFavorite) {
        return await removeWashingStationFromFavorites(station.id);
      }
      return await addWashingStationToFavorites(station.id);
    },
    [addWashingStationToFavorites, removeWashingStationFromFavorites]
  );

  // Transform, filter by search, and sort stations by distance
  const stations = useMemo(() => {
    const transformed = transformWashingStationsToStations(
      washingStations,
      userLocation ?? { latitude: 0, longitude: 0 }
    );

    // Apply search filter (only local filtering needed since API handles other filters)
    let filtered = transformed;
    if (searchQuery) {
      filtered = transformed.filter(
        (station) =>
          station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => a.distance - b.distance);
  }, [washingStations, userLocation, searchQuery]);

  const filters = ["Manual", "Automatic", "Open Now", "Favorites", "Premium"];

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleStationPress = useCallback(
    (stationId: string) => {
      router.push(`/station/${stationId}`);
    },
    [router]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Wash Stations</Text>
          <TouchableOpacity
            style={[
              styles.locationButton,
              hasLocationPermission && styles.locationButtonActive,
            ]}
            onPress={requestLocationPermission}
            disabled={isLocationLoading}
          >
            <Navigation
              size={16}
              color={
                hasLocationPermission ? COLORS.success[600] : COLORS.gray[500]
              }
            />
          </TouchableOpacity>
        </View>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === "list" && styles.activeToggle,
            ]}
            onPress={() => setViewMode("list")}
          >
            <List
              size={20}
              color={
                viewMode === "list" ? COLORS.primary[600] : COLORS.gray[500]
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === "map" && styles.activeToggle,
            ]}
            onPress={() => setViewMode("map")}
          >
            <MapPin
              size={20}
              color={
                viewMode === "map" ? COLORS.primary[600] : COLORS.gray[500]
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color={COLORS.gray[500]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stations"
            placeholderTextColor={COLORS.gray[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          data={filters}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilters.includes(item) && styles.activeFilterChip,
              ]}
              onPress={() => toggleFilter(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilters.includes(item) && styles.activeFilterText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.filtersList}
        />
      </View>

      {viewMode === "list" ? (
        <FlatList
          data={washingStations}
          renderItem={({ item }) => (
            <StationCard
              station={item}
              onFavoritePress={() => handleFavoritePress(item)}
              onPress={() => handleStationPress(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.stationsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No stations found</Text>
              <Text style={styles.emptyMessage}>
                Try changing your search or filters
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.mapContainer}>
          <StationMap stations={stations} onStationPress={handleStationPress} />

          {stations.length > 0 && (
            <View style={styles.carouselContainer}>
              <FlatList
                data={stations}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={width - 80}
                decelerationRate="fast"
                contentContainerStyle={styles.carouselContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.carouselCard}
                    onPress={() => handleStationPress(item.id)}
                  >
                    <View style={styles.carouselCardContent}>
                      <View>
                        <Text style={styles.carouselStationName}>
                          {item.name}
                        </Text>
                        <Text style={styles.carouselStationAddress}>
                          {item.address}
                        </Text>
                        <View style={styles.carouselBadges}>
                          <View
                            style={[
                              styles.carouselBadge,
                              {
                                backgroundColor: item.isOpen
                                  ? COLORS.success[100]
                                  : COLORS.gray[200],
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.carouselBadgeText,
                                {
                                  color: item.isOpen
                                    ? COLORS.success[700]
                                    : COLORS.gray[600],
                                },
                              ]}
                            >
                              {item.isOpen ? "Open" : "Closed"}
                            </Text>
                          </View>
                          {item.type.map((type: string, index: number) => (
                            <View
                              key={index}
                              style={[
                                styles.carouselBadge,
                                { backgroundColor: COLORS.primary[100] },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.carouselBadgeText,
                                  { color: COLORS.primary[700] },
                                ]}
                              >
                                {type === "manual" ? "Manual" : "Automatic"}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                      <View style={styles.distanceContainer}>
                        <Text style={styles.distanceText}>
                          {item.distance} km
                        </Text>
                        <ChevronRight size={20} color={COLORS.primary[600]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: COLORS.gray[900],
    marginRight: 12,
  },
  locationButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray[100],
    justifyContent: "center",
    alignItems: "center",
  },
  locationButtonActive: {
    backgroundColor: COLORS.success[100],
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    overflow: "hidden",
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  activeToggle: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[900],
    marginLeft: 8,
  },
  filtersContainer: {
    paddingVertical: 8,
  },
  filtersList: {
    paddingHorizontal: 24,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.gray[100],
    borderRadius: 40,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary[100],
  },
  filterText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: COLORS.gray[700],
  },
  activeFilterText: {
    color: COLORS.primary[700],
  },
  stationsList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  emptyTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  emptyMessage: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: "center",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  carouselContainer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
  },
  carouselContent: {
    paddingHorizontal: 24,
  },
  carouselCard: {
    width: width - 80,
    marginRight: 12,
    backgroundColor: "#FFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  carouselCardContent: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  carouselStationName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  carouselStationAddress: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 8,
  },
  carouselBadges: {
    flexDirection: "row",
  },
  carouselBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  carouselBadgeText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: COLORS.primary[700],
    marginRight: 4,
  },
});

export default function StationsScreen() {
  return (
    <Suspense fallback={<StationsSkeleton />}>
      <StationsContent />
    </Suspense>
  );
}
