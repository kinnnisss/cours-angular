package edu.ism.gestionRv.client.web.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record DemandeCreateRequestDto(
        @NotNull(message = "Le patient est obligatoire")
        Long patientId,
        @NotBlank(message = "La specialite est obligatoire")
        String specialite,
        @NotNull(message = "La date est obligatoire")
        @FutureOrPresent(message = "La date doit etre aujourd'hui ou dans le futur")
        LocalDate date,
        @NotBlank(message = "L'heure est obligatoire")
        String heure,
        @Size(max = 255, message = "Le motif est trop long")
        String motif,
        @Size(max = 500, message = "Les remarques sont trop longues")
        String remarques
) {
}
