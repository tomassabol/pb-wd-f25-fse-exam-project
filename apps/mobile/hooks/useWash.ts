import { useContext } from 'react';
import { WashContext } from '@/contexts/WashContext';

export function useWash() {
  const context = useContext(WashContext);
  
  if (!context) {
    throw new Error('useWash must be used within a WashProvider');
  }
  
  return context;
}