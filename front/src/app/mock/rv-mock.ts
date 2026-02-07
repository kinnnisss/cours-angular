import { isoDate,timeSlot } from './helper-mock';
import { USERS_MOCK } from './user-mock';
import type { RendezVous } from '../features/private/mes-rv/model/rendezvous.model';
import { SPECIALITES } from '../features/private/demande-rv/model/specialite.type';
import type { RvStatus } from '../features/private/mes-rv/model/rv-status.type';
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


export const RDVS_MOCK: RendezVous[] = Array.from({ length: 16 }, (_, i) => {
  const p = USERS_MOCK[(i + 2) % USERS_MOCK.length];
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
