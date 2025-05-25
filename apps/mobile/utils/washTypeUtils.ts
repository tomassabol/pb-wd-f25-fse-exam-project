import { type WashType as DBWashType } from "../../api/db/schema/wash-type.schema";
import { type WashType } from "@/types/wash";

// Wash type images - using car wash themed images with beautiful gradients and icons
const washTypeImages = {
  basic:
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
  bronze:
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
  silver:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
  gold: "https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
  platinum:
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
  default:
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center&auto=format&q=80",
};

// Generate wash type image based on name
function getWashTypeImage(name: string): string {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("basic")) return washTypeImages.basic;
  if (lowerName.includes("bronze")) return washTypeImages.bronze;
  if (lowerName.includes("silver")) return washTypeImages.silver;
  if (lowerName.includes("gold")) return washTypeImages.gold;
  if (lowerName.includes("platinum")) return washTypeImages.platinum;

  return washTypeImages.default;
}

// Transform database wash type to UI wash type
export function transformWashType(dbWashType: DBWashType): WashType {
  return {
    ...dbWashType,
    imageUrl: getWashTypeImage(dbWashType.name),
    features: dbWashType.includedFeatures || [],
  };
}

// Transform array of database wash types to UI wash types
export function transformWashTypes(dbWashTypes: DBWashType[]): WashType[] {
  return dbWashTypes.map(transformWashType);
}
