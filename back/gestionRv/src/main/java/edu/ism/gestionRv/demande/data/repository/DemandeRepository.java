package edu.ism.gestionRv.demande.data.repository;

import edu.ism.gestionRv.demande.data.entity.Demande;
import edu.ism.gestionRv.patient.data.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DemandeRepository extends JpaRepository<Demande, Long> {

    /**
     * Récupère toutes les demandes du jour pour un patient donné
     */
    @Query("SELECT d FROM Demande d WHERE d.patient.id = :patientId AND d.dateConsultation = CURRENT_DATE AND d.statut != 'ANNULEE'")
    List<Demande> findDemandesDuJourByPatientId(@Param("patientId") Long patientId);

    /**
     * Récupère toutes les demandes du jour
     */
    @Query("SELECT d FROM Demande d WHERE d.dateConsultation = CURRENT_DATE AND d.statut != 'ANNULEE' ORDER BY d.dateConsultation ASC")
    List<Demande> findDemandesDuJour();

    /**
     * Récupère les demandes filtrées par patient
     */
    List<Demande> findByPatientIdAndStatutNot(Long patientId, Demande.StatutDemande statut);

    /**
     * Récupère les demandes filtrées par date
     */
    @Query("SELECT d FROM Demande d WHERE d.dateConsultation = :date AND d.statut != 'ANNULEE' ORDER BY d.dateConsultation ASC")
    List<Demande> findByDateConsultation(@Param("date") LocalDate date);

    /**
     * Récupère les demandes filtrées par patient et date
     */
    @Query("SELECT d FROM Demande d WHERE d.patient.id = :patientId AND d.dateConsultation = :date AND d.statut != 'ANNULEE'")
    List<Demande> findByPatientIdAndDateConsultation(@Param("patientId") Long patientId, @Param("date") LocalDate date);

    /**
     * Récupère les demandes filtrées par statut
     */
    List<Demande> findByStatut(Demande.StatutDemande statut);

    /**
     * Récupère toutes les demandes d'un patient
     */
    List<Demande> findByPatientId(Long patientId);

    /**
     * Récupère une demande par patient
     */
    Optional<Demande> findByPatient(Patient patient);
}
