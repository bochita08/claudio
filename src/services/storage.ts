import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { SEED_USERS } from '../data/users';

const KEYS = {
  users: 'propplus:db:users',
  session: 'propplus:session:userId',
};

const favoritesKey = (userId: string) => `propplus:favorites:${userId}`;

/** IDs de propiedades marcadas como favoritas por un usuario. */
export async function readFavorites(userId: string): Promise<string[]> {
  const raw = await AsyncStorage.getItem(favoritesKey(userId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export async function writeFavorites(userId: string, ids: string[]): Promise<void> {
  await AsyncStorage.setItem(favoritesKey(userId), JSON.stringify(ids));
}

/** "Tabla" de usuarios persistida en el dispositivo. */
export async function readUsers(): Promise<User[]> {
  const raw = await AsyncStorage.getItem(KEYS.users);
  if (!raw) {
    await AsyncStorage.setItem(KEYS.users, JSON.stringify(SEED_USERS));
    return [...SEED_USERS];
  }
  try {
    return JSON.parse(raw) as User[];
  } catch {
    await AsyncStorage.setItem(KEYS.users, JSON.stringify(SEED_USERS));
    return [...SEED_USERS];
  }
}

export async function writeUsers(users: User[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.users, JSON.stringify(users));
}

export async function getSessionUserId(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.session);
}

export async function setSessionUserId(id: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.session, id);
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.session);
}
