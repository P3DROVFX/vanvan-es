package com.vanvan.controller;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class DriverControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Deve retornar erro 400 ao tentar cadastrar motorista com CPF inválido")
    void deveRetornarErroAoCadastrarCpfInvalido() throws Exception {
        String driverJson = """
            {
                "name": "Melissa Pessoa",
                "cpf": "123",
                "phone": "87999999999",
                "email": "melissa@ufape.edu.br",
                "password": "senha",
                "cnh": "123456789",
                "pixKey": "pix-mel",
                "birthDate": "2000-01-01"
            }
            """;

        mockMvc.perform(post("/api/drivers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(driverJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("ADMIN deve conseguir listar motoristas filtrando por status PENDENTE")
    void deveListarMotoristasComFiltroStatus() throws Exception {
        mockMvc.perform(get("/api/admin/drivers")
                .param("status", "PENDENTE")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("ADMIN deve conseguir aprovar um motorista via endpoint")
    void deveAprovarMotoristaComSucesso() throws Exception {
            String driverID = UUID.randomUUID().toString();
            mockMvc.perform(post("/api/admin/drivers/" + driverID + "/approve")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("Usuário comum (USER) não deve ter acesso a endpoints administrativos")
    void usuarioComumNaoDeveAcessarEndpointsAdministrativos() throws Exception {
        mockMvc.perform(get("/api/admin/drivers"))
                .andExpect(status().isForbidden()); // Erro 403 - Proibido
    }
}