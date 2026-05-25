import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import { SecurityService } from '@core/service/security.service';
import { PatientService } from '@core/service/patient.service';
import { DemandeRvService } from '@features/private/demande-rv/service/demande-rv.service';

interface SpecialiteOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-form-demande',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgFor, NgIf],
  templateUrl: './form-demande.component.html',
  styleUrl: './form-demande.component.css'
})
export class FormDemandeComponent {
  specialites: SpecialiteOption[] = [
    { value: 'Generaliste', label: 'Medecin generaliste' },
    { value: 'Cardiologie', label: 'Cardiologie' },
    { value: 'Dermatologie', label: 'Dermatologie' },
    { value: 'Ophtalmologie', label: 'Ophtalmologie' },
    { value: 'ORL', label: 'ORL' },
    { value: 'Psychiatrie', label: 'Psychiatrie' },
    { value: 'Chirurgie', label: 'Chirurgie' },
    { value: 'Pediatrie', label: 'Pediatrie' },
  ];

  form: FormGroup;
  submitted = false;
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly securityService: SecurityService,
    private readonly patientService: PatientService,
    private readonly demandeRvService: DemandeRvService
  ) {
    this.form = this.fb.group({
      specialite: ['', Validators.required],
      dateRV: ['', Validators.required],
      heureRV: ['', Validators.required],
      motif: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMsg = '';
    this.successMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.securityService.getCurrentUser();
    if (!user?.id) {
      this.errorMsg = 'Utilisateur non connecte.';
      return;
    }

    this.loading = true;

    this.patientService.getByUserId(user.id).subscribe({
      next: patient => {
        if (!patient?.id) {
          this.loading = false;
          this.errorMsg = 'Profil patient introuvable.';
          return;
        }

        this.demandeRvService.create({
          patientId: patient.id,
          specialite: this.form.value['specialite'] as string,
          date: this.form.value['dateRV'] as string,
          heure: this.form.value['heureRV'] as string,
          motif: this.form.value['motif'] as string,
        }).subscribe({
          next: () => {
            this.loading = false;
            this.successMsg = 'Demande enregistree avec succes.';
            this.form.reset();
            this.submitted = false;
            void this.router.navigateByUrl('/private/demandes-rv');
          },
          error: () => {
            this.loading = false;
            this.errorMsg = 'Impossible d envoyer la demande.';
          }
        });
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Impossible de charger votre profil patient.';
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const c = this.form.get(controlName);
    return !!(c && c.invalid && (c.touched || this.submitted));
  }
}
