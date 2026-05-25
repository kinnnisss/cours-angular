package edu.ism.gestionRv.client.web;

import edu.ism.gestionRv.client.web.dto.ApiResponseDto;
import edu.ism.gestionRv.client.web.dto.DemandeCreateRequestDto;
import edu.ism.gestionRv.client.web.dto.DemandeResponseDto;
import edu.ism.gestionRv.client.web.dto.DemandeStatusUpdateRequestDto;
import edu.ism.gestionRv.client.web.dto.PageResponseDto;
import edu.ism.gestionRv.demande.data.entity.Demande;
import edu.ism.gestionRv.demande.service.DemandeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/demandes")
@RequiredArgsConstructor
public class DemandeControllerWeb {

    private final DemandeService demandeService;

    @PostMapping
    public ResponseEntity<ApiResponseDto<DemandeResponseDto>> createDemande(
            @Valid @RequestBody DemandeCreateRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDto.success(
                        "Demande creee avec succes",
                        demandeService.createDemande(request)
                ));
    }

    @GetMapping("/du-jour")
    public ResponseEntity<ApiResponseDto<List<DemandeResponseDto>>> getDemandesDuJour() {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Demandes du jour recuperees avec succes",
                demandeService.getDemandesDuJour()
        ));
    }

    @GetMapping("/du-jour/patient/{patientId}")
    public ResponseEntity<ApiResponseDto<List<DemandeResponseDto>>> getDemandesDuJourByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Demandes du jour du patient recuperees avec succes",
                demandeService.getDemandesDuJourByPatient(patientId)
        ));
    }

    @GetMapping
    public ResponseEntity<ApiResponseDto<PageResponseDto<DemandeResponseDto>>> getDemandes(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String specialite,
            @RequestParam(required = false) String patientQuery,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "5") int size) {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Demandes recuperees avec succes",
                demandeService.getDemandes(patientId, date, status, specialite, patientQuery, page, size)
        ));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponseDto<PageResponseDto<DemandeResponseDto>>> getDemandesWithFilter(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String specialite,
            @RequestParam(required = false) String patientQuery,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "5") int size) {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Demandes filtrees recuperees avec succes",
                demandeService.getDemandes(patientId, date, status, specialite, patientQuery, page, size)
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<DemandeResponseDto>> getDemandeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Demande recuperee avec succes",
                demandeService.getDemandeById(id)
        ));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponseDto<DemandeResponseDto>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody DemandeStatusUpdateRequestDto payload) {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Statut de la demande mis a jour avec succes",
                demandeService.updateStatus(id, payload.status())
        ));
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<ApiResponseDto<DemandeResponseDto>> validerDemande(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Demande validee avec succes",
                demandeService.validerDemande(id)
        ));
    }

    @PutMapping("/{id}/annuler")
    public ResponseEntity<ApiResponseDto<DemandeResponseDto>> annulerDemande(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Demande annulee avec succes",
                demandeService.annulerDemande(id)
        ));
    }

    @PutMapping("/{id}/completer")
    public ResponseEntity<ApiResponseDto<DemandeResponseDto>> completarDemande(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Demande completee avec succes",
                demandeService.completarDemande(id)
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Void>> deleteDemande(@PathVariable Long id) {
        demandeService.deleteDemande(id);
        return ResponseEntity.ok(ApiResponseDto.success("Demande supprimee avec succes", null));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<ApiResponseDto<List<DemandeResponseDto>>> getDemandesByStatut(@PathVariable Demande.StatutDemande statut) {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Demandes par statut recuperees avec succes",
                demandeService.getDemandesByStatut(statut)
        ));
    }
}
