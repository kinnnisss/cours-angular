package edu.ism.gestionRv.demande.exception;

public class InvalidDemandeStatusException extends RuntimeException {
    public InvalidDemandeStatusException(String message) {
        super(message);
    }
}
