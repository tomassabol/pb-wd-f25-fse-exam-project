import { useState, Suspense } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { useCarWashHistorySuspenseQuery } from "@/hooks/car-wash-hooks";
import {
  Calendar,
  Clock,
  CloudDownload as DownloadCloud,
  MapPin,
  Car,
  CreditCard,
  Droplets,
} from "lucide-react-native";
import { ErrorBoundary } from "react-error-boundary";
import { WashHistory } from "@/types/wash";

// Error fallback component
function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.errorContainer}>
        <View style={styles.errorIconContainer}>
          <Calendar size={32} color={COLORS.error[600]} />
        </View>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>
          Unable to load wash history. Please try again.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={resetErrorBoundary}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Loading component
function LoadingComponent() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wash History</Text>
      </View>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[600]} />
        <Text style={styles.loadingText}>Loading wash history...</Text>
      </View>
    </SafeAreaView>
  );
}

// Helper function to parse date from wash history format
function parseWashDate(dateString: string): Date | null {
  try {
    const dateStr = dateString.split(" • ")[0];

    // Try parsing the date string directly first
    let parsedDate = new Date(dateStr);

    // If that fails, try a more specific parsing approach
    if (isNaN(parsedDate.getTime())) {
      // Handle formats like "June 15, 2023"
      const parts = dateStr.split(", ");
      if (parts.length === 2) {
        const [monthDay, year] = parts;
        const [month, day] = monthDay.split(" ");

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const monthIndex = monthNames.findIndex((m) => m.startsWith(month));
        if (monthIndex !== -1) {
          parsedDate = new Date(parseInt(year), monthIndex, parseInt(day));
        }
      }
    }

    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  } catch (error) {
    console.warn("Error parsing date:", dateString, error);
    return null;
  }
}

// Main history content component
function HistoryContent() {
  const { data: washHistory } = useCarWashHistorySuspenseQuery();
  const [selectedPeriod, setSelectedPeriod] = useState("All");

  const periods = ["All", "This Month", "Last Month", "Last 3 Months"];

  const filteredHistory = washHistory.filter((wash: WashHistory) => {
    if (selectedPeriod === "All") {
      return true;
    }

    const washDate = parseWashDate(wash.date);
    const now = new Date();

    // If date parsing failed, exclude from specific filters
    if (!washDate) {
      return false;
    }

    if (selectedPeriod === "This Month") {
      return (
        washDate.getMonth() === now.getMonth() &&
        washDate.getFullYear() === now.getFullYear()
      );
    } else if (selectedPeriod === "Last Month") {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const lastMonthYear =
        now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return (
        washDate.getMonth() === lastMonth &&
        washDate.getFullYear() === lastMonthYear
      );
    } else if (selectedPeriod === "Last 3 Months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      return washDate >= threeMonthsAgo;
    }

    return true;
  });

  const handleWashPress = (washId: string) => {
    router.push(`/wash-detail/${washId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wash History</Text>
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          data={periods}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedPeriod === item && styles.activeFilterChip,
              ]}
              onPress={() => setSelectedPeriod(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedPeriod === item && styles.activeFilterText,
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

      <FlatList
        data={filteredHistory}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.washCard}
            onPress={() => handleWashPress(item.id)}
          >
            <View style={styles.washCardHeader}>
              <View style={styles.washTypeContainer}>
                <View style={styles.washTypeIcon}>
                  <Droplets size={18} color={COLORS.primary[600]} />
                </View>
                <View>
                  <Text style={styles.washTypeName}>{item.washType.name}</Text>
                  <View style={styles.washInfoRow}>
                    <Calendar size={14} color={COLORS.gray[500]} />
                    <Text style={styles.washInfoText}>{item.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.washPrice}>{item.price} kr</Text>
            </View>

            <View style={styles.washDetailRowFirst}>
              <View style={styles.washInfoDetail}>
                <MapPin size={16} color={COLORS.gray[500]} />
                <Text style={styles.washInfoDetailText}>
                  {item.station.name}
                </Text>
              </View>
              <View style={styles.washInfoDetail}>
                <Clock size={16} color={COLORS.gray[500]} />
                <Text style={styles.washInfoDetailText}>
                  {item.duration} min
                </Text>
              </View>
            </View>

            <View style={styles.washDetailRow}>
              <View style={styles.washInfoDetail}>
                <Car size={16} color={COLORS.gray[500]} />
                <Text style={styles.washInfoDetailText}>
                  {item.licensePlate}
                </Text>
              </View>
              <View style={styles.washInfoDetail}>
                <CreditCard size={16} color={COLORS.gray[500]} />
                <Text style={styles.washInfoDetailText}>
                  {item.paymentMethod}
                </Text>
              </View>
            </View>

            <View style={styles.washCardFooter}>
              <TouchableOpacity
                style={styles.invoiceButton}
                onPress={() => {
                  // For now, just show an alert since invoice route doesn't exist
                  console.log("Invoice for wash:", item.id);
                }}
              >
                <DownloadCloud size={16} color={COLORS.primary[600]} />
                <Text style={styles.invoiceButtonText}>Invoice</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.washList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Calendar size={32} color={COLORS.primary[600]} />
            </View>
            <Text style={styles.emptyTitle}>No wash history</Text>
            <Text style={styles.emptyMessage}>
              Your wash history will appear here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// Main component with error boundary and suspense
export default function HistoryScreen() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingComponent />}>
        <HistoryContent />
      </Suspense>
    </ErrorBoundary>
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
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: COLORS.gray[900],
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
  washList: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    paddingTop: 8,
  },
  washCard: {
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
  washCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  washTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  washTypeName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  washInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  washInfoText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 4,
  },
  washPrice: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: COLORS.primary[700],
  },
  washDetailRow: {
    flexDirection: "row",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  washDetailRowFirst: {
    flexDirection: "row",
    marginBottom: 12,
    paddingBottom: 12,
  },
  washInfoDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  washInfoDetailText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 4,
  },
  washCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  invoiceButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
    backgroundColor: COLORS.primary[50],
  },
  invoiceButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: COLORS.primary[700],
    marginLeft: 4,
  },
  detailsButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  detailsButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#FFF",
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
  },
  // Error and loading styles
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 24,
    flex: 1,
  },
  errorIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.error[100],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  errorTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  errorMessage: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFF",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 24,
    flex: 1,
  },
  loadingText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[600],
    marginTop: 16,
  },
});
