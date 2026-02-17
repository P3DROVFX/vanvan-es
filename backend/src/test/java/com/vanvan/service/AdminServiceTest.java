package com.vanvan.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.vanvan.dto.DriverStatusUpdateDTO;
import com.vanvan.enums.RegistrationStatus;
import com.vanvan.model.Driver;
import com.vanvan.repository.DriverRepository;

@ExtendWith(MockitoExtension.class)
public class AdminServiceTest {

    @Mock
    private DriverRepository driverRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    @DisplayName("Deve barrar rejeição sem motivo")
    void testeRejeicaoSemMotivo() {
        UUID id = UUID.randomUUID();
        DriverStatusUpdateDTO dto = new DriverStatusUpdateDTO(RegistrationStatus.REJECTED, null);
        
       
        Driver driver = new Driver(
            "Melissa Pessoa", "12345678901", "87999999999", 
            "melissa@ufape.edu.br", "senha123", "123456789", 
            "pix-da-mel", LocalDate.of(2000, 1, 1)
        );

        when(driverRepository.findById(id)).thenReturn(Optional.of(driver));

        assertThrows(IllegalArgumentException.class, () -> {
            adminService.updateDriverStatus(id, dto);
        });
    }
}