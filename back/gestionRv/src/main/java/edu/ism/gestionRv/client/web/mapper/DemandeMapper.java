package edu.ism.gestionRv.client.web.mapper;

import edu.ism.gestionRv.client.web.dto.DemandeCreateRequestDto;
import edu.ism.gestionRv.client.web.dto.DemandeResponseDto;
import edu.ism.gestionRv.demande.data.entity.Demande;
import lombok.experimental.UtilityClass;

import java.util.List;

@UtilityClass
public class DemandeMapper {

    public static DemandeResponseDto toResponseDto(Demande demande) {
        if (demande == null) {
            return null;
        }

        return new DemandeResponseDto(
                demande.getId(),
                demande.getPatient().getId(),
                demande.getPatient().getPrenom() + " " + demande.getPatient().getNom(),
                demande.getSpecialite(),
                demande.getDateConsultation(),
                demande.getHeureConsultation(),
                toApiStatus(demande.getStatut()),
                demande.getMotif(),
                demande.getRemarques(),
                demande.getDateCreation(),
                demande.getDateModification()
        );
    }

    public static List<DemandeResponseDto> toResponseDtoList(List<Demande> demandes) {
        return demandes.stream()
                .map(DemandeMapper::toResponseDto)
                .toList();
    }

    public static Demande toDemande(DemandeCreateRequestDto dto) {
        if (dto == null) {
            return null;
        }

        return Demande.builder()
                .specialite(dto.specialite())
                .dateConsultation(dto.date())
                .heureConsultation(dto.heure())
                .motif(dto.motif())
                .remarques(dto.remarques())
                .build();
    }

    public static String toApiStatus(Demande.StatutDemande statutDemande) {
        return switch (statutDemande) {
            case CREEE -> "en_attente";
            case VALIDEE, COMPLETEE -> "accepte";
            case ANNULEE -> "refuse";
        };
    }
}
