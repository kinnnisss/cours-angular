package edu.ism.gestionRv.patient.service.impl;

import edu.ism.gestionRv.client.web.dto.PageResponseDto;
import edu.ism.gestionRv.client.web.dto.PatientCreateRequestDto;
import edu.ism.gestionRv.client.web.dto.PatientCreateResponseDto;
import edu.ism.gestionRv.client.web.mapper.PatientCreateMapper;
import edu.ism.gestionRv.demande.exception.PatientNotFoundException;
import edu.ism.gestionRv.patient.data.entity.Patient;
import edu.ism.gestionRv.patient.data.repository.PatientRepository;
import edu.ism.gestionRv.patient.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Override
    public PatientCreateResponseDto createPatient(PatientCreateRequestDto request) {
        Patient patient = PatientCreateMapper.toEntity(request);
        if (patient.getUserId() == null || patient.getUserId().isBlank()) {
            patient.setUserId(buildUserId(request.numero()));
        }
        return PatientCreateMapper.toDto(patientRepository.save(patient));
    }

    @Override
    public PageResponseDto<PatientCreateResponseDto> getPatients(String userId, String search, int page, int size, String sortBy, String sortDir) {
        Pageable pageable = PageRequest.of(page, size, buildSort(sortBy, sortDir));

        Page<Patient> patientsPage;
        if (userId != null && !userId.isBlank()) {
            var patients = patientRepository.findAllByUserId(userId);
            patientsPage = new PageImpl<>(patients, pageable, patients.size());
        } else if (search != null && !search.isBlank()) {
            patientsPage = patientRepository.findByNumeroContainingIgnoreCaseOrNomContainingIgnoreCaseOrPrenomContainingIgnoreCaseOrTelContainingIgnoreCase(
                    search, search, search, search, pageable
            );
        } else {
            patientsPage = patientRepository.findAll(pageable);
        }

        return PageResponseDto.fromPage(patientsPage, PatientCreateMapper::toDto);
    }

    @Override
    public PatientCreateResponseDto getPatientById(Long id) {
        return patientRepository.findById(id)
                .map(PatientCreateMapper::toDto)
                .orElseThrow(() -> new PatientNotFoundException(id));
    }

    @Override
    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new PatientNotFoundException(id);
        }
        patientRepository.deleteById(id);
    }

    private String buildUserId(String numeroPatient) {
        if (numeroPatient == null || numeroPatient.isBlank()) {
            return "USER-" + System.currentTimeMillis();
        }

        return "USER-" + numeroPatient.replace("PAT-", "").trim();
    }

    private Sort buildSort(String sortBy, String sortDir) {
        String property = switch (sortBy) {
            case "numero", "nom", "prenom", "tel" -> sortBy;
            default -> "nom";
        };
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        return Sort.by(direction, property);
    }
}
