package com.vanvan.service;

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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DriverServiceTest {

    @Mock
    private DriverRepository driverRepository;

    @InjectMocks
    private AdminService adminService;

    @Test
    @DisplayName("Deve garantir que um novo motorista comece com status PENDING")
    void deveTerStatusInicialPendente() {
        Driver motorista = new Driver();
        assertEquals(RegistrationStatus.PENDING, motorista.getRegistrationStatus());
    }

    @Test
    @DisplayName("Deve aprovar um motorista com sucesso")
    void deveAprovarMotorista() {
        UUID driverId = UUID.randomUUID();
        Driver motorista = new Driver();
        motorista.setId(driverId);
        motorista.setRegistrationStatus(RegistrationStatus.PENDING);

        DriverStatusUpdateDTO dto = new DriverStatusUpdateDTO(RegistrationStatus.APPROVED, null);

        when(driverRepository.findById(driverId)).thenReturn(Optional.of(motorista));
        when(driverRepository.save(any(Driver.class))).thenReturn(motorista);

        adminService.updateDriverStatus(driverId, dto);

        assertEquals(RegistrationStatus.APPROVED, motorista.getRegistrationStatus());
        verify(driverRepository, times(1)).save(motorista);
    }

    @Test
    @DisplayName("Deve lançar erro ao reprovar motorista sem informar o motivo")
    void reprovacaoDeveExigirMotivo() {
        UUID driverId = UUID.randomUUID();
        Driver motorista = new Driver();
        motorista.setId(driverId);

        DriverStatusUpdateDTO dto = new DriverStatusUpdateDTO(RegistrationStatus.REJECTED, "");

        when(driverRepository.findById(driverId)).thenReturn(Optional.of(motorista));

        // Como o AdminService usa IllegalArgumentException, o teste deve esperar ela
        assertThrows(IllegalArgumentException.class, () -> {
            adminService.updateDriverStatus(driverId, dto);
        });
    }
}