package edu.ism.gestionRv.rendezvous.service;

import edu.ism.gestionRv.client.web.dto.RendezVousRequestDto;
import edu.ism.gestionRv.patient.data.entity.Patient;
import edu.ism.gestionRv.patient.data.repository.PatientRepository;
import edu.ism.gestionRv.rendezvous.data.entity.RendezVous;
import edu.ism.gestionRv.rendezvous.data.repository.RendezVousRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RendezVousService {

    private final RendezVousRepository rendezVousRepository;
    private final PatientRepository patientRepository;

    public List<RendezVous> getAll(Long patientId) {
        if (patientId != null) {
            return rendezVousRepository.findByPatientIdOrderByDateIsoDesc(patientId);
        }
        return rendezVousRepository.findAllByOrderByDateIsoDesc();
    }

    public RendezVous getById(String id) {
        return rendezVousRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rendez-vous introuvable: " + id));
    }

    public RendezVous updateStatus(String id, String status) {
        RendezVous rendezVous = getById(id);
        rendezVous.setStatus(toDomainStatus(status));
        return rendezVousRepository.save(rendezVous);
    }

    public RendezVous create(RendezVousRequestDto request) {
        Patient patient = patientRepository.findById(request.patientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient introuvable: " + request.patientId()));

        RendezVous rendezVous = RendezVous.builder()
                .id(nextId())
                .patient(patient)
                .specialite(request.specialite())
                .medecin(request.medecin())
                .dateIso(request.dateIso())
                .heure(request.heure())
                .lieu(request.lieu())
                .notes(request.notes())
                .status(toDomainStatus(request.status()))
                .build();
        return rendezVousRepository.save(rendezVous);
    }

    private String nextId() {
        int next = rendezVousRepository.findAll().stream()
                .map(RendezVous::getId)
                .map(id -> id.replace("RV-", ""))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0) + 1;

        return "RV-" + String.format("%04d", next);
    }

    private RendezVous.RvStatus toDomainStatus(String status) {
        if (status == null || status.isBlank()) {
            return RendezVous.RvStatus.EN_ATTENTE;
        }

        return switch (status) {
            case "confirme" -> RendezVous.RvStatus.CONFIRME;
            case "realise" -> RendezVous.RvStatus.REALISE;
            case "annule" -> RendezVous.RvStatus.ANNULE;
            default -> RendezVous.RvStatus.EN_ATTENTE;
        };
    }
}
