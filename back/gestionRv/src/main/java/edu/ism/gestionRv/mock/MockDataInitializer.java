package edu.ism.gestionRv.mock;

import edu.ism.gestionRv.demande.data.entity.Demande;
import edu.ism.gestionRv.demande.data.repository.DemandeRepository;
import edu.ism.gestionRv.patient.data.entity.Patient;
import edu.ism.gestionRv.patient.data.repository.PatientRepository;
import edu.ism.gestionRv.rendezvous.data.entity.RendezVous;
import edu.ism.gestionRv.rendezvous.data.repository.RendezVousRepository;
import edu.ism.gestionRv.user.data.entity.AppUser;
import edu.ism.gestionRv.user.data.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MockDataInitializer implements CommandLineRunner {

    private final AppUserRepository appUserRepository;
    private final PatientRepository patientRepository;
    private final DemandeRepository demandeRepository;
    private final RendezVousRepository rendezVousRepository;

    @Override
    public void run(String... args) {
        if (appUserRepository.count() > 0 || patientRepository.count() > 0) {
            return;
        }

        appUserRepository.saveAll(List.of(
                AppUser.builder().id("USER-001").nom("John Doe").email("john@example.com").password("password123").role("patient").build(),
                AppUser.builder().id("USER-002").nom("Jane Smith").email("jane@example.com").password("password456").role("patient").build(),
                AppUser.builder().id("USER-003").nom("Admin User").email("admin@example.com").password("adminpass").role("admin").build(),
                AppUser.builder().id("USER-004").nom("Dr. House").email("house@gmail.com").password("housepass").role("medecin").build(),
                AppUser.builder().id("USER-005").nom("Secretaire User").email("secretaire@gmail.com").password("secretairepass").role("secretaire").build(),
                AppUser.builder().id("USER-006").nom("Dr. Strange").email("strange@gmail.com").password("strangepass").role("medecin").build(),
                AppUser.builder().id("USER-007").nom("Patient Zero").email("zero@gmail.com").password("zeropass").role("patient").build(),
                AppUser.builder().id("USER-008").nom("Jane Doe").email("jd@gmail.com").password("jdpass").role("patient").build()
        ));

        Patient patient1 = patientRepository.save(Patient.builder().userId("USER-001").numero("PAT-001").nom("Doe").prenom("John").tel("770000001").adresse("Dakar, Point E").antecedents("Diabetes").build());
        Patient patient2 = patientRepository.save(Patient.builder().userId("USER-002").numero("PAT-002").nom("Smith").prenom("Jane").tel("770000002").adresse("Dakar, Sacre-Coeur").antecedents("").build());
        Patient patient3 = patientRepository.save(Patient.builder().userId("USER-007").numero("PAT-003").nom("Zero").prenom("Patient").tel("770000007").adresse("Dakar, Medina").antecedents("Hypertension").build());
        Patient patient4 = patientRepository.save(Patient.builder().userId("USER-008").numero("PAT-004").nom("Doe").prenom("Jane").tel("770000008").adresse("Dakar, Liberte 6").antecedents("").build());

        demandeRepository.saveAll(List.of(
                buildDemande(patient1, "Cardiologie", LocalDate.now().plusDays(1), "09:00", Demande.StatutDemande.CREEE, "Douleurs thoraciques"),
                buildDemande(patient2, "Dermatologie", LocalDate.now().plusDays(2), "10:30", Demande.StatutDemande.VALIDEE, "Irritation cutanee"),
                buildDemande(patient3, "Ophtalmologie", LocalDate.now().plusDays(3), "14:00", Demande.StatutDemande.ANNULEE, "Vision trouble"),
                buildDemande(patient4, "Generaliste", LocalDate.now().plusDays(4), "08:30", Demande.StatutDemande.CREEE, "Controle annuel"),
                buildDemande(patient1, "Dermatologie", LocalDate.now().plusDays(5), "11:35", Demande.StatutDemande.COMPLETEE, "Suivi traitement"),
                buildDemande(patient2, "Cardiologie", LocalDate.now().plusDays(6), "09:30", Demande.StatutDemande.ANNULEE, "Palpitations")
        ));

        rendezVousRepository.saveAll(List.of(
                RendezVous.builder().id("RV-0001").patient(patient1).specialite("Cardiologie").medecin("Dr. House").dateIso(LocalDate.now().plusDays(10)).heure("09:00").lieu("Clinique Central").status(RendezVous.RvStatus.CONFIRME).build(),
                RendezVous.builder().id("RV-0002").patient(patient2).specialite("Dermatologie").medecin("Dr. Strange").dateIso(LocalDate.now().plusDays(11)).heure("10:30").lieu("Clinique de la Paix").notes("Consultation effectuee").status(RendezVous.RvStatus.REALISE).build(),
                RendezVous.builder().id("RV-0003").patient(patient3).specialite("Ophtalmologie").medecin("Dr. House").dateIso(LocalDate.now().plusDays(12)).heure("14:00").lieu("Hopital Principal").status(RendezVous.RvStatus.EN_ATTENTE).build(),
                RendezVous.builder().id("RV-0004").patient(patient4).specialite("Generaliste").medecin("Dr. Strange").dateIso(LocalDate.now().plusDays(13)).heure("08:30").lieu("Clinique Central").status(RendezVous.RvStatus.ANNULE).build()
        ));
    }

    private Demande buildDemande(Patient patient, String specialite, LocalDate date, String heure, Demande.StatutDemande statut, String motif) {
        return Demande.builder()
                .patient(patient)
                .specialite(specialite)
                .dateConsultation(date)
                .heureConsultation(heure)
                .statut(statut)
                .motif(motif)
                .dateCreation(LocalDateTime.now().minusDays(1))
                .dateModification(LocalDateTime.now().minusHours(2))
                .build();
    }
}
