package edu.ism.gestionRv.client.web.dto;

public record AuthUserResponseDto(
        String id,
        String nom,
        String email,
        String role
) {
}
