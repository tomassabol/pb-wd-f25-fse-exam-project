import React, { useState, Suspense } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  TextInput,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Calendar,
  Star,
  Zap,
  Shield,
  Car,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useMembershipsSuspenseQuery,
  useCreateMembershipMutation,
} from "@/hooks/memberships-hooks";
import { MembershipSkeleton } from "@/components/MembershipSkeleton";
import type { Membership as APIMembership } from "../../../api/db/schema/membership.schema";

type EnhancedMembership = APIMembership & {
  color: string;
  popular?: boolean;
  bestValue?: boolean;
  gradient: [string, string];
  icon: React.ElementType;
};

// Visual configuration for different membership types
const membershipVisualConfig: Record<
  string,
  {
    color: string;
    gradient: [string, string];
    icon: React.ElementType;
    popular?: boolean;
    bestValue?: boolean;
  }
> = {
  basic: {
    color: COLORS.primary[600],
    gradient: [COLORS.primary[500], COLORS.primary[700]],
    icon: Shield,
  },
  premium: {
    color: COLORS.accent[600],
    gradient: [COLORS.accent[500], COLORS.accent[700]],
    icon: Star,
    popular: true,
  },
  unlimited: {
    color: COLORS.teal[600],
    gradient: [COLORS.teal[500], COLORS.teal[700]],
    icon: Zap,
    bestValue: true,
  },
};

// Function to enhance API membership data with visual properties
const enhanceMembership = (membership: APIMembership): EnhancedMembership => {
  const config = membershipVisualConfig[membership.name.toLowerCase()] || {
    color: COLORS.gray[600],
    gradient: [COLORS.gray[500], COLORS.gray[700]],
    icon: Shield,
  };

  return { ...membership, ...config };
};

