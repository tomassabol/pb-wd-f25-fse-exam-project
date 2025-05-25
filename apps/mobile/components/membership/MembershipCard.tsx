import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Check, Star, Shield, Zap } from "lucide-react-native";
import { COLORS } from "@/constants/colors";
import type { Membership } from "../../../api/db/schema/membership.schema";

type EnhancedMembership = Membership & {
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
const enhanceMembership = (membership: Membership): EnhancedMembership => {
  const config = membershipVisualConfig[membership.name.toLowerCase()] || {
    color: COLORS.gray[600],
    gradient: [COLORS.gray[500], COLORS.gray[700]],
    icon: Shield,
  };

  return { ...membership, ...config };
};

interface MembershipCardProps {
  membership: Membership;
  onPress: () => void;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  membership,
  onPress,
}) => {
  const enhancedMembership = enhanceMembership(membership);
  const IconComponent = enhancedMembership.icon;

  const calculateSavings = () => {
    if (!enhancedMembership.originalPrice) return 0;
    return Math.round(
      ((enhancedMembership.originalPrice - enhancedMembership.price) /
        enhancedMembership.originalPrice) *
        100
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {enhancedMembership.popular && (
        <View style={styles.popularBadge}>
          <Star size={10} color="#FFF" />
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}

      {enhancedMembership.bestValue && (
        <View style={styles.bestValueBadge}>
          <Text style={styles.bestValueText}>Best Value</Text>
        </View>
      )}

      <LinearGradient
        colors={enhancedMembership.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <IconComponent size={24} color="#FFF" />
        <Text style={styles.membershipName}>{enhancedMembership.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{enhancedMembership.price} kr</Text>
          {enhancedMembership.originalPrice && (
            <Text style={styles.originalPrice}>
              {enhancedMembership.originalPrice} kr
            </Text>
          )}
        </View>
        <Text style={styles.period}>/{enhancedMembership.period}</Text>
        {enhancedMembership.originalPrice && (
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsText}>Save {calculateSavings()}%</Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.featuresContainer}>
        {enhancedMembership.features.slice(0, 3).map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <View
              style={[
                styles.checkIcon,
                { backgroundColor: enhancedMembership.color },
              ]}
            >
              <Check size={10} color="#FFF" />
            </View>
            <Text style={styles.featureText} numberOfLines={1}>
              {feature}
            </Text>
          </View>
        ))}
        {enhancedMembership.features.length > 3 && (
          <Text style={styles.moreFeatures}>
            +{enhancedMembership.features.length - 3} more features
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  popularBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: COLORS.accent[600],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  popularText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 10,
    color: "#FFF",
  },
  bestValueBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: COLORS.success[600],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  bestValueText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 10,
    color: "#FFF",
  },
  header: {
    padding: 20,
    alignItems: "center",
    minHeight: 140,
    justifyContent: "center",
  },
  membershipName: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    color: "#FFF",
    marginTop: 8,
    marginBottom: 8,
    textTransform: "capitalize",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  price: {
    fontFamily: "Poppins-Bold",
    fontSize: 24,
    color: "#FFF",
  },
  originalPrice: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textDecorationLine: "line-through",
    marginLeft: 6,
  },
  period: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
  },
  savingsBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 6,
  },
  savingsText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 10,
    color: "#FFF",
  },
  featuresContainer: {
    padding: 16,
    backgroundColor: "#FFF",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  featureText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: COLORS.gray[700],
    flex: 1,
  },
  moreFeatures: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: COLORS.primary[600],
    textAlign: "center",
    marginTop: 4,
  },
});
