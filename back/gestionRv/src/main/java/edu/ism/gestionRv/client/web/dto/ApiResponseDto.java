package edu.ism.gestionRv.client.web.dto;

import java.util.List;

public record ApiResponseDto<T>(
        boolean success,
        String message,
        T data,
        List<String> errors
) {
    public static <T> ApiResponseDto<T> success(String message, T data) {
        return new ApiResponseDto<>(true, message, data, List.of());
    }

    public static <T> ApiResponseDto<T> failure(String message, List<String> errors) {
        return new ApiResponseDto<>(false, message, null, errors);
    }
}
