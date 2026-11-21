import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

// Altere para true apenas se quiser pular o Firebase durante testes locais de UI
const USE_MOCK_AUTH = false;

export interface AppUser {
  uid: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: AppUser | null;
  loading: boolean;
  hasCompletedOnboarding: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    if (USE_MOCK_AUTH) {
      setUser({ uid: 'mock-uid-123', name: 'Marina', email: 'marina@email.com' });
      setHasCompletedOnboarding(true);
      setLoading(false);
      return;
    }

    const unsubscribe = authService.subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        const onboardingDone = await AsyncStorage.getItem(`@onboarding_${firebaseUser.uid}`);
        setHasCompletedOnboarding(onboardingDone === 'true');
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email || '',
        });
      } else {
        setUser(null);
        setHasCompletedOnboarding(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signIn(email: string, password: string) {
    if (USE_MOCK_AUTH) {
      setUser({ uid: 'mock-uid-123', name: 'Marina', email });
      setHasCompletedOnboarding(true);
      return;
    }
    const firebaseUser = await authService.login(email, password);
    const onboardingDone = await AsyncStorage.getItem(`@onboarding_${firebaseUser.uid}`);
    setHasCompletedOnboarding(onboardingDone === 'true');
  }

  async function signUp(name: string, email: string, password: string) {
    if (USE_MOCK_AUTH) {
      setUser({ uid: 'mock-uid-123', name, email });
      setHasCompletedOnboarding(false); // Novo usuário vai para o Onboarding
      return;
    }
    const firebaseUser = await authService.register(name, email, password);
    await AsyncStorage.setItem(`@onboarding_${firebaseUser.uid}`, 'false');
    setHasCompletedOnboarding(false);
    setUser({
      uid: firebaseUser.uid,
      name,
      email: firebaseUser.email || email,
    });
  }

  async function signOut() {
    if (!USE_MOCK_AUTH) {
      await authService.logout();
    }
    setUser(null);
    setHasCompletedOnboarding(false);
  }

  async function completeOnboarding() {
    if (user) {
      await AsyncStorage.setItem(`@onboarding_${user.uid}`, 'true');
    }
    setHasCompletedOnboarding(true);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        hasCompletedOnboarding,
        signIn,
        signUp,
        signOut,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}