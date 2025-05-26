import { useCallback, useState, Suspense } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import { ErrorBoundary } from "react-error-boundary";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import {
  useUserMembershipsSuspenseQuery,
  useCancelMembershipMutation,
} from "@/hooks/memberships-hooks";
import {
  ArrowRight,
  Bell,
  Car,
  CreditCard,
  CircleHelp as HelpCircle,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  UserCog,
  Plus,
  X,
} from "lucide-react-native";
import React from "react";

function MembershipErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <View style={styles.membershipCard}>
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Unable to load membership</Text>
        <Text style={styles.errorSubtitle}>Please try again later</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={resetErrorBoundary}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const SkeletonBox = ({
  width,
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
          width,
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

const MembershipSkeleton = () => {
  return (
    <View style={styles.membershipCard}>
      <View style={styles.membershipSkeletonGradient}>
        <View style={styles.membershipContent}>
          <View>
            <SkeletonBox width={120} height={14} style={{ marginBottom: 8 }} />
            <SkeletonBox width={100} height={24} style={{ marginBottom: 8 }} />
            <SkeletonBox width={140} height={14} style={{ marginBottom: 4 }} />
            <SkeletonBox width={100} height={12} />
          </View>
          <View style={styles.membershipPriceContainer}>
            <SkeletonBox width={60} height={20} style={{ marginBottom: 4 }} />
            <SkeletonBox width={40} height={12} />
          </View>
        </View>

        <View style={styles.membershipButtonContainer}>
          <SkeletonBox width="66%" height={50} style={{ borderRadius: 0 }} />
          <SkeletonBox width="34%" height={50} style={{ borderRadius: 0 }} />
        </View>
      </View>
    </View>
  );
};

function MembershipSection() {
  const { data: userMemberships } = useUserMembershipsSuspenseQuery();
  const cancelMembershipMutation = useCancelMembershipMutation();

  if (!userMemberships || userMemberships.length === 0) {
    return (
      <View style={styles.membershipCard}>
        <View style={styles.noMembershipContainer}>
          <Text style={styles.noMembershipTitle}>No Active Membership</Text>
          <Text style={styles.noMembershipSubtitle}>
            Subscribe to a membership plan to enjoy unlimited car washes
          </Text>
          <TouchableOpacity
            style={styles.subscribeMembershipButton}
            onPress={() => router.push("/(modals)/membership")}
          >
            <Plus size={20} color="#FFF" />
            <Text style={styles.subscribeMembershipText}>Get Membership</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleCancelMembership = useCallback(
    (userMembershipId: string, membershipName: string) => {
      Alert.alert(
        "Cancel Membership",
        `Are you sure you want to cancel your ${membershipName} membership? This action cannot be undone and you will lose access to all membership benefits.`,
        [
          {
            text: "Keep Membership",
            style: "cancel",
          },
          {
            text: "Cancel Membership",
            style: "destructive",
            onPress: async () => {
              try {
                await cancelMembershipMutation.mutateAsync(userMembershipId);
                Alert.alert(
                  "Membership Cancelled",
                  "Your membership has been successfully cancelled.",
                  [{ text: "OK" }]
                );
              } catch (error) {
                Alert.alert(
                  "Cancellation Failed",
                  "There was an error cancelling your membership. Please try again or contact support.",
                  [{ text: "OK" }]
                );
              }
            },
          },
        ]
      );
    },
    [cancelMembershipMutation, router, Alert]
  );

  // Sort memberships: active first, then cancelled, then by expiry date (latest first)
  const now = new Date();
  const sortedMemberships = userMemberships.sort((a, b) => {
    // First priority: isActive status (active first)
    if (a.isActive !== b.isActive) {
      return a.isActive ? -1 : 1;
    }

    // Then sort by expiry date (latest first)
    return new Date(b.expiresAt).getTime() - new Date(a.expiresAt).getTime();
  });

  return (
    <View>
      {sortedMemberships.map((membership, index) => {
        const expiryDate = new Date(membership.expiresAt);
        const isExpired = expiryDate < now;
        const isActive = membership.isActive;
        const isCancelled = !isActive && !isExpired;

        // Determine membership status and colors
        let statusText = isExpired ? "Expired Membership" : "Membership";
        let gradientColors: [string, string] = isExpired
          ? [COLORS.gray[600], COLORS.gray[400]]
          : [COLORS.primary[700], COLORS.primary[500]];

        return (
          <View key={membership.id} style={styles.membershipCard}>
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.membershipGradient}
            >
              <View style={styles.membershipContent}>
                <View>
                  <Text style={styles.membershipLabel}>
                    {statusText}
                    {sortedMemberships.length > 1 &&
                      ` (${index + 1} of ${sortedMemberships.length})`}
                  </Text>
                  <View style={styles.membershipNameContainer}>
                    <Text style={styles.membershipType}>
                      {membership.membership.name}
                    </Text>
                    {!isActive && !isExpired && (
                      <View style={styles.cancelledBadge}>
                        <Text style={styles.cancelledBadgeText}>Cancelled</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.membershipValidity}>
                    {isExpired
                      ? `Expired on ${expiryDate.toLocaleDateString()}`
                      : isCancelled
                        ? `Cancelled - Valid until ${expiryDate.toLocaleDateString()}`
                        : `Valid until ${expiryDate.toLocaleDateString()}`}
                  </Text>
                  {membership.licensePlate && (
                    <Text style={styles.membershipLicensePlate}>
                      Vehicle: {membership.licensePlate}
                    </Text>
                  )}
                </View>
                <View style={styles.membershipPriceContainer}>
                  <Text style={styles.membershipPrice}>
                    {membership.membership.price} kr
                  </Text>
                  <Text style={styles.membershipPeriod}>
                    /{membership.membership.period}
                  </Text>
                </View>
              </View>

              <View style={styles.membershipButtonContainer}>
                <TouchableOpacity
                  style={[styles.membershipButton, styles.manageButton]}
                  onPress={() => router.push("/(modals)/membership")}
                >
                  <Text style={styles.membershipButtonText}>
                    {isExpired ? "Renew Membership" : "Manage Membership"}
                  </Text>
                </TouchableOpacity>

                {isActive && !isExpired && (
                  <TouchableOpacity
                    style={[styles.membershipButton, styles.cancelButton]}
                    onPress={() =>
                      handleCancelMembership(
                        membership.id,
                        membership.membership.name
                      )
                    }
                    disabled={cancelMembershipMutation.isPending}
                  >
                    <X size={16} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.membershipButtonText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>
            </LinearGradient>
          </View>
        );
      })}
    </View>
  );
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleSignOut = useCallback(() => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: () => {
          signOut();
          router.replace("/login");
        },
        style: "destructive",
      },
    ]);
  }, [signOut, router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          onPress={() => {
            /* TODO: Implement settings */
          }}
        >
          <Settings size={24} color={COLORS.gray[700]} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.fullName || "Guest User"}
            </Text>
            <Text style={styles.profileEmail}>
              {user?.email || "guest@example.com"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              /* TODO: Implement edit profile */
            }}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <ErrorBoundary FallbackComponent={MembershipErrorFallback}>
          <Suspense fallback={<MembershipSkeleton />}>
            <MembershipSection />
          </Suspense>
        </ErrorBoundary>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              /* TODO: Implement edit profile */
            }}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: COLORS.primary[100] },
                ]}
              >
                <UserCog size={20} color={COLORS.primary[600]} />
              </View>
              <Text style={styles.menuItemText}>Personal Information</Text>
            </View>
            <ArrowRight size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/vehicles")}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: COLORS.teal[100] },
                ]}
              >
                <Car size={20} color={COLORS.teal[600]} />
              </View>
              <Text style={styles.menuItemText}>My Vehicles</Text>
            </View>
            <ArrowRight size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/payment-methods")}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: COLORS.accent[100] },
                ]}
              >
                <CreditCard size={20} color={COLORS.accent[600]} />
              </View>
              <Text style={styles.menuItemText}>Payment Methods</Text>
            </View>
            <ArrowRight size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.switchItem}>
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: COLORS.warning[100] },
                ]}
              >
                <Bell size={20} color={COLORS.warning[600]} />
              </View>
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <Switch
              trackColor={{
                false: COLORS.gray[300],
                true: COLORS.primary[300],
              }}
              thumbColor={
                notificationsEnabled ? COLORS.primary[600] : COLORS.gray[100]
              }
              onValueChange={setNotificationsEnabled}
              value={notificationsEnabled}
            />
          </View>

          <View style={styles.switchItem}>
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: COLORS.gray[200] },
                ]}
              >
                <Moon size={20} color={COLORS.gray[700]} />
              </View>
              <Text style={styles.menuItemText}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{
                false: COLORS.gray[300],
                true: COLORS.primary[300],
              }}
              thumbColor={
                darkModeEnabled ? COLORS.primary[600] : COLORS.gray[100]
              }
              onValueChange={setDarkModeEnabled}
              value={darkModeEnabled}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/help-center")}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: COLORS.info[100] },
                ]}
              >
                <HelpCircle size={20} color={COLORS.info[600]} />
              </View>
              <Text style={styles.menuItemText}>Help Center</Text>
            </View>
            <ArrowRight size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/contact-us")}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: COLORS.success[100] },
                ]}
              >
                <MessageSquare size={20} color={COLORS.success[600]} />
              </View>
              <Text style={styles.menuItemText}>Contact Us</Text>
            </View>
            <ArrowRight size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/privacy-policy")}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuItemIcon,
                  { backgroundColor: COLORS.gray[200] },
                ]}
              >
                <Shield size={20} color={COLORS.gray[700]} />
              </View>
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <ArrowRight size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color={COLORS.error[600]} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { LinearGradient } from "expo-linear-gradient";
import { Moon } from "lucide-react-native";

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
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
  },
  editButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: COLORS.gray[700],
  },
  membershipCard: {
    marginHorizontal: 24,
    marginVertical: 4,
    borderRadius: 16,
    overflow: "hidden",
  },
  membershipGradient: {
    borderRadius: 16,
  },
  membershipContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  membershipLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: COLORS.primary[100],
    opacity: 0.8,
    marginBottom: 4,
  },
  membershipType: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#FFF",
    marginBottom: 8,
  },
  membershipValidity: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#FFF",
    opacity: 0.9,
  },
  membershipLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  membershipLicensePlate: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#FFF",
    opacity: 0.9,
    marginTop: 4,
  },
  membershipPriceContainer: {
    alignItems: "flex-end",
  },
  membershipPrice: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: "#FFF",
  },
  membershipPeriod: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#FFF",
    opacity: 0.8,
  },
  membershipButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    flexDirection: "row",
    gap: 6,
  },
  manageButton: {
    flex: 2,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "rgba(239, 68, 68, 0.8)", // Red background for destructive action
  },
  membershipButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#FFF",
  },
  noMembershipContainer: {
    padding: 24,
    alignItems: "center",
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    borderStyle: "dashed",
  },
  noMembershipTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[700],
    marginBottom: 8,
  },
  noMembershipSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  subscribeMembershipButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary[600],
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  subscribeMembershipText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#FFF",
  },
  errorContainer: {
    padding: 24,
    alignItems: "center",
    backgroundColor: COLORS.error[50],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.error[200],
  },
  errorTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: COLORS.error[700],
    marginBottom: 8,
  },
  errorSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.error[600],
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.error[600],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#FFF",
  },

  membershipButtonContainer: {
    flexDirection: "row",
  },
  membershipNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cancelledBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  cancelledBadgeText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 10,
    color: "#FFF",
    textTransform: "uppercase",
  },

  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: COLORS.gray[900],
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: COLORS.gray[800],
  },
  switchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.error[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.error[200],
  },
  signOutText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: COLORS.error[700],
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  versionText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[500],
  },
  membershipSkeletonGradient: {
    borderRadius: 16,
    backgroundColor: COLORS.gray[200],
    padding: 20,
  },
});
