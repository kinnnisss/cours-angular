package edu.ism.gestionRv.demande.data.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import edu.ism.gestionRv.patient.data.entity.Patient;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "demandes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Demande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private LocalDate dateConsultation;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private StatutDemande statut;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String motif;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String remarques;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @Column(nullable = true)
    private LocalDateTime dateModification;

    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDateTime.now();
        this.dateModification = LocalDateTime.now();
        if (this.statut == null) {
            this.statut = StatutDemande.CREEE;
        }
    }

    public enum StatutDemande {
        CREEE("Créée"),
        VALIDEE("Validée"),
        ANNULEE("Annulée"),
        COMPLETEE("Complétée");

        private final String label;

        StatutDemande(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }
}
