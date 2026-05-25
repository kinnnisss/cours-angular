package edu.ism.gestionRv.client.web.dto;

public record PatientCreateResponseDto(
        Long id,
        String userId,
        String numero,
        String nom,
        String prenom,
        String tel,
        String adresse,
        String antecedents
) {
}
