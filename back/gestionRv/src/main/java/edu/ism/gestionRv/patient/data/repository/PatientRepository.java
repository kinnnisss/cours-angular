package edu.ism.gestionRv.patient.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import edu.ism.gestionRv.patient.data.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    
}
