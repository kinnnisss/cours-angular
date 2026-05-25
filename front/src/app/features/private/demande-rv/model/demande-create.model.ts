export interface DemandeRvCreate {
  patientId: number;
  specialite: string;
  date: string;
  heure: string;
  motif?: string;
  remarques?: string;
}
