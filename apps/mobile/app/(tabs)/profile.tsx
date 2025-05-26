import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
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
} from "lucide-react-native";

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
        <TouchableOpacity onPress={() => router.push("/settings")}>
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
            onPress={() => router.push("/edit-profile")}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.membershipCard}>
          <LinearGradient
            colors={[COLORS.primary[700], COLORS.primary[500]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.membershipGradient}
          >
            <View style={styles.membershipContent}>
              <View>
                <Text style={styles.membershipLabel}>Membership</Text>
                <Text style={styles.membershipType}>Premium</Text>
                <Text style={styles.membershipValidity}>
                  Valid until Dec 31, 2023
                </Text>
              </View>
              <Image
                source={{
                  uri: "https://images.pexels.com/photos/1144176/pexels-photo-1144176.jpeg",
                }}
                style={styles.membershipLogo}
              />
            </View>
            <TouchableOpacity
              style={styles.membershipButton}
              onPress={() => router.push("/membership")}
            >
              <Text style={styles.membershipButtonText}>View Details</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/edit-profile")}
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
    marginVertical: 16,
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
  membershipButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    alignItems: "center",
  },
  membershipButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#FFF",
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
});
