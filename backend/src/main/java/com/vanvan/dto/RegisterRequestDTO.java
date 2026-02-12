package com.vanvan.dto;

/*
* Como há DTOs diferentes, cria-se essa "herança"
* **/
public record RegisterRequestDTO(String username, String email, String password, String CPF, String phone, String role) implements RegisterDTO {}