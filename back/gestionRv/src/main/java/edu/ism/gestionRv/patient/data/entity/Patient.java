package edu.ism.gestionRv.patient.data.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true,updatable = false)
    private String userId; // Utiliser l'ID généré comme userId
    private String numero;
    private String nom;
    private String prenom;
    @Column(unique = true)
    private String tel;
    private String adresse;
    @Column(nullable = true, columnDefinition = "TEXT")
    private String antecedents;

    @PrePersist
    public void prePersist() {
        if (this.userId == null || this.userId.isEmpty()) {
            this.userId = "USER-00" + this.id;
        }
    }
}