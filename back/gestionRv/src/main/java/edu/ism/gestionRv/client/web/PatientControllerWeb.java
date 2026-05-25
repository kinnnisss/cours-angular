package edu.ism.gestionRv.client.web;

import edu.ism.gestionRv.client.web.dto.ApiResponseDto;
import edu.ism.gestionRv.client.web.dto.PageResponseDto;
import edu.ism.gestionRv.client.web.dto.PatientCreateRequestDto;
import edu.ism.gestionRv.client.web.dto.PatientCreateResponseDto;
import edu.ism.gestionRv.patient.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class PatientControllerWeb {

    private final PatientService patientService;

    @GetMapping
    public ResponseEntity<ApiResponseDto<PageResponseDto<PatientCreateResponseDto>>> getPatients(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "5") int size,
            @RequestParam(required = false, defaultValue = "nom") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Patients recuperes avec succes",
                patientService.getPatients(userId, search, page, size, sortBy, sortDir)
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<PatientCreateResponseDto>> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseDto.success(
                "Patient recupere avec succes",
                patientService.getPatientById(id)
        ));
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<PatientCreateResponseDto>> createPatient(
            @Valid @RequestBody PatientCreateRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponseDto.success(
                        "Patient cree avec succes",
                        patientService.createPatient(request)
                ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Void>> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok(ApiResponseDto.success("Patient supprime avec succes", null));
    }
}
