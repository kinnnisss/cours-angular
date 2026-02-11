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
  {
    id: '4',
    nom: 'Dr. House',
    email: 'house@gmail.com',
    password: 'housepass',
    role: 'medecin',

  },
  {
    id: '5',
    nom: 'Secretaire User',
    email: 'secretaire@gmail.com',
    password: 'secretairepass',
    role: 'secretaire',
  },
  {
    id: '6',
    nom: 'Dr. Strange',
    email: 'strange@gmail.com',
    password: 'strangepass',
    role: 'medecin',
  },
  {
    id: '7',
    nom: 'Patient Zero',
    email: 'zero@gmail.com',
    password: 'zeropass',
    role: 'patient',
  },
  {
    id: '8',
    nom: 'Jane Doe',
    email: 'jd@gmail.com',
    password: 'jdpass',
    role: 'patient',
  }
];