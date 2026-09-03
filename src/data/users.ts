import { User } from '../types';

/** Usuario demo precargado. La contrasena cumple la politica (Demo1234). */
export const SEED_USERS: User[] = [
  {
    id: 'user-demo',
    firstName: 'Demo',
    lastName: 'Usuario',
    email: 'demo@propplus.com',
    phone: '1145559090',
    password: 'Demo1234',
    photo: 'https://i.pravatar.cc/300?img=15',
    createdAt: '2025-03-14T10:00:00.000Z',
  },
];
