import React from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { CircleCheck as CheckCircle, X } from "lucide-react-native";
import { COLORS } from "@/constants/colors";
import { useWashTypesSuspense } from "@/hooks/wash-type-hooks";
import { WashType } from "@/types/wash";
import { WashTypeIcon } from "./WashTypeIcon";

interface WashTypesListProps {
  selectedWashType: WashType | null;
  onWashTypeSelect: (washType: WashType) => void;
}

export function WashTypesList({
  selectedWashType,
  onWashTypeSelect,
}: WashTypesListProps) {
  const { data: washTypes } = useWashTypesSuspense();

  console.log("WashTypesList - washTypes:", washTypes?.length, "items");
  console.log("WashTypesList - selectedWashType:", selectedWashType?.id);

  if (!washTypes || washTypes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No wash types available</Text>
      </View>
    );
  }

  const renderWashType = ({ item }: { item: WashType }) => (
    <TouchableOpacity
      style={[
        styles.washTypeCard,
        selectedWashType?.id === item.id && styles.selectedWashTypeCard,
      ]}
      onPress={() => {
        console.log("TouchableOpacity pressed for:", item.name);
        onWashTypeSelect(item);
      }}
    >
      <View style={styles.washTypeContent}>
        <WashTypeIcon washTypeName={item.name} size={60} />
        <View style={styles.washTypeInfo}>
          <Text style={styles.washTypeName}>{item.name}</Text>
          <Text style={styles.washTypeDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.washTypeFeatures}>
            {/* Included Features */}
            {item.includedFeatures
              .slice(0, 3)
              .map((feature: string, index: number) => (
                <View key={`included-${index}`} style={styles.featureItem}>
                  <CheckCircle size={12} color="#10B981" />
                  <Text style={styles.includedFeatureText}>{feature}</Text>
                </View>
              ))}

            {/* Excluded Features */}
            {item.excludedFeatures
              .slice(0, 2)
              .map((feature: string, index: number) => (
                <View key={`excluded-${index}`} style={styles.featureItem}>
                  <X size={12} color="#EF4444" />
                  <Text style={styles.excludedFeatureText}>{feature}</Text>
                </View>
              ))}

            {/* Show more indicator if there are more features */}
            {(item.includedFeatures.length > 3 ||
              item.excludedFeatures.length > 2) && (
              <Text style={styles.moreFeatures}>
                +
                {Math.max(0, item.includedFeatures.length - 3) +
                  Math.max(0, item.excludedFeatures.length - 2)}{" "}
                more
              </Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.washTypePriceContainer}>
        <Text
          style={[
            styles.washTypePrice,
            selectedWashType?.id === item.id && styles.selectedWashTypePrice,
          ]}
        >
          {item.price} kr
        </Text>
        {selectedWashType?.id === item.id && (
          <View style={styles.selectedIndicator}>
            <CheckCircle size={20} color="#FFF" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={washTypes}
      renderItem={renderWashType}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.washTypesList}
      showsVerticalScrollIndicator={false}
      style={styles.flatListContainer}
      nestedScrollEnabled={true}
    />
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    flex: 1,
  },
  washTypesList: {
    paddingBottom: 16,
  },
  washTypeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedWashTypeCard: {
    borderWidth: 2,
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.primary[50],
    shadowColor: COLORS.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  washTypeContent: {
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start",
    gap: 12,
  },
  washTypeInfo: {
    flex: 1,
  },
  washTypeName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  washTypeDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 8,
  },
  washTypeFeatures: {
    flexDirection: "column",
    gap: 4,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 4,
  },
  featureText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: COLORS.gray[700],
    marginLeft: 4,
  },
  includedFeatureText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#059669",
    marginLeft: 4,
  },
  excludedFeatureText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#DC2626",
    marginLeft: 4,
    textDecorationLine: "line-through",
  },
  moreFeatures: {
    fontFamily: "Inter-Medium",
    fontSize: 11,
    color: COLORS.gray[500],
    marginTop: 4,
    fontStyle: "italic",
  },
  washTypePriceContainer: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  washTypePrice: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: COLORS.primary[700],
    marginBottom: 8,
  },
  selectedWashTypePrice: {
    color: COLORS.primary[800],
    fontSize: 20,
  },
  selectedIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary[600],
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.gray[600],
  },
});
