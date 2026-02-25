import { Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, map } from 'rxjs';

import { DemandeRvService } from '@features/private/demande-rv/service/demande-rv.service';
import type { DemandeRv } from '@features/private/demande-rv/model/demande-rv.model';
import {  } from '@angular/common';
@Component({
  selector: 'app-voir-demande',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink],
  templateUrl: './voir-demande.component.html',
})
export class VoirDemandeComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly demandeService = inject(DemandeRvService);

  demande$ = this.route.paramMap.pipe(
    map(pm => pm.get('id')),
    switchMap(id => this.demandeService.getById(id!))
  );

  badgeLabel(status: DemandeRv['status']) {
    if (status === 'en_attente') return 'En attente';
    if (status === 'accepte') return 'Acceptée';
    return 'Refusée';
  }

  badgeClass(status: DemandeRv['status']) {
    if (status === 'en_attente') return 'bg-warning text-dark';
    if (status === 'accepte') return 'bg-success';
    return 'bg-danger';
  }
  statusIcon(status: DemandeRv['status']) {
  if (status === 'accepte') return 'bi bi-check-circle';
  if (status === 'en_attente') return 'bi bi-hourglass-split';
  return 'bi bi-x-circle';
}

statusBoxClass(status: DemandeRv['status']) {
  if (status === 'accepte') return 'status-box--ok';
  if (status === 'en_attente') return 'status-box--wait';
  return 'status-box--no';
}

statusHelp(status: DemandeRv['status']) {
  if (status === 'accepte') return 'Votre demande a été validée. Vous serez contacté pour confirmation finale.';
  if (status === 'en_attente') return 'Votre demande est en cours de traitement. Revenez plus tard.';
  return 'Votre demande a été refusée. Essayez une autre date ou spécialité.';
}
}