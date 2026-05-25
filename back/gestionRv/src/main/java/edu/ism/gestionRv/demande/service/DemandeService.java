package edu.ism.gestionRv.demande.service;

import edu.ism.gestionRv.demande.data.entity.Demande;
import edu.ism.gestionRv.demande.data.repository.DemandeRepository;
import edu.ism.gestionRv.patient.data.entity.Patient;
import edu.ism.gestionRv.patient.data.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class DemandeService {

    private final DemandeRepository demandeRepository;
    private final PatientRepository patientRepository;

    /**
     * Crée une nouvelle demande
     */
    public Demande createDemande(Long patientId, LocalDate dateConsultation, String motif, String remarques) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient non trouvé avec l'ID: " + patientId));

        Demande demande = new Demande();
        demande.setPatient(patient);
        demande.setDateConsultation(dateConsultation);
        demande.setMotif(motif);
        demande.setRemarques(remarques);
        demande.setStatut(Demande.StatutDemande.CREEE);
        demande.setDateCreation(LocalDateTime.now());
        demande.setDateModification(LocalDateTime.now());

        return demandeRepository.save(demande);
    }

    /**
     * Récupère toutes les demandes du jour
     */
    public List<Demande> getDemandesDuJour() {
        return demandeRepository.findDemandesDuJour();
    }

    /**
     * Récupère toutes les demandes du jour pour un patient spécifique
     */
    public List<Demande> getDemandesDuJourByPatient(Long patientId) {
        return demandeRepository.findDemandesDuJourByPatientId(patientId);
    }

    /**
     * Récupère les demandes avec filtres (date et/ou patient)
     */
    public List<Demande> getDemandesWithFilter(Long patientId, LocalDate date) {
        if (patientId != null && date != null) {
            return demandeRepository.findByPatientIdAndDateConsultation(patientId, date);
        } else if (patientId != null) {
            return demandeRepository.findByPatientId(patientId);
        } else if (date != null) {
            return demandeRepository.findByDateConsultation(date);
        } else {
            return demandeRepository.findAll();
        }
    }

    /**
     * Récupère toutes les demandes
     */
    public List<Demande> getAllDemandes() {
        return demandeRepository.findAll();
    }

    /**
     * Récupère une demande par ID
     */
    public Optional<Demande> getDemandeById(Long id) {
        return demandeRepository.findById(id);
    }

    /**
     * Valide une demande (change le statut de CREEE à VALIDEE)
     */
    public Demande validerDemande(Long demandeId) {
        Demande demande = demandeRepository.findById(demandeId)
                .orElseThrow(() -> new IllegalArgumentException("Demande non trouvée avec l'ID: " + demandeId));

        if (!demande.getStatut().equals(Demande.StatutDemande.CREEE)) {
            throw new IllegalStateException("Seules les demandes créées peuvent être validées");
        }

        demande.setStatut(Demande.StatutDemande.VALIDEE);
        demande.setDateModification(LocalDateTime.now());
        return demandeRepository.save(demande);
    }

    /**
     * Annule une demande
     */
    public Demande annulerDemande(Long demandeId) {
        Demande demande = demandeRepository.findById(demandeId)
                .orElseThrow(() -> new IllegalArgumentException("Demande non trouvée avec l'ID: " + demandeId));

        if (demande.getStatut().equals(Demande.StatutDemande.ANNULEE)) {
            throw new IllegalStateException("Cette demande est déjà annulée");
        }

        demande.setStatut(Demande.StatutDemande.ANNULEE);
        demande.setDateModification(LocalDateTime.now());
        return demandeRepository.save(demande);
    }

    /**
     * Marque une demande comme complétée
     */
    public Demande completarDemande(Long demandeId) {
        Demande demande = demandeRepository.findById(demandeId)
                .orElseThrow(() -> new IllegalArgumentException("Demande non trouvée avec l'ID: " + demandeId));

        if (!demande.getStatut().equals(Demande.StatutDemande.VALIDEE)) {
            throw new IllegalStateException("Seules les demandes validées peuvent être complétées");
        }

        demande.setStatut(Demande.StatutDemande.COMPLETEE);
        demande.setDateModification(LocalDateTime.now());
        return demandeRepository.save(demande);
    }

    /**
     * Supprime une demande
     */
    public void deleteDemande(Long demandeId) {
        if (!demandeRepository.existsById(demandeId)) {
            throw new IllegalArgumentException("Demande non trouvée avec l'ID: " + demandeId);
        }
        demandeRepository.deleteById(demandeId);
    }

    /**
     * Récupère les demandes par statut
     */
    public List<Demande> getDemandesByStatut(Demande.StatutDemande statut) {
        return demandeRepository.findByStatut(statut);
    }
}
