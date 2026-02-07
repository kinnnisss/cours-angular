import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { StatCardComponent } from '@shared/ui/stat-card/stat-card.component';



import { DEMANDES_MOCK } from '@mock';

type NoteType = 'success' | 'danger' | 'info' | 'muted';

interface StatCard {
  title: string;
  value: number;
  iconClass: string;
  bgToneClass: string;
  textToneClass: string;
  noteText: string;
  noteIconClass: string;
  noteType: NoteType;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgFor, StatCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  demandes = DEMANDES_MOCK;

  rvRealises = 12;
  rvAnnules = 1;

  get stats(): StatCard[] {
    const totalDemandes = this.demandes.length;
    const enAttente = this.demandes.filter(d => d.status === 'en_attente').length;
    const acceptes = this.demandes.filter(d => d.status === 'accepte').length;

    return [
      {
        title: 'Demandes RV',
        value: totalDemandes,
        iconClass: 'bi bi-calendar-event',
        bgToneClass: 'bg-primary',
        textToneClass: 'text-primary',
        noteText: `${enAttente} en attente`,
        noteIconClass: 'bi bi-info-circle',
        noteType: 'success',
      },
      {
        title: 'RV Acceptés',
        value: acceptes,
        iconClass: 'bi bi-calendar-check',
        bgToneClass: 'bg-success',
        textToneClass: 'text-success',
        noteText: 'Confirmés',
        noteIconClass: 'bi bi-check-circle',
        noteType: 'success',
      },
      {
        title: 'RV Réalisés',
        value: this.rvRealises,
        iconClass: 'bi bi-check-all',
        bgToneClass: 'bg-info',
        textToneClass: 'text-info',
        noteText: 'Complétés',
        noteIconClass: 'bi bi-award',
        noteType: 'success',
      },
      {
        title: 'RV Annulés',
        value: this.rvAnnules,
        iconClass: 'bi bi-x-circle',
        bgToneClass: 'bg-danger',
        textToneClass: 'text-danger',
        noteText: 'Annulés',
        noteIconClass: 'bi bi-exclamation-circle',
        noteType: 'danger',
      }
    ];
  }

  nextAppointment = {
    day: 25,
    month: 'Jan',
    speciality: 'Cardiologue',
    doctor: 'Dr. Jean Dupont',
    time: '14:30',
    statusLabel: 'Confirmé'
  };

  routes = {
    newRdv: '/demande-rv',
    createPatient: '/patients/create',
    listPatients: '/patients'
  };

  noteClass(type: NoteType): string {
    switch (type) {
      case 'success': return 'text-success';
      case 'danger': return 'text-danger';
      case 'info': return 'text-info';
      default: return 'text-muted';
    }
  }
}
