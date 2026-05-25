package edu.ism.gestionRv.patient.service;

import edu.ism.gestionRv.client.web.dto.PatientCreateRequestDto;
import edu.ism.gestionRv.client.web.dto.PatientCreateResponseDto;
import java.util.List;
import java.util.Optional;

public interface PatientService {

    PatientCreateResponseDto createPatient(PatientCreateRequestDto request);

    List<PatientCreateResponseDto> getAllPatients();

    Optional<PatientCreateResponseDto> getPatientById(Long id);

    void deletePatient(Long id);
}
