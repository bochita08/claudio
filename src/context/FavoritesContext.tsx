import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { favoritesService } from '../services/favoritesService';
import { useAuth } from './AuthContext';

interface FavoritesContextValue {
  favorites: string[];
  loading: boolean;
  count: number;
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    favoritesService
      .list(user.id)
      .then((ids) => {
        if (mounted) setFavorites(ids);
      })
      .catch(() => {
        if (mounted) setFavorites([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      if (!user) return;
      // Update optimista para que el corazon responda al instante.
      setFavorites((prev) =>
        prev.includes(propertyId)
          ? prev.filter((id) => id !== propertyId)
          : [...prev, propertyId],
      );
      try {
        const next = await favoritesService.toggle(user.id, propertyId);
        setFavorites(next);
      } catch {
        // Si falla, recargamos el estado real del almacenamiento.
        const real = await favoritesService.list(user.id).catch(() => [] as string[]);
        setFavorites(real);
      }
    },
    [user?.id],
  );

  const isFavorite = useCallback(
    (propertyId: string) => favorites.includes(propertyId),
    [favorites],
  );

  const value = useMemo(
    () => ({
      favorites,
      loading,
      count: favorites.length,
      isFavorite,
      toggleFavorite,
    }),
    [favorites, loading, isFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites debe usarse dentro de <FavoritesProvider>.');
  return ctx;
}
