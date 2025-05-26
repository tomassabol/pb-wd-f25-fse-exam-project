import { type CarWash } from "../../api/db/schema/wash.schema";
import { type WashType as DBWashType } from "../../api/db/schema/wash-type.schema";
import { type WashingStation } from "../../api/db/schema/washing-station.schema";
import { type Membership } from "../../api/db/schema/membership.schema";
import { type WashHistory } from "@/types/wash";
import { transformWashType } from "./washTypeUtils";

// Type for the API response
export type CarWashWithRelations = CarWash & {
  washType: DBWashType;
  washingStation: WashingStation;
  membership?: Membership;
};

// Transform a single car wash record from API to UI format
export function transformCarWashToHistory(
  carWash: CarWashWithRelations
): WashHistory {
  // Format the date
  const date = new Date(carWash.createdAt);
  const formattedDate =
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    " • " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  // Transform wash type
  const washType = transformWashType(carWash.washType);

  // Determine payment method display
  let paymentMethodDisplay = "";
  switch (carWash.paymentMethod) {
    case "card":
      paymentMethodDisplay = "Credit Card";
      break;
    case "mobile_pay":
      paymentMethodDisplay = "Mobile Pay";
      break;
    case "subscription":
      paymentMethodDisplay = "Membership";
      break;
    default:
      paymentMethodDisplay = carWash.paymentMethod;
  }

  // Calculate estimated duration based on wash type (simplified logic)
  const duration = calculateWashDuration(carWash.washType.name);

  return {
    id: carWash.id,
    date: formattedDate,
    washType,
    station: {
      id: carWash.washingStation.id,
      name: carWash.washingStation.name,
    },
    licensePlate: carWash.licensePlate,
    duration,
    price: carWash.amount,
    paymentMethod: paymentMethodDisplay,
    services: carWash.washType.includedFeatures || [],
    // Add discount if membership was used
    ...(carWash.membership && {
      discount: {
        name: "Membership Discount",
        amount: Math.round(carWash.amount * 0.2), // Assume 20% discount
      },
    }),
  };
}

// Transform array of car wash records
export function transformCarWashesToHistory(
  carWashes: CarWashWithRelations[]
): WashHistory[] {
  return carWashes.map(transformCarWashToHistory);
}

// Calculate estimated wash duration based on wash type name
function calculateWashDuration(washTypeName: string): number {
  const lowerName = washTypeName.toLowerCase();

  if (lowerName.includes("express")) return 5;
  if (lowerName.includes("basic")) return 8;
  if (lowerName.includes("premium")) return 12;
  if (lowerName.includes("deluxe")) return 15;
  if (lowerName.includes("platinum")) return 18;

  // Default duration
  return 10;
}
