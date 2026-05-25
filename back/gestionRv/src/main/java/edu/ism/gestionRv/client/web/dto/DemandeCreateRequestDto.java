package edu.ism.gestionRv.client.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemandeCreateRequestDto {
    private Long patientId;
    private LocalDate dateConsultation;
    private String motif;
    private String remarques;
}
