import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Station } from "@/types/station";
import { WashType } from "@/types/wash";
import { mockStations } from "@/data/mockStations";

export type WashStatus =
  | "idle"
  | "starting"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "error";

export interface WashStep {
  id: string;
  name: string;
  duration: number; // in seconds
  description: string;
  icon: string;
  status: "pending" | "active" | "completed";
}

interface ActiveWash {
  id: string;
  station: Station;
  washType: WashType;
  startTime: Date;
  estimatedEndTime: Date;
  status: WashStatus;
  currentStep: number;
  steps: WashStep[];
  progress: number; // 0-100
  timeRemaining: number; // in seconds
  totalDuration: number; // in seconds
}

interface WashContextType {
  activeWash: ActiveWash | null;
  licensePlate: string | null;
  detectLicensePlate: (licensePlate: string) => void;
  startWash: (washType: WashType, stationId?: string) => void;
  completeWash: () => void;
  cancelWash: () => void;
  updateWashProgress: () => void;
}

export const WashContext = createContext<WashContextType>({
  activeWash: null,
  licensePlate: null,
  detectLicensePlate: () => {},
  startWash: () => {},
  completeWash: () => {},
  cancelWash: () => {},
  updateWashProgress: () => {},
});

interface WashProviderProps {
  children: ReactNode;
}

// Define wash steps based on wash type
const getWashSteps = (washType: WashType): WashStep[] => {
  const baseSteps: WashStep[] = [
    {
      id: "pre-rinse",
      name: "Pre-Rinse",
      duration: 45,
      description: "Initial rinse to remove loose dirt and debris",
      icon: "droplets",
      status: "pending",
    },
    {
      id: "soap",
      name: "Soap Application",
      duration: 60,
      description: "Applying premium cleaning solution",
      icon: "spray",
      status: "pending",
    },
    {
      id: "scrub",
      name: "Brush Cleaning",
      duration: 90,
      description: "Gentle brush cleaning for thorough dirt removal",
      icon: "brush",
      status: "pending",
    },
    {
      id: "rinse",
      name: "High-Pressure Rinse",
      duration: 75,
      description: "Powerful rinse to remove all soap and dirt",
      icon: "waves",
      status: "pending",
    },
  ];

  // Add premium steps for higher-tier washes
  if (washType.price > 100) {
    baseSteps.push({
      id: "wax",
      name: "Wax Application",
      duration: 60,
      description: "Protective wax coating for shine and protection",
      icon: "shield",
      status: "pending",
    });
  }

  if (washType.price > 150) {
    baseSteps.push({
      id: "polish",
      name: "Polish & Shine",
      duration: 45,
      description: "Final polish for maximum shine",
      icon: "sparkles",
      status: "pending",
    });
  }

  // Always end with drying
  baseSteps.push({
    id: "dry",
    name: "Air Drying",
    duration: 60,
    description: "Gentle air drying to finish the wash",
    icon: "wind",
    status: "pending",
  });

  return baseSteps;
};

export function WashProvider({ children }: WashProviderProps) {
  const [activeWash, setActiveWash] = useState<ActiveWash | null>(null);
  const [licensePlate, setLicensePlate] = useState<string | null>(null);

  const detectLicensePlate = useCallback((plate: string) => {
    setLicensePlate(plate);
  }, []);

  const startWash = useCallback((washType: WashType, stationId?: string) => {
    const station =
      mockStations.find((s) => s.id === stationId) || mockStations[0];
    const steps = getWashSteps(washType);
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    const now = new Date();
    const estimatedEndTime = new Date(now.getTime() + totalDuration * 1000);

    // Mark first step as active
    steps[0].status = "active";

    const newWash: ActiveWash = {
      id: `wash_${Date.now()}`,
      station,
      washType,
      startTime: now,
      estimatedEndTime,
      status: "starting",
      currentStep: 0,
      steps,
      progress: 0,
      timeRemaining: totalDuration,
      totalDuration,
    };

    setActiveWash(newWash);

    // Start the wash after a brief delay
    setTimeout(() => {
      setActiveWash((prev) =>
        prev ? { ...prev, status: "in_progress" } : null
      );
    }, 2000);
  }, []);

  const updateWashProgress = useCallback(() => {
    setActiveWash((prev) => {
      if (!prev || prev.status !== "in_progress") return prev;

      const newTimeRemaining = Math.max(0, prev.timeRemaining - 1);
      const newProgress =
        ((prev.totalDuration - newTimeRemaining) / prev.totalDuration) * 100;

      // Calculate current step
      let elapsedTime = prev.totalDuration - newTimeRemaining;
      let currentStepIndex = 0;
      let stepStartTime = 0;

      for (let i = 0; i < prev.steps.length; i++) {
        if (elapsedTime <= stepStartTime + prev.steps[i].duration) {
          currentStepIndex = i;
          break;
        }
        stepStartTime += prev.steps[i].duration;
      }

      // Update step statuses
      const updatedSteps = prev.steps.map((step, index) => {
        if (index < currentStepIndex) {
          return { ...step, status: "completed" as const };
        } else if (index === currentStepIndex) {
          return { ...step, status: "active" as const };
        } else {
          return { ...step, status: "pending" as const };
        }
      });

      // Check if wash is complete
      if (newTimeRemaining === 0) {
        return {
          ...prev,
          timeRemaining: newTimeRemaining,
          progress: 100,
          currentStep: prev.steps.length - 1,
          steps: updatedSteps.map((step) => ({
            ...step,
            status: "completed" as const,
          })),
          status: "completed",
        };
      }

      return {
        ...prev,
        timeRemaining: newTimeRemaining,
        progress: newProgress,
        currentStep: currentStepIndex,
        steps: updatedSteps,
      };
    });
  }, []);

  const completeWash = useCallback(() => {
    setActiveWash((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: "completed",
        progress: 100,
        timeRemaining: 0,
        steps: prev.steps.map((step) => ({
          ...step,
          status: "completed" as const,
        })),
      };
    });

    // Clear the wash after showing completion for a while
    setTimeout(() => {
      setActiveWash(null);
      setLicensePlate(null);
    }, 10000); // 10 seconds to view completion
  }, []);

  const cancelWash = useCallback(() => {
    setActiveWash((prev) => {
      if (!prev) return null;
      return { ...prev, status: "cancelled" };
    });

    // Clear the wash after a brief delay
    setTimeout(() => {
      setActiveWash(null);
    }, 2000);
  }, []);

  return (
    <WashContext.Provider
      value={{
        activeWash,
        licensePlate,
        detectLicensePlate,
        startWash,
        completeWash,
        cancelWash,
        updateWashProgress,
      }}
    >
      {children}
    </WashContext.Provider>
  );
}
