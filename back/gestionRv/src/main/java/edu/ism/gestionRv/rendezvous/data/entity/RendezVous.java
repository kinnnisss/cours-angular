package edu.ism.gestionRv.rendezvous.data.entity;

import edu.ism.gestionRv.patient.data.entity.Patient;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "rdvs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RendezVous {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private String specialite;

    @Column(nullable = false)
    private String medecin;

    @Column(nullable = false)
    private LocalDate dateIso;

    @Column(nullable = false)
    private String heure;

    @Column(nullable = false)
    private String lieu;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RvStatus status;

    public enum RvStatus {
        CONFIRME,
        REALISE,
        EN_ATTENTE,
        ANNULE
    }
}
