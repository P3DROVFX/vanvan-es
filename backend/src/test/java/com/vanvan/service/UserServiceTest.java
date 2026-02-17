package com.vanvan.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.vanvan.dto.DriverRegisterRequestDTO;
import com.vanvan.enums.UserRole;
import com.vanvan.model.Driver;
import com.vanvan.repository.DriverRepository;
import com.vanvan.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;
 
    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private DriverRepository driverRepository;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("Deve salvar Motorista com CNH")
    void shouldRegisterDriver() {
        
        DriverRegisterRequestDTO dto = new DriverRegisterRequestDTO(
            "Vanvan",                                 
            "van@email.com",                          
            "senha123",                               
            "12345678900",                            
            "81988888888",                            
            "DRIVER",                                 
            LocalDate.of(2003, 10, 13),               
            "99988877700"                             
        );
        
        dto.setPixKey("chave-pix-da-van");

        when(passwordEncoder.encode(anyString())).thenReturn("senhaCriptografada");
       
        
   
        userService.register(dto);

        verify(driverRepository, times(1)).save(any(Driver.class));
        
    }
}