import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

interface PatientOption {
  id: string;
  label: string;
}

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
  patients: PatientOption[] = [
    { id: 'PAT-001', label: 'Jean Dupont (PAT-001)' },
    { id: 'PAT-002', label: 'Marie Martin (PAT-002)' },
    { id: 'PAT-003', label: 'Pierre Bernard (PAT-003)' },
  ];

  specialites: SpecialiteOption[] = [
    { value: 'Generaliste', label: 'Médecin Généraliste' },
    { value: 'Cardiologue', label: 'Cardiologue' },
    { value: 'Dermatologue', label: 'Dermatologue' },
    { value: 'Oculiste', label: 'Oculiste' },
    { value: 'ORL', label: 'ORL' },
    { value: 'Psychiatre', label: 'Psychiatre' },
    { value: 'Chirurgien', label: 'Chirurgien' },
    { value: 'Pediatre', label: 'Pédiatre' },
  ];

  form: FormGroup;
  submitted = false;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      specialite: ['', Validators.required],
      dateRV: ['', Validators.required],
      heureRV: ['', Validators.required],
      motif: [''],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Demande RV envoyée :', this.form.value);
  }

  isInvalid(controlName: string): boolean {
    const c = this.form.get(controlName);
    return !!(c && c.invalid && (c.touched || this.submitted));
  }
}
