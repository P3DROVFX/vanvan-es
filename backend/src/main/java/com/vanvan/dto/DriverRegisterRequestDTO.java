package com.vanvan.dto;

/*
* DTO para cadastrar Driver (composição com DTO de Passenger com mais alguns dados)
* **/
public record DriverRegisterRequestDTO(RegisterRequestDTO passengerDTO, String cnh, String pixKey) implements RegisterDTO {
    @Override
    public String role() {
        return passengerDTO.role();
    }
}
