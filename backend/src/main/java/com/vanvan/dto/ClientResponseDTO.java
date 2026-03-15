package com.vanvan.dto;

import com.vanvan.model.Passenger;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponseDTO {

    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String cpf;
    private LocalDate birthDate;

    public static ClientResponseDTO from(Passenger passenger) {
        return new ClientResponseDTO(
                passenger.getId(),
                passenger.getName(),
                passenger.getEmail(),
                passenger.getPhone(),
                passenger.getCpf(),
                passenger.getBirthDate()
        );
    }
}