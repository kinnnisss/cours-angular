package edu.ism.gestionRv.client.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PatientCreateRequestDto(
        String userId,
        @NotBlank(message = "Le numero du patient est obligatoire")
        @Pattern(regexp = "^PAT-\\d{3,4}$", message = "Le numero doit respecter le format PAT-001")
        String numero,
        @NotBlank(message = "Le nom est obligatoire")
        @Size(min = 2, max = 50, message = "Le nom doit contenir entre 2 et 50 caracteres")
        String nom,
        @NotBlank(message = "Le prenom est obligatoire")
        @Size(min = 2, max = 50, message = "Le prenom doit contenir entre 2 et 50 caracteres")
        String prenom,
        @NotBlank(message = "Le telephone est obligatoire")
        @Pattern(regexp = "^\\d{9}$", message = "Le telephone doit contenir 9 chiffres")
        String tel,
        @NotBlank(message = "L'adresse est obligatoire")
        @Size(min = 5, max = 120, message = "L'adresse doit contenir entre 5 et 120 caracteres")
        String adresse,
        String antecedents
) {
}
