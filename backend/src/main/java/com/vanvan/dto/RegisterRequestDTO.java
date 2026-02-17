package com.vanvan.dto;

import com.vanvan.enums.UserRole;
import com.vanvan.model.Administrator;
import com.vanvan.model.Passenger;
import com.vanvan.model.User;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
public class RegisterRequestDTO extends RegisterDTO {

    public RegisterRequestDTO(String name, String email, String password, String cpf, String phone, String role, LocalDate birthDate) {
        super(name, email, password, cpf, phone, role, birthDate);
    }

    @Override
    public User toEntity() {
        UserRole parsedRole = UserRole.valueOf(role.toUpperCase());

        return switch (parsedRole) {
            case PASSENGER -> new Passenger(
                    name, cpf, phone, email, password, birthDate
            );
            case ADMIN -> new Administrator(
                    name, cpf, phone, email, password, birthDate
            );
            default -> throw new IllegalArgumentException("Invalid role: " + role);
        };
    }
}
