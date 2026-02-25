package com.vanvan.dto;

import java.time.LocalDate;
import java.util.UUID;
import com.vanvan.model.Driver;

public record ClientAdminResponseDTO(
    UUID id,
    String name,
    String email,
    String phone,
    LocalDate birthDate
) {
    public static ClientAdminResponseDTO from(Driver driver) {
        return new ClientAdminResponseDTO(
            driver.getId(),
            driver.getName(),
            driver.getEmail(),
            driver.getPhone(),
            driver.getBirthDate()
        );
    }
}