function MembershipContent() {
  const { data: apiMemberships } = useMembershipsSuspenseQuery();
  const memberships = apiMemberships.map(enhanceMembership);
  const createMembershipMutation = useCreateMembershipMutation();

  const [selectedMembership, setSelectedMembership] =
    useState<EnhancedMembership | null>(null);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [licensePlate, setLicensePlate] = useState("");

  const calculateSavings = (membership: EnhancedMembership) => {
    if (!membership.originalPrice) return 0;
    return Math.round(
      ((membership.originalPrice - membership.price) /
        membership.originalPrice) *
        100
    );
  };

  const handleSubscription = async () => {
    if (!selectedMembership || !selectedPayment || !licensePlate.trim()) {
      Alert.alert(
        "Missing Information",
        "Please select a membership plan, payment method, and enter your license plate."
      );
      return;
    }

    try {
      await createMembershipMutation.mutateAsync({
        membershipId: selectedMembership.id,
        licensePlate: licensePlate.trim(),
      });

      Alert.alert(
        "Success!",
        `You have successfully subscribed to the ${selectedMembership.name} plan!`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Subscription Failed",
        "There was an error processing your subscription. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <React.Fragment>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Unlimited Car Washes</Text>
          <Text style={styles.heroSubtitle}>
            Choose the perfect plan for your car care needs
          </Text>
          <View style={styles.offerBanner}>
            <Text style={styles.offerText}>
              🎉 Limited Time: Save up to 30%
            </Text>
          </View>
        </View>

        <View style={styles.membershipsContainer}>
          {memberships.map((membership, index) => (
            <TouchableOpacity
              key={membership.id}
              style={[
                styles.membershipCard,
                selectedMembership?.id === membership.id && styles.selectedCard,
                membership.popular && styles.popularCard,
              ]}
              onPress={() => {
                if (selectedMembership?.id === membership.id) {
                  return setSelectedMembership(null);
                }

                setSelectedMembership(membership);
              }}
            >
              {membership.popular && (
                <View style={styles.popularBadge}>
                  <Star size={12} color="#FFF" />
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}

              {membership.bestValue && (
                <View style={styles.bestValueBadge}>
                  <Text style={styles.bestValueText}>Best Value</Text>
                </View>
              )}

              <LinearGradient
                colors={membership.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.membershipHeader}
              >
                <View style={styles.headerContent}>
                  <View style={styles.membershipInfo}>
                    <membership.icon size={32} color="#FFF" />
                    <Text style={styles.membershipName}>{membership.name}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.membershipPrice}>
                        {membership.price} kr
                      </Text>
                      {membership.originalPrice && (
                        <Text style={styles.originalPrice}>
                          {membership.originalPrice} kr
                        </Text>
                      )}
                      <Text style={styles.periodText}>
                        /{membership.period}
                      </Text>
                    </View>
                    {membership.originalPrice && (
                      <View style={styles.savingsBadge}>
                        <Text style={styles.savingsText}>
                          Save {calculateSavings(membership)}%
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </LinearGradient>

              <View style={styles.featuresContainer}>
                {membership.features.map((feature, featureIndex) => (
                  <View key={featureIndex} style={styles.featureRow}>
                    <View
                      style={[
                        styles.checkIcon,
                        { backgroundColor: membership.color },
                      ]}
                    >
                      <Check size={16} color="#FFF" />
                    </View>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {selectedMembership?.id === membership.id && (
                <View style={styles.selectedIndicator}>
                  <Check size={20} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Text style={styles.sectionSubtitle}>
            Secure and encrypted payment
          </Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === "card" && styles.selectedPayment,
            ]}
            onPress={() => setSelectedPayment("card")}
          >
            <View
              style={[
                styles.paymentIconContainer,
                selectedPayment === "card" && styles.selectedPaymentIcon,
              ]}
            >
              <CreditCard
                size={24}
                color={
                  selectedPayment === "card"
                    ? COLORS.primary[600]
                    : COLORS.gray[500]
                }
              />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Credit Card</Text>
              <Text style={styles.paymentSubtitle}>
                Visa, Mastercard, American Express
              </Text>
            </View>
            {selectedPayment === "card" && <View style={styles.selectedDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === "mobilepay" && styles.selectedPayment,
            ]}
            onPress={() => setSelectedPayment("mobilepay")}
          >
            <View
              style={[
                styles.paymentIconContainer,
                selectedPayment === "mobilepay" && styles.selectedPaymentIcon,
              ]}
            >
              <Image
                source={{
                  uri: "https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg",
                }}
                style={styles.mobilepayIcon}
              />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>MobilePay</Text>
              <Text style={styles.paymentSubtitle}>
                Fast and secure mobile payment
              </Text>
            </View>
            {selectedPayment === "mobilepay" && (
              <View style={styles.selectedDot} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.licensePlateSection}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <Text style={styles.sectionSubtitle}>
            Enter your license plate number
          </Text>

          <View style={styles.licensePlateInputContainer}>
            <View style={styles.licensePlateIconContainer}>
              <Car size={24} color={COLORS.gray[600]} />
            </View>
            <TextInput
              style={styles.licensePlateInput}
              placeholder="Enter license plate"
              value={licensePlate}
              onChangeText={setLicensePlate}
              autoCapitalize="characters"
              maxLength={10}
              placeholderTextColor={COLORS.gray[400]}
            />
          </View>
        </View>

        <View style={styles.guaranteeSection}>
          <Shield size={24} color={COLORS.success[600]} />
          <View style={styles.guaranteeText}>
            <Text style={styles.guaranteeTitle}>
              30-Day Money Back Guarantee
            </Text>
            <Text style={styles.guaranteeSubtitle}>
              Not satisfied? Get a full refund within 30 days.
            </Text>
          </View>
        </View>

        <View style={styles.subscriptionInfo}>
          <Calendar size={20} color={COLORS.gray[600]} />
          <Text style={styles.subscriptionText}>
            Your subscription will automatically renew each month. Cancel
            anytime in the app.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.subscribeButton,
            (!selectedMembership ||
              !selectedPayment ||
              !licensePlate.trim() ||
              createMembershipMutation.isPending) &&
              styles.disabledButton,
          ]}
          disabled={
            !selectedMembership ||
            !selectedPayment ||
            !licensePlate.trim() ||
            createMembershipMutation.isPending
          }
          onPress={handleSubscription}
        >
          <LinearGradient
            colors={
              selectedMembership
                ? [selectedMembership.color, selectedMembership.gradient[1]]
                : [COLORS.gray[400], COLORS.gray[500]]
            }
            style={styles.subscribeButtonGradient}
          >
            <Text style={styles.subscribeButtonText}>
              {createMembershipMutation.isPending
                ? "Processing..."
                : selectedMembership && selectedPayment && licensePlate.trim()
                  ? `Subscribe for ${selectedMembership.price} kr/${selectedMembership.period}`
                  : !selectedMembership
                    ? "Select a plan to continue"
                    : !selectedPayment
                      ? "Select a payment method"
                      : "Enter your license plate"}
            </Text>
            {selectedMembership &&
              selectedMembership.originalPrice &&
              !createMembershipMutation.isPending && (
                <Text style={styles.subscribeButtonSavings}>
                  Save{" "}
                  {selectedMembership.originalPrice - selectedMembership.price}{" "}
                  kr/month
                </Text>
              )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </React.Fragment>
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
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray[100],
  },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
  },
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  heroTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    color: COLORS.gray[900],
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: "center",
    marginBottom: 16,
  },
  offerBanner: {
    backgroundColor: COLORS.accent[50],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.accent[200],
  },
  offerText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: COLORS.accent[700],
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedCard: {
    borderColor: COLORS.primary[600],
    shadowColor: COLORS.primary[600],
    shadowOpacity: 0.3,
  },
  popularCard: {
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: COLORS.accent[600],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  popularText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: "#FFF",
  },
  bestValueBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: COLORS.success[600],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 1,
  },
  bestValueText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: "#FFF",
  },
  membershipHeader: {
    padding: 24,
    minHeight: 140,
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
  },
  membershipInfo: {
    alignItems: "center",
  },
  membershipName: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#FFF",
    marginTop: 8,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: 8,
  },
  membershipPrice: {
    fontFamily: "Poppins-Bold",
    fontSize: 32,
    color: "#FFF",
  },
  originalPrice: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.7)",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  periodText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  savingsBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: "#FFF",
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
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[700],
    marginLeft: 12,
    flex: 1,
  },
  selectedIndicator: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary[600],
    justifyContent: "center",
    alignItems: "center",
  },
  paymentSection: {
    padding: 24,
  },
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 20,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedPayment: {
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.primary[50],
  },
  paymentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray[100],
  },
  selectedPaymentIcon: {
    backgroundColor: COLORS.primary[100],
  },
  mobilepayIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  paymentInfo: {
    marginLeft: 16,
    flex: 1,
  },
  paymentTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  paymentSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary[600],
  },
  licensePlateSection: {
    padding: 24,
    paddingTop: 0,
  },
  licensePlateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  licensePlateIconContainer: {
    marginRight: 12,
  },
  licensePlateInput: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[900],
    paddingVertical: 8,
  },
  guaranteeSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.success[50],
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.success[200],
  },
  guaranteeText: {
    marginLeft: 12,
    flex: 1,
  },
  guaranteeTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: COLORS.success[800],
    marginBottom: 2,
  },
  guaranteeSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.success[700],
  },
  subscriptionInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 24,
    paddingTop: 0,
  },
  subscriptionText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  subscribeButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  subscribeButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  subscribeButtonText: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#FFF",
  },
  subscribeButtonSavings: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
  },
});

export default function MembershipScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Membership</Text>
        <View style={{ width: 40 }} />
      </View>

      <Suspense fallback={<MembershipSkeleton />}>
        <MembershipContent />
      </Suspense>
    </SafeAreaView>
  );
}
