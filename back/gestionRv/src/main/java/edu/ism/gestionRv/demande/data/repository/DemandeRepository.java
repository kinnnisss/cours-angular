package edu.ism.gestionRv.demande.data.repository;

import edu.ism.gestionRv.demande.data.entity.Demande;
import edu.ism.gestionRv.patient.data.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DemandeRepository extends JpaRepository<Demande, Long> {

    @Query("SELECT d FROM Demande d WHERE d.patient.id = :patientId AND d.dateConsultation = CURRENT_DATE AND d.statut != 'ANNULEE'")
    List<Demande> findDemandesDuJourByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT d FROM Demande d WHERE d.dateConsultation = CURRENT_DATE AND d.statut != 'ANNULEE' ORDER BY d.dateConsultation ASC")
    List<Demande> findDemandesDuJour();

    List<Demande> findByPatientIdAndStatutNot(Long patientId, Demande.StatutDemande statut);

    @Query("SELECT d FROM Demande d WHERE d.dateConsultation = :date AND d.statut != 'ANNULEE' ORDER BY d.dateConsultation ASC")
    List<Demande> findByDateConsultation(@Param("date") LocalDate date);

    @Query("SELECT d FROM Demande d WHERE d.patient.id = :patientId AND d.dateConsultation = :date AND d.statut != 'ANNULEE'")
    List<Demande> findByPatientIdAndDateConsultation(@Param("patientId") Long patientId, @Param("date") LocalDate date);

    List<Demande> findByStatut(Demande.StatutDemande statut);

    List<Demande> findByPatientId(Long patientId);

    Optional<Demande> findByPatient(Patient patient);

    @Query("""
            SELECT d FROM Demande d
            JOIN d.patient p
            WHERE (:patientId IS NULL OR p.id = :patientId)
            AND (:date IS NULL OR d.dateConsultation = :date)
            AND (:specialite IS NULL OR LOWER(d.specialite) = LOWER(:specialite))
            AND (:patientQuery IS NULL OR LOWER(CONCAT(p.prenom, ' ', p.nom)) LIKE LOWER(CONCAT('%', :patientQuery, '%')) OR STR(p.id) LIKE CONCAT('%', :patientQuery, '%'))
            AND (:applyStatusFilter = false OR d.statut IN :statuses)
            """)
    Page<Demande> searchDemandes(
            @Param("patientId") Long patientId,
            @Param("date") LocalDate date,
            @Param("specialite") String specialite,
            @Param("patientQuery") String patientQuery,
            @Param("applyStatusFilter") boolean applyStatusFilter,
            @Param("statuses") List<Demande.StatutDemande> statuses,
            Pageable pageable
    );
}
