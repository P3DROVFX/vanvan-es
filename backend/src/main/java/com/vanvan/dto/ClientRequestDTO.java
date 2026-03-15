package com.vanvan.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class ClientRequestDTO {
    private String name;
    private String email;
    private String phone;
    private String cpf;
    private LocalDate birthDate;
}