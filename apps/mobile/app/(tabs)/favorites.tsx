import { Suspense, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { StationCard } from "@/components/stations/StationCard";
import { Heart } from "lucide-react-native";
import {
  useRemoveWashingStationFromFavoritesMutation,
  useUserFavoriteWashingStationsSuspenseQuery,
} from "@/hooks/washing-stations-hooks";
import { StationsSkeleton } from "@/components/stations/StationsSkeleton";

export function FavoritesContent() {
  const { data: favoriteStations } =
    useUserFavoriteWashingStationsSuspenseQuery();
  const { mutateAsync: removeFromFavorites } =
    useRemoveWashingStationFromFavoritesMutation();

  const handleStationPress = useCallback(
    (stationId: string) => {
      router.push(`/station/${stationId}`);
    },
    [router]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorite Stations</Text>
      </View>

      <FlatList
        data={favoriteStations}
        renderItem={({ item }) => (
          <StationCard
            station={item}
            onPress={() => handleStationPress(item.id)}
            onFavoritePress={() => removeFromFavorites(item.id)}
            showFavoriteButton
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.stationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Heart size={32} color={COLORS.primary[600]} />
            </View>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyMessage}>
              Save your favorite wash stations for quick access
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push("/stations")}
            >
              <Text style={styles.browseButtonText}>Browse Stations</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    paddingBottom: 16,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: COLORS.gray[900],
  },
  stationsList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 24,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary[100],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  emptyMessage: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFF",
  },
});

export default function FavoritesScreen() {
  return (
    <Suspense fallback={<StationsSkeleton />}>
      <FavoritesContent />
    </Suspense>
  );
}
