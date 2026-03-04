import type { DemandeStatus } from './demande-status.type';

export interface DemandeRv {
  id: string;
  patientId: string;
  patientNom: string;
  specialite: string;
  date: string;
  heure: string;
  status: DemandeStatus;
}
export interface DemandeRvApi {
  id: string;
  patientId: string;
  patientNom: string;
  specialite: string;
  date: string;
  heure: string;
  status: DemandeStatus;
}
