package edu.ism.gestionRv.client.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemandeResponseDto {
    private Long id;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private LocalDate dateConsultation;
    private String statut;
    private String motif;
    private String remarques;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
