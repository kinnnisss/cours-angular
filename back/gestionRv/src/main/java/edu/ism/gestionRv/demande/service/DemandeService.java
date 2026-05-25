package edu.ism.gestionRv.demande.service;

import edu.ism.gestionRv.client.web.dto.DemandeCreateRequestDto;
import edu.ism.gestionRv.client.web.dto.DemandeResponseDto;
import edu.ism.gestionRv.client.web.dto.PageResponseDto;
import edu.ism.gestionRv.client.web.mapper.DemandeMapper;
import edu.ism.gestionRv.demande.data.entity.Demande;
import edu.ism.gestionRv.demande.data.repository.DemandeRepository;
import edu.ism.gestionRv.demande.exception.DemandeNotFoundException;
import edu.ism.gestionRv.demande.exception.InvalidDemandeStatusException;
import edu.ism.gestionRv.demande.exception.PatientNotFoundException;
import edu.ism.gestionRv.patient.data.entity.Patient;
import edu.ism.gestionRv.patient.data.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DemandeService {

    private final DemandeRepository demandeRepository;
    private final PatientRepository patientRepository;

    public DemandeResponseDto createDemande(DemandeCreateRequestDto request) {
        Patient patient = patientRepository.findById(request.patientId())
                .orElseThrow(() -> new PatientNotFoundException(request.patientId()));

        Demande demande = Demande.builder()
                .patient(patient)
                .dateConsultation(request.date())
                .heureConsultation(request.heure())
                .specialite(request.specialite())
                .motif(request.motif())
                .remarques(request.remarques())
                .statut(Demande.StatutDemande.CREEE)
                .dateCreation(LocalDateTime.now())
                .dateModification(LocalDateTime.now())
                .build();

        return DemandeMapper.toResponseDto(demandeRepository.save(demande));
    }

    public List<DemandeResponseDto> getDemandesDuJour() {
        return DemandeMapper.toResponseDtoList(demandeRepository.findDemandesDuJour());
    }

    public List<DemandeResponseDto> getDemandesDuJourByPatient(Long patientId) {
        return DemandeMapper.toResponseDtoList(demandeRepository.findDemandesDuJourByPatientId(patientId));
    }

    public PageResponseDto<DemandeResponseDto> getDemandes(
            Long patientId,
            LocalDate date,
            String status,
            String specialite,
            String patientQuery,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dateCreation"));
        List<Demande.StatutDemande> statuses = mapApiStatuses(status);
        boolean applyStatusFilter = statuses != null && !statuses.isEmpty();

        var pageResult = demandeRepository.searchDemandes(
                patientId,
                date,
                normalizeBlank(specialite),
                normalizeBlank(patientQuery),
                applyStatusFilter,
                applyStatusFilter ? statuses : List.of(Demande.StatutDemande.CREEE),
                pageable
        );

        return PageResponseDto.fromPage(pageResult, DemandeMapper::toResponseDto);
    }

    public DemandeResponseDto getDemandeById(Long id) {
        return demandeRepository.findById(id)
                .map(DemandeMapper::toResponseDto)
                .orElseThrow(() -> new DemandeNotFoundException(id));
    }

    public DemandeResponseDto validerDemande(Long demandeId) {
        Demande demande = demandeRepository.findById(demandeId)
                .orElseThrow(() -> new DemandeNotFoundException(demandeId));

        if (!demande.getStatut().equals(Demande.StatutDemande.CREEE)) {
            throw new InvalidDemandeStatusException("Seules les demandes creees peuvent etre validees");
        }

        demande.setStatut(Demande.StatutDemande.VALIDEE);
        demande.setDateModification(LocalDateTime.now());
        return DemandeMapper.toResponseDto(demandeRepository.save(demande));
    }

    public DemandeResponseDto annulerDemande(Long demandeId) {
        Demande demande = demandeRepository.findById(demandeId)
                .orElseThrow(() -> new DemandeNotFoundException(demandeId));

        if (demande.getStatut().equals(Demande.StatutDemande.ANNULEE)) {
            throw new InvalidDemandeStatusException("Cette demande est deja annulee");
        }

        demande.setStatut(Demande.StatutDemande.ANNULEE);
        demande.setDateModification(LocalDateTime.now());
        return DemandeMapper.toResponseDto(demandeRepository.save(demande));
    }

    public DemandeResponseDto completarDemande(Long demandeId) {
        Demande demande = demandeRepository.findById(demandeId)
                .orElseThrow(() -> new DemandeNotFoundException(demandeId));

        if (!demande.getStatut().equals(Demande.StatutDemande.VALIDEE)) {
            throw new InvalidDemandeStatusException("Seules les demandes validees peuvent etre completees");
        }

        demande.setStatut(Demande.StatutDemande.COMPLETEE);
        demande.setDateModification(LocalDateTime.now());
        return DemandeMapper.toResponseDto(demandeRepository.save(demande));
    }

    public void deleteDemande(Long demandeId) {
        if (!demandeRepository.existsById(demandeId)) {
            throw new DemandeNotFoundException(demandeId);
        }
        demandeRepository.deleteById(demandeId);
    }

    public List<DemandeResponseDto> getDemandesByStatut(Demande.StatutDemande statut) {
        return DemandeMapper.toResponseDtoList(demandeRepository.findByStatut(statut));
    }

    public DemandeResponseDto updateStatus(Long demandeId, String status) {
        return switch (status) {
            case "accepte" -> validerDemande(demandeId);
            case "refuse" -> annulerDemande(demandeId);
            case "en_attente" -> getDemandeById(demandeId);
            default -> throw new InvalidDemandeStatusException("Statut non supporte: " + status);
        };
    }

    private List<Demande.StatutDemande> mapApiStatuses(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }

        return switch (status) {
            case "en_attente" -> List.of(Demande.StatutDemande.CREEE);
            case "accepte" -> List.of(Demande.StatutDemande.VALIDEE, Demande.StatutDemande.COMPLETEE);
            case "refuse" -> List.of(Demande.StatutDemande.ANNULEE);
            default -> throw new InvalidDemandeStatusException("Statut filtre invalide: " + status);
        };
    }

    private String normalizeBlank(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
