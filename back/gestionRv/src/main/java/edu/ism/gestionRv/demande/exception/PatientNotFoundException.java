package edu.ism.gestionRv.demande.exception;

public class PatientNotFoundException extends RuntimeException {
    public PatientNotFoundException(Long id) {
        super("Patient non trouvé avec l'ID: " + id);
    }

    public PatientNotFoundException(String message) {
        super(message);
    }
}
