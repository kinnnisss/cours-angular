package edu.ism.gestionRv.patient.data.repository;

import edu.ism.gestionRv.patient.data.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findAllByUserId(String userId);

    Optional<Patient> findByUserId(String userId);

    Page<Patient> findByNumeroContainingIgnoreCaseOrNomContainingIgnoreCaseOrPrenomContainingIgnoreCaseOrTelContainingIgnoreCase(
            String numero,
            String nom,
            String prenom,
            String tel,
            Pageable pageable
    );
}
