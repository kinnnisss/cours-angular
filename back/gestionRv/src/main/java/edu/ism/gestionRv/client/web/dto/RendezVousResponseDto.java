package edu.ism.gestionRv.client.web.dto;

import java.time.LocalDate;

public record RendezVousResponseDto(
        String id,
        Long patientId,
        String patientNom,
        String specialite,
        String medecin,
        LocalDate dateIso,
        String heure,
        String lieu,
        String notes,
        String status
) {
}
