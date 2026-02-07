import { pad2, frDate, timeSlot } from './helper-mock';
import { USERS_MOCK } from './user-mock';
import type { DemandeRv } from '../features/private/demande-rv/model/demande-rv.model';
import type { DemandeStatus } from '../features/private/demande-rv/model/demande-status.type';
import { SPECIALITES } from '../features/private/demande-rv/model/specialite.type';

export const DEMANDES_MOCK: DemandeRv[] = Array.from({ length: 22 }, (_, i) => {
  const p = USERS_MOCK[i % USERS_MOCK.length];
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