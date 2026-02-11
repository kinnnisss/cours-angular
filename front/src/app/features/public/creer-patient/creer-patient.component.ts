import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PatientRequest } from '@core/model/patient.model';
import { PatientService } from '@core/service/patient.service';

@Component({
  selector: 'app-creer-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './creer-patient.component.html',
  styleUrl: './creer-patient.component.css'
})
export class CreerPatientComponent {

  patientForm!: FormGroup;

  submitted = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly patientService: PatientService
  ) {
    this.patientForm = this.fb.group({
      numero: ['', [Validators.required,Validators.pattern(/^PAT-\d{3}$/)]],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      tel: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      adresse: ['', Validators.required,Validators.minLength(5)],
      antecedents: ['']
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMsg = '';
    this.successMsg = '';

    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    const patientData = this.patientForm.value as PatientRequest;

    this.patientService.createPatient(patientData).subscribe({
      next: () => {
        this.patientForm.reset();
        this.submitted = false;

        this.successMsg = 'Patient créé avec succès !';

      },
      error: (err) => {
        this.errorMsg = err?.message ?? 'Erreur lors de la création du patient.';
      }
    });
  }

  onReset(): void {
    this.patientForm.reset();
    this.submitted = false;
    this.errorMsg = '';
    this.successMsg = '';
  }

isInvalid(name: string): boolean {
  const c = this.patientForm.get(name);
  return !!(c && c.invalid && (c.touched || this.submitted));
}

getError(name: string): string {
  const c = this.patientForm.get(name);
  if (!c || !c.errors) return '';

  if (c.errors['required']) return 'Ce champ est obligatoire.';
  if (c.errors['pattern']) {
    if (name === 'numero') return 'Format attendu : PAT-001';
    if (name === 'tel') return 'Téléphone invalide.';
    return 'Format invalide.';
  }
  if (c.errors['minlength']) {
    const req = c.errors['minlength'].requiredLength;
    return `Minimum ${req} caractères.`;
  }
  if (c.errors['maxlength']) {
    const req = c.errors['maxlength'].requiredLength;
    return `Maximum ${req} caractères.`;
  }

  return 'Valeur invalide.';
}

}
