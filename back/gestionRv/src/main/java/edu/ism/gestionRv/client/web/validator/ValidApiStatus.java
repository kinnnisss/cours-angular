package edu.ism.gestionRv.client.web.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ApiStatusValidator.class)
public @interface ValidApiStatus {
    String message() default "Le statut fourni est invalide";

    String[] allowedValues();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
