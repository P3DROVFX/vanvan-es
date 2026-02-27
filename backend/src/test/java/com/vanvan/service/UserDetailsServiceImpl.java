package com.vanvan.service;

import com.vanvan.model.User;
import com.vanvan.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Test
    @DisplayName("Deve carregar o usuário pelo e-mail com sucesso")
    void loadUserByUsernameSuccess() {
        String email = "teste@email.com";
        User mockUser = new com.vanvan.model.Passenger(); // Pode usar qualquer subclasse de User
        mockUser.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(mockUser);

        var result = userDetailsService.loadUserByUsername(email);

        assertEquals(mockUser, result);
    }

    @Test
    @DisplayName("Deve retornar null quando e-mail não existir")
    void loadUserByUsernameNotFound() {
        String email = "naoexiste@email.com";
        when(userRepository.findByEmail(email)).thenReturn(null);

        var result = userDetailsService.loadUserByUsername(email);

        assertNull(result);
    }
}