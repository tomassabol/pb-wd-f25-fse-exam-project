import { createContext, useState, useEffect, ReactNode } from 'react';
import { Station } from '@/types/station';
import { WashType } from '@/types/wash';
import { mockStations } from '@/data/mockStations';

interface ActiveWash {
  station: Station;
  washType: WashType;
  startTime: Date;
}

interface WashContextType {
  activeWash: ActiveWash | null;
  licensePlate: string | null;
  detectLicensePlate: (licensePlate: string) => void;
  startWash: (washType: WashType) => void;
  completeWash: () => void;
}

export const WashContext = createContext<WashContextType>({
  activeWash: null,
  licensePlate: null,
  detectLicensePlate: () => {},
  startWash: () => {},
  completeWash: () => {},
});

interface WashProviderProps {
  children: ReactNode;
}

export function WashProvider({ children }: WashProviderProps) {
  const [activeWash, setActiveWash] = useState<ActiveWash | null>(null);
  const [licensePlate, setLicensePlate] = useState<string | null>(null);

  const detectLicensePlate = (plate: string) => {
    setLicensePlate(plate);
  };

  const startWash = (washType: WashType) => {
    // In a real app, we would make an API call to the station to start the wash
    const station = mockStations[0]; // Simulating the current station
    
    setActiveWash({
      station,
      washType,
      startTime: new Date(),
    });
  };

  const completeWash = () => {
    // In a real app, we would make an API call to update the wash status
    setActiveWash(null);
    setLicensePlate(null);
  };

  return (
    <WashContext.Provider
      value={{
        activeWash,
        licensePlate,
        detectLicensePlate,
        startWash,
        completeWash,
      }}
    >
      {children}
    </WashContext.Provider>
  );
}