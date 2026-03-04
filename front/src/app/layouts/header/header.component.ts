import { Component, computed, inject, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

import { SecurityService } from '@core/service/security.service';
import type { User } from '@core/model/user.model';

type Role = 'patient' | 'secretaire' | 'medecin' | 'admin';

type NavItem = {
  label: string;
  icon: string;
  link: any[];
  roles: Role[];
  exact?: boolean;
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly security = inject(SecurityService);
  private readonly router = inject(Router);

  // user courant
  user = signal<User | null>(this.security.getCurrentUser());

  role = computed<Role | null>(() => (this.user()?.role as Role) ?? null);

  userLabel = computed(() => {
    const u = this.user();
    return u?.nom ?? u?.email ?? u?.id ?? 'Compte';
  });

  // Menu global
  private readonly allItems: NavItem[] = [
    { label: 'Tableau de bord', icon: 'bi bi-speedometer2', link: ['/private/dashboard'], roles: ['patient','secretaire','medecin','admin'], exact: true },

    // Patient
    { label: 'Demander RV', icon: 'bi bi-calendar-event', link: ['/private/demandes-rv/new'], roles: ['patient'] },
    { label: 'Mes Demandes', icon: 'bi bi-list-check', link: ['/private/demandes-rv'], roles: ['patient'] },
    { label: 'Mes RV', icon: 'bi bi-calendar-check', link: ['/private/mes-rv'], roles: ['patient'] },
    { label: 'Voir Mon Dossier médical', icon: 'bi bi-heart-pulse', link: ['/private/mon-dossier'], roles: ['patient'] },
    // Secrétaire
    { label: 'Demandes', icon: 'bi bi-inboxes', link: ['/private/secretaire/demandes'], roles: ['secretaire','admin'] },
    { label: 'Patients', icon: 'bi bi-people', link: ['/private/secretaire/patients'], roles: ['secretaire','admin'] },

    // Médecin (si tu as la route)
    { label: 'Mes consultations', icon: 'bi bi-heart-pulse', link: ['/private/medecin/rdvs'], roles: ['medecin','admin'] },
  ];

  navItems = computed(() => {
    const r = this.role();
    if (!r) return [];
    return this.allItems.filter(i => i.roles.includes(r));
  });

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.user.set(this.security.getCurrentUser()));
  }

  logout(): void {
    this.security.logout();
    this.user.set(null);
    this.router.navigate(['/public/login']);
  }
}