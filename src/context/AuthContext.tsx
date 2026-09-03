import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { PublicUser } from '../types';
import { authService, SignUpPayload } from '../services/authService';
import { userService, UpdateProfilePayload } from '../services/userService';

interface AuthContextValue {
  user: PublicUser | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    authService
      .getCurrentUser()
      .then((u) => {
        if (mounted) setUser(u);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setInitializing(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const u = await authService.signIn(email, password);
    setUser(u);
  }, []);

  const signUp = useCallback(async (payload: SignUpPayload) => {
    await authService.signUp(payload);
    // No logueamos automaticamente: el usuario vuelve al login con mensaje de exito.
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await authService.forgotPassword(email);
  }, []);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      if (!user) throw new Error('No hay sesion activa.');
      const updated = await userService.updateProfile(user.id, payload);
      setUser(updated);
    },
    [user],
  );

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, initializing, signIn, signUp, forgotPassword, updateProfile, signOut }),
    [user, initializing, signIn, signUp, forgotPassword, updateProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  return ctx;
}
