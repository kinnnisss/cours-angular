package edu.ism.gestionRv.demande.exception;

public class DemandeNotFoundException extends RuntimeException {
    public DemandeNotFoundException(Long id) {
        super("Demande non trouvée avec l'ID: " + id);
    }

    public DemandeNotFoundException(String message) {
        super(message);
    }
}
