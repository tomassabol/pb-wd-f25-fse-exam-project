import { useState, useEffect, Suspense, use, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { useWash } from "@/hooks/useWash";
import { useAuth } from "@/hooks/useAuth";
import { useStartWashMutation } from "@/hooks/car-wash-hooks";
import { useUserMembershipsSuspenseQuery } from "@/hooks/memberships-hooks";
import { WashType } from "@/types/wash";
import { ArrowLeft, ChevronRight, CreditCard, User } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { WashTypesList } from "@/components/wash/WashTypesList";
import { WashTypeListSkeleton } from "@/components/skeletons/WashTypeSkeleton";

export default function WashSelectorScreen() {
  const { user } = useAuth();
  const { licensePlate, selectedStationId, startWash } = useWash();
  const startWashMutation = useStartWashMutation();
  const { data: userMemberships } = useUserMembershipsSuspenseQuery();
  const { stationId } = useLocalSearchParams<{ stationId?: string }>();

  // Use station ID from context if available, otherwise fall back to route params
  const effectiveStationId = selectedStationId || stationId;
  const [selectedWashType, setSelectedWashType] = useState<WashType | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isSubscriptionDialogVisible, setIsSubscriptionDialogVisible] =
    useState(false);
  const animationProgress = useSharedValue(0);

  useEffect(() => {
    animationProgress.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: animationProgress.value,
      transform: [{ translateY: (1 - animationProgress.value) * 50 }],
    };
  });

  // Helper function to check if user has a valid subscription
  const hasValidSubscription = useCallback(() => {
    if (!userMemberships || userMemberships.length === 0) {
      return false;
    }

    const now = new Date();
    return userMemberships.some(
      (membership) =>
        membership.isActive && new Date(membership.expiresAt) > now
    );
  }, [userMemberships]);

  // Helper function to determine if a wash type requires membership
  const requiresMembership = useCallback((washType: WashType) => {
    // Premium wash types (price > 120) or specific premium wash types
    const premiumWashTypes = ["premium", "deluxe", "platinum", "gold"];
    const washTypeName = washType.name.toLowerCase();

    return (
      washType.price > 120 ||
      premiumWashTypes.some((premium) => washTypeName.includes(premium))
    );
  }, []);

  const handleWashSelection = useCallback(
    (washType: WashType) => {
      console.log("Wash type selected:", washType.name, washType.id);
      setSelectedWashType(washType);

      // Show subscription dialog for premium washes if user doesn't have a valid subscription
      if (requiresMembership(washType) && !hasValidSubscription()) {
        setIsSubscriptionDialogVisible(true);
      } else if (requiresMembership(washType) && hasValidSubscription()) {
        // Automatically set payment method to membership for premium washes if user has valid subscription
        setPaymentMethod("membership");
      } else {
        // Reset to card payment for basic washes
        setPaymentMethod("card");
      }
    },
    [requiresMembership, hasValidSubscription]
  );

  const handleStartWash = useCallback(async () => {
    if (!selectedWashType) {
      Alert.alert("Please select a wash type");
      return;
    }

    if (!licensePlate) {
      Alert.alert(
        "License plate not detected",
        "Please scan your license plate first"
      );
      return;
    }

    try {
      // Use the effective station ID (from context or route params), or fall back to a default
      const washingStationId = effectiveStationId || "ww_cph1";

      // Get the active membership ID if using membership payment
      let membershipId: string | undefined;
      if (paymentMethod === "membership") {
        const activeMembership = userMemberships?.find(
          (membership) =>
            membership.isActive && new Date(membership.expiresAt) > new Date()
        );

        if (!activeMembership) {
          Alert.alert(
            "No Active Membership",
            "You don't have an active membership. Please select a different payment method or subscribe to a membership plan."
          );
          return;
        }

        membershipId = activeMembership.membershipId || undefined;
      }

      // Start the wash via API
      await startWashMutation.mutateAsync({
        licensePlate,
        washingStationId,
        washTypeId: selectedWashType.id,
        paymentMethod: paymentMethod as "membership" | "card" | "mobile_pay",
        amount: selectedWashType.price,
        currency: selectedWashType.currency,
        // Add membershipId if payment method is membership
        ...(paymentMethod === "membership" &&
          membershipId && {
            membershipId,
          }),
      });

      // Update the local wash context with the active wash
      startWash(selectedWashType, washingStationId);

      // Navigate to wash progress on success
      router.push("/(modals)/wash-progress");
    } catch (error) {
      console.error("Failed to start wash:", error);
      Alert.alert(
        "Failed to start wash",
        "Please try again or contact support if the problem persists."
      );
    }
  }, [
    selectedWashType,
    licensePlate,
    effectiveStationId,
    paymentMethod,
    userMemberships,
    startWash,
  ]);

  const handleSubscriptionDialogClose = useCallback(() => {
    setIsSubscriptionDialogVisible(false);
  }, []);

  const handleSubscriptionSelect = useCallback(() => {
    router.push("/membership");
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, containerStyle]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={COLORS.gray[800]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Wash Type</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.licenseContainer}>
          <Text style={styles.licenseLabel}>License Plate Detected</Text>
          <View style={styles.licensePlate}>
            <View style={styles.euBand}>
              <Text style={styles.countryCode}>DK</Text>
            </View>
            <View style={styles.plateNumberContainer}>
              <Text style={styles.licensePlateText}>
                {licensePlate || "AB 12 345"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.washTypesSection}>
          <Text style={styles.sectionTitle}>Wash Packages</Text>
          <Suspense fallback={<WashTypeListSkeleton />}>
            <WashTypesList
              selectedWashType={selectedWashType}
              onWashTypeSelect={handleWashSelection}
            />
          </Suspense>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "card" && styles.selectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod("card")}
            >
              <CreditCard
                size={24}
                color={
                  paymentMethod === "card"
                    ? COLORS.primary[600]
                    : COLORS.gray[600]
                }
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentMethod === "card" && styles.selectedPaymentOptionText,
                ]}
              >
                Credit Card
              </Text>
              {paymentMethod === "card" && (
                <View style={styles.selectedPaymentDot} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "membership" && styles.selectedPaymentOption,
                !hasValidSubscription() && styles.disabledPaymentOption,
              ]}
              onPress={() =>
                hasValidSubscription() && setPaymentMethod("membership")
              }
              disabled={!hasValidSubscription()}
            >
              <User
                size={24}
                color={
                  !hasValidSubscription()
                    ? COLORS.gray[400]
                    : paymentMethod === "membership"
                      ? COLORS.primary[600]
                      : COLORS.gray[600]
                }
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  paymentMethod === "membership" &&
                    styles.selectedPaymentOptionText,
                  !hasValidSubscription() && styles.disabledPaymentOptionText,
                ]}
              >
                Membership {!hasValidSubscription() && "(Not Available)"}
              </Text>
              {paymentMethod === "membership" && (
                <View style={styles.selectedPaymentDot} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.spacer} />

        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.totalPriceLabel}>Total Price</Text>
            <Text style={styles.totalPrice}>
              {selectedWashType ? `${selectedWashType.price} kr` : "0 kr"}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.startButton,
              (!selectedWashType || startWashMutation.isPending) &&
                styles.disabledButton,
            ]}
            onPress={handleStartWash}
            disabled={!selectedWashType || startWashMutation.isPending}
          >
            <Text style={styles.startButtonText}>
              {startWashMutation.isPending ? "Starting..." : "Start Wash"}
            </Text>
            {!startWashMutation.isPending && (
              <ChevronRight size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {isSubscriptionDialogVisible && (
        <View style={styles.subscriptionOverlay}>
          <View style={styles.subscriptionDialog}>
            <Text style={styles.subscriptionTitle}>Membership Required</Text>
            <Text style={styles.subscriptionDescription}>
              The {selectedWashType?.name} requires an active membership.
              Subscribe to enjoy unlimited premium washes and save up to 30% on
              every wash. Plans starting from only 299 kr/month.
            </Text>

            <View style={styles.savingsContainer}>
              <View style={styles.savingItem}>
                <Text style={styles.savingAmount}>30%</Text>
                <Text style={styles.savingLabel}>Discount</Text>
              </View>
              <View style={styles.savingDivider} />
              <View style={styles.savingItem}>
                <Text style={styles.savingAmount}>∞</Text>
                <Text style={styles.savingLabel}>Washes</Text>
              </View>
              <View style={styles.savingDivider} />
              <View style={styles.savingItem}>
                <Text style={styles.savingAmount}>24/7</Text>
                <Text style={styles.savingLabel}>Access</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.membershipButton}
              onPress={handleSubscriptionSelect}
            >
              <Text style={styles.membershipButtonText}>
                View Membership Options
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSubscriptionDialogClose}
            >
              <Text style={styles.skipButtonText}>
                Continue without membership
              </Text>
            </TouchableOpacity>
          </View>
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
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
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
  licenseContainer: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  licenseLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 8,
  },
  licensePlate: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#000000",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: "center",
    maxWidth: 200,
  },
  euBand: {
    backgroundColor: "#003399",
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 32,
  },
  euStars: {
    color: "#FFD700",
    fontSize: 6,
    lineHeight: 8,
    letterSpacing: -1,
  },
  countryCode: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    fontSize: 10,
    marginTop: 2,
  },
  plateNumberContainer: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  licensePlateText: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: "#000000",
    letterSpacing: 2,
  },
  sectionContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  washTypesSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
    marginBottom: 16,
  },

  paymentOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    padding: 16,
    marginHorizontal: 4,
    position: "relative",
  },
  selectedPaymentOption: {
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.primary[50],
  },
  disabledPaymentOption: {
    opacity: 0.5,
    backgroundColor: COLORS.gray[100],
  },
  paymentOptionText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: COLORS.gray[700],
    marginLeft: 12,
  },
  selectedPaymentOptionText: {
    color: COLORS.primary[700],
  },
  disabledPaymentOptionText: {
    color: COLORS.gray[500],
  },
  selectedPaymentDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary[600],
  },
  spacer: {
    height: 24,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    marginTop: "auto",
  },
  totalPriceLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 4,
  },
  totalPrice: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: COLORS.gray[900],
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: COLORS.gray[400],
  },
  startButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFF",
    marginRight: 8,
  },
  subscriptionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  subscriptionDialog: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
  },
  subscriptionTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: COLORS.gray[900],
    marginBottom: 16,
    textAlign: "center",
  },
  subscriptionDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[700],
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 24,
  },
  savingsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  savingItem: {
    flex: 1,
    alignItems: "center",
  },
  savingAmount: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: COLORS.primary[700],
    marginBottom: 4,
  },
  savingLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
  },
  savingDivider: {
    width: 1,
    height: "100%",
    backgroundColor: COLORS.gray[200],
  },
  membershipButton: {
    backgroundColor: COLORS.primary[600],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  membershipButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FFF",
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  skipButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: COLORS.gray[600],
  },
});
