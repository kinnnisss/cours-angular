export interface DemandeRvCreate {
  patientId: string;
  patientNom: string;
  specialite: string;
  date: string;
  heure: string;
  motif?: string;
}
