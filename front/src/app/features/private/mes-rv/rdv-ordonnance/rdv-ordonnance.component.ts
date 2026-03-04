import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { map, switchMap, of } from 'rxjs';

import { MesRvService } from '@features/private/mes-rv/service/mes-rv.service';
import { StatusBadgeComponent } from '@shared/ui/status-badge/status-badge.component';

@Component({
  selector: 'app-rdv-ordonnance',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink, StatusBadgeComponent],
  templateUrl: './rdv-ordonnance.component.html',
})
export class RdvOrdonnanceComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly mesRvService = inject(MesRvService);

  rdv$ = this.route.paramMap.pipe(
    map(p => p.get('id')),
    switchMap(id => !id ? of(null) : this.mesRvService.getById(id))
  );
}