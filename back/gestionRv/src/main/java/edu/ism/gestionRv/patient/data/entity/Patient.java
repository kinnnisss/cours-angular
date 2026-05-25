package edu.ism.gestionRv.patient.data.entity;

import edu.ism.gestionRv.demande.data.entity.Demande;
import edu.ism.gestionRv.rendezvous.data.entity.RendezVous;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String userId;

    private String numero;
    private String nom;
    private String prenom;

    @Column(unique = true)
    private String tel;

    private String adresse;

    @Column(columnDefinition = "TEXT")
    private String antecedents;

    @Builder.Default
    @OneToMany(mappedBy = "patient")
    private List<Demande> demandes = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "patient")
    private List<RendezVous> rendezVous = new ArrayList<>();
}
