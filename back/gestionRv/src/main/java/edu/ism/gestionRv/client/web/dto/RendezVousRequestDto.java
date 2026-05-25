package edu.ism.gestionRv.client.web.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RendezVousRequestDto(
        @NotNull(message = "Le patient est obligatoire")
        Long patientId,
        @NotBlank(message = "La specialite est obligatoire")
        String specialite,
        @NotBlank(message = "Le medecin est obligatoire")
        String medecin,
        @NotNull(message = "La date est obligatoire")
        @FutureOrPresent(message = "La date doit etre aujourd'hui ou dans le futur")
        LocalDate dateIso,
        @NotBlank(message = "L'heure est obligatoire")
        String heure,
        @NotBlank(message = "Le lieu est obligatoire")
        String lieu,
        @Size(max = 500, message = "Les notes sont trop longues")
        String notes,
        String status
) {
}
