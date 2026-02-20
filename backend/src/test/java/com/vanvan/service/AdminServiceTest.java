package com.vanvan.service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.vanvan.dto.DriverAdminResponseDTO;
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

    @Test
    @DisplayName("Deve aprovar um motorista com sucesso")
    void deveAprovarMotoristaComSucesso() {
        UUID id = UUID.randomUUID();
        DriverStatusUpdateDTO dto = new DriverStatusUpdateDTO(RegistrationStatus.APPROVED, null);
        
        Driver driver = new Driver(
            "Melissa Pessoa", "12345678901", "87999999999", 
            "melissa@ufape.edu.br", "senha123", "123456789", 
            "pix-da-mel", LocalDate.of(2000, 1, 1)
        );

        when(driverRepository.findById(id)).thenReturn(Optional.of(driver));
        when(driverRepository.save(any(Driver.class))).thenReturn(driver);

        DriverAdminResponseDTO resultado = adminService.updateDriverStatus(id, dto);

        assertNotNull(resultado);
        assertEquals(RegistrationStatus.APPROVED, driver.getRegistrationStatus());
        verify(driverRepository, times(1)).save(driver);
    }
    @Test
    @DisplayName("Deve permitir a transição de REJECTED para APPROVED (Comportamento atual)")
    void devePermitirTransicaoDeRejeitadoParaAprovado() {
       
        UUID driverId = UUID.randomUUID();
        Driver motorista = new Driver();
        motorista.setId(driverId);
        motorista.setRegistrationStatus(RegistrationStatus.REJECTED);
        motorista.setRejectionReason("Documento ilegível");

        
        DriverStatusUpdateDTO dto = new DriverStatusUpdateDTO(RegistrationStatus.APPROVED, null);

        when(driverRepository.findById(driverId)).thenReturn(Optional.of(motorista));
        when(driverRepository.save(any(Driver.class))).thenAnswer(invocation -> invocation.getArgument(0));

        
        adminService.updateDriverStatus(driverId, dto);

        
        assertEquals(RegistrationStatus.APPROVED, motorista.getRegistrationStatus());
        assertNull(motorista.getRejectionReason()); 
        verify(driverRepository, times(1)).save(motorista);
    }


}