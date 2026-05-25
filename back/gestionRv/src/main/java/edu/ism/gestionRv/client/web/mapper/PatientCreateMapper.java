package edu.ism.gestionRv.client.web.mapper;

import edu.ism.gestionRv.client.web.dto.PatientCreateRequestDto;
import edu.ism.gestionRv.client.web.dto.PatientCreateResponseDto;
import edu.ism.gestionRv.patient.data.entity.Patient;

public final class PatientCreateMapper {

    private PatientCreateMapper() {
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
                patient.getAntecedents()
        );
    }

    public static Patient toEntity(PatientCreateRequestDto dto) {
        if (dto == null) {
            return null;
        }

        return Patient.builder()
                .userId(dto.userId())
                .numero(dto.numero())
                .nom(dto.nom())
                .prenom(dto.prenom())
                .tel(dto.tel())
                .adresse(dto.adresse())
                .antecedents(dto.antecedents())
                .build();
    }
}
