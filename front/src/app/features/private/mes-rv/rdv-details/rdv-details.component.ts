import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { map, switchMap, of, catchError } from 'rxjs';

import { MesRvService } from '@features/private/mes-rv/service/mes-rv.service';
import type { RendezVous } from '@features/private/mes-rv/model/rendezvous.model';

import { StatusBadgeComponent } from '@shared/ui/status-badge/status-badge.component';
import { KeyValueComponent } from '@shared/ui/key-value/key-value.component';

@Component({
  selector: 'app-rdv-details',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink, StatusBadgeComponent, KeyValueComponent],
  templateUrl: './rdv-details.component.html',
})
export class RdvDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly mesRvService = inject(MesRvService);

  rdv$ = this.route.paramMap.pipe(
    map(p => p.get('id')),
    switchMap(id => !id ? of(null) : this.mesRvService.getById(id)),
    catchError(() => of(null))
  );

  kvItems(r: RendezVous) {
    return [
      { label: 'Spécialité', value: r.specialite },
      { label: 'Médecin', value: r.medecin },
      { label: 'Date', value: r.dateIso },
      { label: 'Heure', value: r.heure },
      { label: 'Lieu', value: r.lieu },
    ];
  }
}
