package com.vanvan.controller;

package com.vanvan.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
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

}

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class DriverControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
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
}