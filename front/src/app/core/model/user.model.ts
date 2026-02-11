export interface User {
  id: string;
  nom: string;
  email: string;
  password: string;
  role: UserRole;
}
export type UserRole = 'patient' | 'admin' | 'medecin'|'secretaire';

export interface UserRequest{
    email: string;
    password: string;
}

export interface UserResponse{
    token:string;
    user: User;
}