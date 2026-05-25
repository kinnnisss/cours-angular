package edu.ism.gestionRv.client.web.dto;

public record AuthLoginResponseDto(
        String token,
        AuthUserResponseDto user
) {
}
