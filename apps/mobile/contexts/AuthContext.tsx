import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, licensePlate: string) => Promise<void>;
  signOut: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  updateUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const checkSession = async () => {
      try {
        // In a real app, we would check for stored credentials or tokens
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: '1',
        name: 'John Doe',
        email,
        licensePlate: 'AB 12 345',
        hasSubscription: false,
        recentWashes: [
          {
            id: '1',
            date: '2023-06-15',
            washType: {
              id: '1',
              name: 'Basic Wash',
              price: 79,
              imageUrl: 'https://images.pexels.com/photos/6873028/pexels-photo-6873028.jpeg',
            },
            station: {
              id: '1',
              name: 'WashWorld Copenhagen Central',
            },
            price: 79,
          },
          {
            id: '2',
            date: '2023-05-30',
            washType: {
              id: '2',
              name: 'Premium Wash',
              price: 129,
              imageUrl: 'https://images.pexels.com/photos/6873039/pexels-photo-6873039.jpeg',
            },
            station: {
              id: '2',
              name: 'WashWorld Aarhus North',
            },
            price: 129,
          }
        ]
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Error signing in:', error);
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string, licensePlate: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data
      const userData: User = {
        id: '2',
        name,
        email,
        licensePlate,
        hasSubscription: false,
        recentWashes: []
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Error signing up:', error);
      throw new Error('Could not create account');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}