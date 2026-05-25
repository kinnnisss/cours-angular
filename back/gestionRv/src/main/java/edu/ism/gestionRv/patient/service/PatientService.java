package edu.ism.gestionRv.patient.service;

import edu.ism.gestionRv.client.web.dto.PageResponseDto;
import edu.ism.gestionRv.client.web.dto.PatientCreateRequestDto;
import edu.ism.gestionRv.client.web.dto.PatientCreateResponseDto;

public interface PatientService {

    PatientCreateResponseDto createPatient(PatientCreateRequestDto request);

    PageResponseDto<PatientCreateResponseDto> getPatients(String userId, String search, int page, int size, String sortBy, String sortDir);

    PatientCreateResponseDto getPatientById(Long id);

    void deletePatient(Long id);
}
