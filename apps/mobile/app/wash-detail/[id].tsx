import { Suspense } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Download,
  Calendar,
  Check,
  Car,
  CreditCard,
} from "lucide-react-native";
import { useCarWashByIdSuspenseQuery } from "@/hooks/car-wash-hooks";
import { ErrorBoundary } from "react-error-boundary";
import { WashHistory } from "@/types/wash";

// Loading skeleton component
function WashDetailSkeleton() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wash Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header skeleton */}
        <View style={styles.washHeader}>
          <View style={[styles.washImage, styles.skeletonBox]} />
          <View style={styles.washTypeContainer}>
            <View
              style={[
                styles.skeletonText,
                { width: "70%", height: 24, marginBottom: 8 },
              ]}
            />
            <View
              style={[
                styles.skeletonText,
                { width: "90%", height: 16, marginBottom: 4 },
              ]}
            />
            <View style={[styles.skeletonText, { width: "80%", height: 16 }]} />
          </View>
        </View>

        {/* Info card skeleton */}
        <View style={styles.section}>
          <View
            style={[
              styles.skeletonText,
              { width: "40%", height: 20, marginBottom: 12 },
            ]}
          />
          <View style={styles.infoCard}>
            {[...Array(6)].map((_, index) => (
              <View key={index}>
                <View style={styles.infoRow}>
                  <View
                    style={[styles.skeletonText, { width: "30%", height: 16 }]}
                  />
                  <View
                    style={[styles.skeletonText, { width: "40%", height: 16 }]}
                  />
                </View>
                {index < 5 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Services skeleton */}
        <View style={styles.section}>
          <View
            style={[
              styles.skeletonText,
              { width: "35%", height: 20, marginBottom: 12 },
            ]}
          />
          <View style={styles.servicesCard}>
            {[...Array(4)].map((_, index) => (
              <View key={index} style={styles.serviceRow}>
                <View
                  style={[
                    styles.skeletonBox,
                    { width: 20, height: 20, borderRadius: 10 },
                  ]}
                />
                <View
                  style={[
                    styles.skeletonText,
                    { width: "60%", height: 16, marginLeft: 12 },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Payment skeleton */}
        <View style={styles.section}>
          <View
            style={[
              styles.skeletonText,
              { width: "45%", height: 20, marginBottom: 12 },
            ]}
          />
          <View style={styles.paymentCard}>
            {[...Array(3)].map((_, index) => (
              <View key={index} style={styles.paymentRow}>
                <View
                  style={[styles.skeletonText, { width: "40%", height: 16 }]}
                />
                <View
                  style={[styles.skeletonText, { width: "25%", height: 16 }]}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Actions skeleton */}
        <View style={styles.actionsContainer}>
          <View
            style={[
              styles.skeletonBox,
              { height: 56, borderRadius: 12, marginBottom: 16 },
            ]}
          />
          <View
            style={[styles.skeletonBox, { height: 56, borderRadius: 12 }]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wash Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.errorContainer}>
        <View style={styles.errorIconContainer}>
          <Calendar size={32} color={COLORS.error[600]} />
        </View>
        <Text style={styles.errorTitle}>Unable to load wash details</Text>
        <Text style={styles.errorMessage}>
          Please check your connection and try again.
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

// Main wash detail content component
function WashDetailContent() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    router.back();
    return null;
  }

  const { data: washDetail } = useCarWashByIdSuspenseQuery(id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wash Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.washHeader}>
          <Image
            source={{ uri: washDetail.washType.imageUrl }}
            style={styles.washImage}
          />
          <View style={styles.washTypeContainer}>
            <Text style={styles.washType}>{washDetail.washType.name}</Text>
            <View style={styles.washInfoRow}>
              <Calendar size={16} color={COLORS.gray[500]} />
              <Text style={styles.washDate}>{washDetail.date}</Text>
            </View>
            <View style={styles.washInfoRow}>
              <MapPin size={16} color={COLORS.gray[500]} />
              <Text style={styles.washLocation}>{washDetail.station.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wash Information</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Wash Type</Text>
              <Text style={styles.infoValue}>{washDetail.washType.name}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date & Time</Text>
              <Text style={styles.infoValue}>{washDetail.date}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{washDetail.station.name}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{washDetail.duration} min</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>License Plate</Text>
              <Text style={styles.infoValue}>{washDetail.licensePlate}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>{washDetail.paymentMethod}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Wash Services</Text>
          </View>

          <View style={styles.servicesCard}>
            {washDetail.services.map((service, index) => (
              <View key={index} style={styles.serviceRow}>
                <Check size={20} color={COLORS.success[500]} />
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
          </View>

          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>
                {washDetail.washType.name}
              </Text>
              <Text style={styles.paymentValue}>{washDetail.price} kr</Text>
            </View>

            {washDetail.extras &&
              washDetail.extras.map((extra, index) => (
                <View key={index} style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>{extra.name}</Text>
                  <Text style={styles.paymentValue}>{extra.price} kr</Text>
                </View>
              ))}

            {washDetail.discount && (
              <View style={styles.paymentRow}>
                <Text style={styles.discountLabel}>
                  {washDetail.discount.name}
                </Text>
                <Text style={styles.discountValue}>
                  -{washDetail.discount.amount} kr
                </Text>
              </View>
            )}

            <View style={styles.totalDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{washDetail.price} kr</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.invoiceButton}
            onPress={() => {
              // For now, just show a console log since invoice route doesn't exist
              console.log("Download invoice for wash:", washDetail.id);
            }}
          >
            <Download size={20} color="#FFF" />
            <Text style={styles.invoiceButtonText}>Download Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.repeatButton}
            onPress={() =>
              router.push(`/station/${washDetail.station.id}` as any)
            }
          >
            <Text style={styles.repeatButtonText}>Repeat Wash</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Main component with error boundary and suspense
export default function WashDetailScreen() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<WashDetailSkeleton />}>
        <WashDetailContent />
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    backgroundColor: "#FFF",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
  },
  washHeader: {
    flexDirection: "row",
    padding: 24,
    backgroundColor: "#FFF",
  },
  washImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  washTypeContainer: {
    flex: 1,
    justifyContent: "center",
  },
  washType: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  washInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  washDate: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 8,
  },
  washLocation: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 8,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
  },
  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[600],
  },
  infoValue: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: COLORS.gray[900],
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[200],
  },
  servicesCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  serviceText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: COLORS.gray[800],
    marginLeft: 12,
  },
  paymentCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  paymentLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[700],
  },
  paymentValue: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: COLORS.gray[900],
  },
  discountLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.success[700],
  },
  discountValue: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: COLORS.success[700],
  },
  totalDivider: {
    height: 1,
    backgroundColor: COLORS.gray[300],
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  totalLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
  },
  totalValue: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: COLORS.primary[700],
  },
  actionsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginTop: 8,
  },
  invoiceButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary[600],
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  invoiceButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFF",
    marginLeft: 8,
  },
  repeatButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary[200],
  },
  repeatButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: COLORS.primary[600],
  },
  // Skeleton styles
  skeletonBox: {
    backgroundColor: COLORS.gray[200],
    borderRadius: 8,
  },
  skeletonText: {
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
  },
  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
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
});
