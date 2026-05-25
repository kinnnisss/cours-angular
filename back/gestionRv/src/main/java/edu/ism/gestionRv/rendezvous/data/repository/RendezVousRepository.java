package edu.ism.gestionRv.rendezvous.data.repository;

import edu.ism.gestionRv.rendezvous.data.entity.RendezVous;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RendezVousRepository extends JpaRepository<RendezVous, String> {
    List<RendezVous> findByPatientIdOrderByDateIsoDesc(Long patientId);

    List<RendezVous> findAllByOrderByDateIsoDesc();
}
