import { PublicUser, User } from '../types';
import { ApiError, networkDelay } from './api';
import { readUsers, writeUsers } from './storage';

function toPublic(user: User): PublicUser {
  const { password, ...rest } = user;
  return rest;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo?: string;
}

export const userService = {
  async updateProfile(userId: string, patch: UpdateProfilePayload): Promise<PublicUser> {
    await networkDelay();
    const users = await readUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new ApiError('NOT_FOUND', 'No encontramos el usuario.');
    }
    const emailTaken = users.some(
      (u) => u.id !== userId && normalizeEmail(u.email) === normalizeEmail(patch.email),
    );
    if (emailTaken) {
      throw new ApiError('EMAIL_TAKEN', 'Ese email ya esta en uso por otra cuenta.');
    }
    const updated: User = {
      ...users[index],
      firstName: patch.firstName.trim(),
      lastName: patch.lastName.trim(),
      email: normalizeEmail(patch.email),
      phone: patch.phone.trim(),
      photo: patch.photo ?? users[index].photo,
    };
    const next = [...users];
    next[index] = updated;
    await writeUsers(next);
    return toPublic(updated);
  },
};
