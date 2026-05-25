package edu.ism.gestionRv.patient.service.impl;

import edu.ism.gestionRv.patient.service.PatientService;
import edu.ism.gestionRv.patient.data.repository.PatientRepository;
import edu.ism.gestionRv.patient.data.entity.Patient;
import edu.ism.gestionRv.client.web.dto.PatientCreateRequestDto;
import edu.ism.gestionRv.client.web.dto.PatientCreateResponseDto;
import edu.ism.gestionRv.client.web.mapper.PatientCreateMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public PatientCreateResponseDto createPatient(PatientCreateRequestDto request) {
        Patient patient = PatientCreateMapper.toEntity(request);
        Patient savedPatient = patientRepository.save(patient);
        return PatientCreateMapper.toDto(savedPatient);
    }

    @Override
    public List<PatientCreateResponseDto> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return patients.stream()
                .map(PatientCreateMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<PatientCreateResponseDto> getPatientById(Long id) {
        Optional<Patient> patient = patientRepository.findById(id);
        return patient.map(PatientCreateMapper::toDto);
    }

    @Override
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}