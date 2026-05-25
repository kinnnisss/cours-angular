import type { DemandeStatus } from './demande-status.type';

export interface DemandeRv {
  id: number | string;
  patientId: number | string;
  patientNom: string;
  specialite: string;
  date: string;
  heure: string;
  status: DemandeStatus;
  motif?: string;
  remarques?: string;
}

export type DemandeRvApi = DemandeRv;
