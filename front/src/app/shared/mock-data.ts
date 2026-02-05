// src/app/shared/mock-data.ts

import type { DemandeRv } from '../features/private/demande-rv/model/demande-rv.model';
import type { DemandeStatus } from '../features/private/demande-rv/model/demande-status.type';
import type { RendezVous } from '../features/private/mes-rv/model/rendezvous.model';
import type { RvStatus } from '../features/private/mes-rv/model/rv-status.type';

export interface Patient {
  id: string;
  nom: string;
}


export const PATIENTS_MOCK: Patient[] = [
  { id: 'PAT-001', nom: 'Jean Dupont' },
  { id: 'PAT-002', nom: 'Marie Martin' },
  { id: 'PAT-003', nom: 'Pierre Bernard' },
  { id: 'PAT-004', nom: 'Sophie Lefevre' },
  { id: 'PAT-005', nom: 'Awa Ndiaye' },
  { id: 'PAT-006', nom: 'Moussa Fall' },
  { id: 'PAT-007', nom: 'Fatou Diop' },
  { id: 'PAT-008', nom: 'Ibrahima Sow' },
  { id: 'PAT-009', nom: 'Khady Ba' },
  { id: 'PAT-010', nom: 'Cheikh Seck' },
];

const SPECIALITES = [
  'Médecin Généraliste',
  'Cardiologue',
  'Dermatologue',
  'Oculiste',
  'ORL',
  'Psychiatre',
  'Chirurgien',
  'Pédiatre',
];

const MEDECINS = [
  'Dr. Jean Dupont',
  'Dr. Marie Sow',
  'Dr. Pierre Bernard',
  'Dr. Ali Fall',
  'Dr. Aminata Diop',
  'Dr. Mamadou Ndiaye',
];

const LIEUX = [
  'Clinique Central',
  'Clinique de la Paix',
  'Hôpital Principal',
];

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function frDate(day: number, month: number, year = 2026): string {
  return `${pad2(day)}/${pad2(month)}/${year}`;
}

function isoDate(day: number, month: number, year = 2026): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function timeSlot(i: number): string {
  const slots = ['08:30','09:00','09:15','10:00','10:30','11:00','14:00','14:30','15:00','16:00'];
  return slots[i % slots.length];
}


export const DEMANDES_MOCK: DemandeRv[] = Array.from({ length: 22 }, (_, i) => {
  const p = PATIENTS_MOCK[i % PATIENTS_MOCK.length];
  const specialite = SPECIALITES[(i + 1) % SPECIALITES.length];

  const status: DemandeStatus =
    i % 3 === 0 ? 'en_attente' :
    i % 3 === 1 ? 'accepte' :
                  'refuse';

  const day = 10 + (i % 20);
  const month = i % 2 === 0 ? 1 : 2;

  return {
    id: `DEM-${pad2(i + 1).padStart(4, '0')}`,
    patientId: p.id,
    patientNom: p.nom,
    specialite,
    date: frDate(day, month),
    heure: timeSlot(i),
    status,
  };
});

export const RDVS_MOCK: RendezVous[] = Array.from({ length: 16 }, (_, i) => {
  const p = PATIENTS_MOCK[(i + 2) % PATIENTS_MOCK.length];
  const specialite = SPECIALITES[(i + 2) % SPECIALITES.length];
  const medecin = MEDECINS[i % MEDECINS.length];
  const lieu = LIEUX[i % LIEUX.length];

  const status: RvStatus =
    i % 4 === 0 ? 'confirme' :
    i % 4 === 1 ? 'realise' :
    i % 4 === 2 ? 'en_attente' :
                  'annule';

  const day = 12 + (i % 18);
  const month = i % 3 === 0 ? 1 : (i % 3 === 1 ? 2 : 3);

  return {
    id: `RV-${String(i + 1).padStart(4, '0')}`,
    patientId: p.id,
    patientNom: p.nom,
    specialite,
    medecin,
    dateIso: isoDate(day, month),
    heure: timeSlot(i + 3),
    lieu,
    notes: status === 'realise' ? 'Consultation effectuée' : undefined,
    status,
  };
});
