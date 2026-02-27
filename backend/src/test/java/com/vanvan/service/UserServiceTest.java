package com.vanvan.service;

import java.time.LocalDate;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.vanvan.dto.DriverRegisterRequestDTO;
import com.vanvan.exception.CnhAlreadyExistsException;
import com.vanvan.exception.CpfAlreadyExistsException;
import com.vanvan.exception.EmailAlreadyExistsException;
import com.vanvan.exception.UnderageDriverException;
import com.vanvan.model.Driver;
import com.vanvan.repository.DriverRepository;
import com.vanvan.repository.PassengerRepository;
import com.vanvan.repository.UserRepository;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock 
    private UserRepository userRepository;
    
    @Mock 
    private PassengerRepository passengerRepository;
    
    @Mock 
    private DriverRepository driverRepository;
    
    @Mock 
    private PasswordEncoder passwordEncoder;

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

    @Test
    @DisplayName("Deve lançar exceção se e-mail já existir")
    void shouldThrowWhenEmailExists() {
        DriverRegisterRequestDTO dto = new DriverRegisterRequestDTO("Vanvan", "jaexiste@email.com", "senha", "12345678900", "819", "DRIVER", LocalDate.of(2000, 1, 1), "999");
        
        when(userRepository.findByEmail(anyString())).thenReturn(new Driver()); // Simula que já achou
        
        assertThrows(EmailAlreadyExistsException.class, () -> userService.register(dto));
    }

    @Test
    @DisplayName("Deve lançar exceção se CPF já existir")
    void shouldThrowWhenCpfExists() {
        DriverRegisterRequestDTO dto = new DriverRegisterRequestDTO("Vanvan", "novo@email.com", "senha", "cpf-existente", "819", "DRIVER", LocalDate.of(2000, 1, 1), "999");
        
        when(userRepository.findByEmail(anyString())).thenReturn(null);
        when(userRepository.findByCpf(anyString())).thenReturn(new Driver()); // CPF já achado
        
        assertThrows(CpfAlreadyExistsException.class, () -> userService.register(dto));
    }

    @Test
    @DisplayName("Deve lançar exceção se CNH já existir")
    void shouldThrowWhenCnhExists() {
        DriverRegisterRequestDTO dto = new DriverRegisterRequestDTO("Vanvan", "novo@email.com", "senha", "123", "819", "DRIVER", LocalDate.of(2000, 1, 1), "cnh-existente");
        
        when(userRepository.findByEmail(anyString())).thenReturn(null);
        when(userRepository.findByCpf(anyString())).thenReturn(null);
        when(driverRepository.existsByCnh(anyString())).thenReturn(true);
        
        assertThrows(CnhAlreadyExistsException.class, () -> userService.register(dto));
    }

    @Test
    @DisplayName("Deve lançar exceção para Motorista menor de 21 anos")
    void shouldThrowWhenDriverIsUnder21() {
        DriverRegisterRequestDTO dto = new DriverRegisterRequestDTO("Vanvan", "novo@email.com", "senha", "123", "819", "DRIVER", LocalDate.now().minusYears(20), "111"); // 20 anos
        
        assertThrows(UnderageDriverException.class, () -> userService.register(dto));
    }

}