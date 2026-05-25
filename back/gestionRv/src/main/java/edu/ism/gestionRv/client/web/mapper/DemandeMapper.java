package edu.ism.gestionRv.client.web.mapper;

import edu.ism.gestionRv.client.web.dto.DemandeCreateRequestDto;
import edu.ism.gestionRv.client.web.dto.DemandeResponseDto;
import edu.ism.gestionRv.demande.data.entity.Demande;
import lombok.experimental.UtilityClass;

import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class DemandeMapper {

    public static DemandeResponseDto toResponseDto(Demande demande) {
        if (demande == null) {
            return null;
        }
        return new DemandeResponseDto(
                demande.getId(),
                demande.getPatient().getId(),
                demande.getPatient().getNom(),
                demande.getPatient().getPrenom(),
                demande.getDateConsultation(),
                demande.getStatut().name(),
                demande.getMotif(),
                demande.getRemarques(),
                demande.getDateCreation(),
                demande.getDateModification()
        );
    }

    public static List<DemandeResponseDto> toResponseDtoList(List<Demande> demandes) {
        return demandes.stream()
                .map(DemandeMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public static Demande toDemande(DemandeCreateRequestDto dto) {
        if (dto == null) {
            return null;
        }
        Demande demande = new Demande();
        demande.setDateConsultation(dto.getDateConsultation());
        demande.setMotif(dto.getMotif());
        demande.setRemarques(dto.getRemarques());
        return demande;
    }
}
