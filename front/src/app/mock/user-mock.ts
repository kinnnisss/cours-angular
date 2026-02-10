import { User } from "@core/model/user.model";

export const USERS_MOCK: User[] = [
  {
    id: '1',
    nom: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'patient',
  },
  {
    id: '2',
    nom: 'Jane Smith',
    email: 'jane@exmaple.com',
    password: 'password456',
    role: 'patient',
  },
  {
    id: '3',
    nom: 'Admin User',
    email: 'admin@example.com',
    password: 'adminpass',
    role: 'admin',
  },
];