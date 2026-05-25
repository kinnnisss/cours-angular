package edu.ism.gestionRv.client.web.mapper;

import edu.ism.gestionRv.client.web.dto.PatientCreateRequestDto;
import edu.ism.gestionRv.client.web.dto.PatientCreateResponseDto;
import edu.ism.gestionRv.patient.data.entity.Patient;

public class PatientCreateMapper {

    private PatientCreateMapper() {
        // Private constructor to hide the implicit public one
    }

    public static PatientCreateResponseDto toDto(Patient patient) {
        if (patient == null) {
            return null;
        }
        return new PatientCreateResponseDto(
                patient.getId(),
                patient.getUserId(),
                patient.getNumero(),
                patient.getNom(),
                patient.getPrenom(),
                patient.getTel(),
                patient.getAdresse(),
                patient.getAntecedents());
    }

    public static Patient toEntity(PatientCreateRequestDto dto) {
        if (dto == null) {
            return null;
        }
        return new Patient(
                null, // id is null for creation
                dto.getUserId(),
                dto.getNumero(),
                dto.getNom(),
                dto.getPrenom(),
                dto.getTel(),
                dto.getAdresse(),
                dto.getAntecedents());
    }
}
