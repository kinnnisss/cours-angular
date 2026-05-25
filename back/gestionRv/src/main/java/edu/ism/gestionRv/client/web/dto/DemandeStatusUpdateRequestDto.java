package edu.ism.gestionRv.client.web.dto;

import edu.ism.gestionRv.client.web.validator.ValidApiStatus;
import jakarta.validation.constraints.NotBlank;

public record DemandeStatusUpdateRequestDto(
        @NotBlank(message = "Le statut est obligatoire")
        @ValidApiStatus(allowedValues = {"en_attente", "accepte", "refuse"})
        String status
) {
}
