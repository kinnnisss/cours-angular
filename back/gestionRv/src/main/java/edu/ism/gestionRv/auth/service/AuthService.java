package edu.ism.gestionRv.auth.service;

import edu.ism.gestionRv.client.web.dto.AuthLoginResponseDto;
import edu.ism.gestionRv.client.web.dto.AuthUserResponseDto;
import edu.ism.gestionRv.user.data.entity.AppUser;
import edu.ism.gestionRv.user.data.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository appUserRepository;

    public AuthLoginResponseDto login(String email, String password) {
        AppUser user = appUserRepository.findByEmailIgnoreCase(email)
                .filter(foundUser -> foundUser.getPassword().equals(password))
                .orElseThrow(() -> new IllegalArgumentException("Email ou mot de passe incorrect"));

        return new AuthLoginResponseDto(
                "fake-jwt-token",
                new AuthUserResponseDto(user.getId(), user.getNom(), user.getEmail(), user.getRole())
        );
    }
}
