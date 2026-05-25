package edu.ism.gestionRv.client.web.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class ApiStatusValidator implements ConstraintValidator<ValidApiStatus, String> {

    private Set<String> allowedValues;

    @Override
    public void initialize(ValidApiStatus annotation) {
        allowedValues = Arrays.stream(annotation.allowedValues())
                .collect(Collectors.toSet());
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }
        return allowedValues.contains(value);
    }
}
