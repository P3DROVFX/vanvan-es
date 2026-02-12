package com.vanvan.dto;

public sealed interface RegisterDTO permits RegisterRequestDTO, DriverRegisterRequestDTO {
    String role();
}