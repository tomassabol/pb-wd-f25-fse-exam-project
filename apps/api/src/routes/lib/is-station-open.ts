import { type WashingStation } from "../../../db/schema/washing-station.schema";

export function isStationOpen(station: WashingStation) {
  const now = new Date();
  const [openTimeStr, closeTimeStr] = station.openHours.split("-");
  const [openHour, openMinute] = openTimeStr.split(":");
  const [closeHour, closeMinute] = closeTimeStr.split(":");

  const openTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    parseInt(openHour),
    parseInt(openMinute)
  );
  const closeTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    parseInt(closeHour),
    parseInt(closeMinute)
  );

  return now >= openTime && now <= closeTime;
}
