package edu.ism.gestionRv.client.web.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record DemandeResponseDto(
        Long id,
        Long patientId,
        String patientNom,
        String specialite,
        LocalDate date,
        String heure,
        String status,
        String motif,
        String remarques,
        LocalDateTime dateCreation,
        LocalDateTime dateModification
) {
}
