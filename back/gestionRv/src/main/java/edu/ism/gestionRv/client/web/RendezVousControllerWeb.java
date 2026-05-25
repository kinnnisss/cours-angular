package edu.ism.gestionRv.client.web;

import edu.ism.gestionRv.client.web.dto.ApiResponseDto;
import edu.ism.gestionRv.client.web.dto.RendezVousRequestDto;
import edu.ism.gestionRv.client.web.dto.RendezVousResponseDto;
import edu.ism.gestionRv.client.web.dto.RendezVousStatusUpdateRequestDto;
import edu.ism.gestionRv.client.web.mapper.RendezVousMapper;
import edu.ism.gestionRv.rendezvous.data.entity.RendezVous;
import edu.ism.gestionRv.rendezvous.service.RendezVousService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/rdvs")
@RequiredArgsConstructor
public class RendezVousControllerWeb {

    private final RendezVousService rendezVousService;

    @GetMapping
    public ResponseEntity<ApiResponseDto<Iterable<RendezVousResponseDto>>> getAll(
            @RequestParam(required = false) Long patientId) {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Rendez-vous recuperes avec succes",
                RendezVousMapper.toResponseDtoList(rendezVousService.getAll(patientId))
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<RendezVousResponseDto>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Rendez-vous recupere avec succes",
                RendezVousMapper.toResponseDto(rendezVousService.getById(id))
        ));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponseDto<RendezVousResponseDto>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody RendezVousStatusUpdateRequestDto payload) {
        RendezVous rendezVous = rendezVousService.updateStatus(id, payload.status());
        return ResponseEntity.ok(ApiResponseDto.success(
                "Statut du rendez-vous mis a jour avec succes",
                RendezVousMapper.toResponseDto(rendezVous)
        ));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<RendezVousResponseDto>> create(@Valid @RequestBody RendezVousRequestDto request) {
        RendezVous rendezVous = rendezVousService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDto.success(
                        "Rendez-vous cree avec succes",
                        RendezVousMapper.toResponseDto(rendezVous)
                ));
    }
}
