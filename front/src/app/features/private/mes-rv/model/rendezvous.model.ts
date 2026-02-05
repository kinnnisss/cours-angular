import type { RvStatus } from './rv-status.type';

export interface RendezVous {
  id: string;
  patientId: string;
  patientNom: string;
  specialite: string;
  medecin: string;
  dateIso: string;
  heure: string;
  lieu: string;
  notes?: string;
  status: RvStatus;
}
