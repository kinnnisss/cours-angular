package edu.ism.gestionRv.client.web;

import edu.ism.gestionRv.auth.service.AuthService;
import edu.ism.gestionRv.client.web.dto.ApiResponseDto;
import edu.ism.gestionRv.client.web.dto.AuthLoginRequestDto;
import edu.ism.gestionRv.client.web.dto.AuthLoginResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthControllerWeb {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDto<AuthLoginResponseDto>> login(@Valid @RequestBody AuthLoginRequestDto request) {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Connexion reussie",
                authService.login(request.email(), request.password())
        ));
    }
}
