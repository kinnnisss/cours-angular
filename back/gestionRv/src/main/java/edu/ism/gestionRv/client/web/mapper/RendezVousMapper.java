package edu.ism.gestionRv.client.web.mapper;

import edu.ism.gestionRv.client.web.dto.RendezVousResponseDto;
import edu.ism.gestionRv.rendezvous.data.entity.RendezVous;
import lombok.experimental.UtilityClass;

import java.util.List;

@UtilityClass
public class RendezVousMapper {

    public static RendezVousResponseDto toResponseDto(RendezVous rendezVous) {
        if (rendezVous == null) {
            return null;
        }

        return new RendezVousResponseDto(
                rendezVous.getId(),
                rendezVous.getPatient().getId(),
                rendezVous.getPatient().getPrenom() + " " + rendezVous.getPatient().getNom(),
                rendezVous.getSpecialite(),
                rendezVous.getMedecin(),
                rendezVous.getDateIso(),
                rendezVous.getHeure(),
                rendezVous.getLieu(),
                rendezVous.getNotes(),
                toApiStatus(rendezVous.getStatus())
        );
    }

    public static List<RendezVousResponseDto> toResponseDtoList(List<RendezVous> rendezVousList) {
        return rendezVousList.stream()
                .map(RendezVousMapper::toResponseDto)
                .toList();
    }

    public static String toApiStatus(RendezVous.RvStatus status) {
        return switch (status) {
            case CONFIRME -> "confirme";
            case REALISE -> "realise";
            case EN_ATTENTE -> "en_attente";
            case ANNULE -> "annule";
        };
    }
}
