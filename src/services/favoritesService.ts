import { networkDelay } from './api';
import { readFavorites, writeFavorites } from './storage';

export const favoritesService = {
  async list(userId: string): Promise<string[]> {
    await networkDelay(150);
    return readFavorites(userId);
  },

  /** Agrega o quita el favorito y devuelve la lista actualizada. */
  async toggle(userId: string, propertyId: string): Promise<string[]> {
    await networkDelay(120);
    const current = await readFavorites(userId);
    const next = current.includes(propertyId)
      ? current.filter((id) => id !== propertyId)
      : [...current, propertyId];
    await writeFavorites(userId, next);
    return next;
  },
};
