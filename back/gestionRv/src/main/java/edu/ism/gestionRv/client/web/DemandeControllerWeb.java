package edu.ism.gestionRv.client.web;

import edu.ism.gestionRv.demande.data.entity.Demande;
import edu.ism.gestionRv.demande.service.DemandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/demandes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DemandeControllerWeb {

    private final DemandeService demandeService;

    @PostMapping
    public ResponseEntity<Demande> createDemande(
            @RequestParam Long patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateConsultation,
            @RequestParam(required = false) String motif,
            @RequestParam(required = false) String remarques) {
        try {
            Demande demande = demandeService.createDemande(patientId, dateConsultation, motif, remarques);
            return ResponseEntity.status(HttpStatus.CREATED).body(demande);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/du-jour")
    public ResponseEntity<List<Demande>> getDemandesDuJour() {
        List<Demande> demandes = demandeService.getDemandesDuJour();
        return ResponseEntity.ok(demandes);
    }

    @GetMapping("/du-jour/patient/{patientId}")
    public ResponseEntity<List<Demande>> getDemandesDuJourByPatient(@PathVariable Long patientId) {
        List<Demande> demandes = demandeService.getDemandesDuJourByPatient(patientId);
        return ResponseEntity.ok(demandes);
    }

    @GetMapping
    public ResponseEntity<List<Demande>> getAllDemandes() {
        List<Demande> demandes = demandeService.getAllDemandes();
        return ResponseEntity.ok(demandes);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Demande>> getDemandesWithFilter(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Demande> demandes = demandeService.getDemandesWithFilter(patientId, date);
        return ResponseEntity.ok(demandes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Demande> getDemandeById(@PathVariable Long id) {
        Optional<Demande> demande = demandeService.getDemandeById(id);
        return demande.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/valider")
    public ResponseEntity<Demande> validerDemande(@PathVariable Long id) {
        try {
            Demande demande = demandeService.validerDemande(id);
            return ResponseEntity.ok(demande);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/annuler")
    public ResponseEntity<Demande> annulerDemande(@PathVariable Long id) {
        try {
            Demande demande = demandeService.annulerDemande(id);
            return ResponseEntity.ok(demande);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/completer")
    public ResponseEntity<Demande> completarDemande(@PathVariable Long id) {
        try {
            Demande demande = demandeService.completarDemande(id);
            return ResponseEntity.ok(demande);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDemande(@PathVariable Long id) {
        try {
            demandeService.deleteDemande(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Demande>> getDemandesByStatut(@PathVariable Demande.StatutDemande statut) {
        List<Demande> demandes = demandeService.getDemandesByStatut(statut);
        return ResponseEntity.ok(demandes);
    }
}
