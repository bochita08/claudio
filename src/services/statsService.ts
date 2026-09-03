import { UserStats } from '../types';
import { networkDelay } from './api';

/**
 * Estadisticas mock deterministicas derivadas del id de usuario, para que cada
 * cuenta vea numeros estables pero distintos.
 */
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export const statsService = {
  /**
   * `favoritesCount` viene del estado real de favoritos del usuario; el resto son
   * numeros mock deterministicos.
   */
  async getUserStats(userId: string, favoritesCount?: number): Promise<UserStats> {
    await networkDelay(400);
    const seed = hash(userId);
    const pick = (min: number, max: number, salt: number) =>
      min + ((seed * (salt + 1)) % (max - min + 1));

    const months = ['Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'];
    return {
      propertiesViewed: pick(24, 140, 1),
      favorites: favoritesCount ?? pick(2, 18, 2),
      searches: pick(10, 60, 3),
      contactedAgents: pick(1, 9, 4),
      averageBudget: pick(90, 320, 5) * 1000,
      monthlyViews: months.map((label, i) => ({
        label,
        value: pick(5, 40, 10 + i),
      })),
      typeDistribution: [
        { label: 'Departamento', value: pick(20, 45, 21) },
        { label: 'Casa', value: pick(15, 35, 22) },
        { label: 'PH', value: pick(8, 25, 23) },
        { label: 'Local', value: pick(3, 15, 24) },
        { label: 'Oficina', value: pick(2, 12, 25) },
      ],
    };
  },
};
