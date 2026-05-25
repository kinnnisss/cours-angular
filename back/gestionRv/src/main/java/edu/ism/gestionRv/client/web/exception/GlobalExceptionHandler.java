package edu.ism.gestionRv.client.web.exception;

import edu.ism.gestionRv.client.web.dto.ApiResponseDto;
import edu.ism.gestionRv.demande.exception.DemandeNotFoundException;
import edu.ism.gestionRv.demande.exception.InvalidDemandeStatusException;
import edu.ism.gestionRv.demande.exception.PatientNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DemandeNotFoundException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleDemandeNotFound(DemandeNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(PatientNotFoundException.class)
    public ResponseEntity<ApiResponseDto<Void>> handlePatientNotFound(PatientNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(InvalidDemandeStatusException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleInvalidStatus(InvalidDemandeStatusException ex) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponseDto<Void>> handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage() == null ? "Valeur invalide" : error.getDefaultMessage())
                .toList();
        return ResponseEntity.badRequest().body(ApiResponseDto.failure("Validation echouee", errors));
    }

    @ExceptionHandler({IllegalArgumentException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ApiResponseDto<Void>> handleBadRequest(Exception ex) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDto<Void>> handleGenericException(Exception ex) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Une erreur interne est survenue");
    }

    private ResponseEntity<ApiResponseDto<Void>> buildError(HttpStatus status, String message) {
        return ResponseEntity.status(status)
                .body(ApiResponseDto.failure(message, List.of(message)));
    }
}
