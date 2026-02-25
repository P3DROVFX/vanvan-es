package com.vanvan.service;

import com.vanvan.dto.DriverUpdateDTO;
import com.vanvan.dto.DriverAdminResponseDTO;
import com.vanvan.dto.DriverStatusUpdateDTO;
import com.vanvan.enums.RegistrationStatus;
import com.vanvan.model.Driver;
import com.vanvan.model.User;
import com.vanvan.repository.DriverRepository;
import com.vanvan.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final DriverRepository driverRepository;
    private final UserRepository userRepository;

    public Page<DriverAdminResponseDTO> listDrivers(RegistrationStatus status, Pageable pageable) {
        if (status != null) {
            return driverRepository.findByRegistrationStatus(status, pageable)
                    .map(DriverAdminResponseDTO::from);
        }
        else{
            return driverRepository.findAll(pageable)
                    .map(DriverAdminResponseDTO::from);
        }
    }

    //metodo que serve para arpovar ou rejeitar um motorista
    public DriverAdminResponseDTO updateDriverStatus(UUID driverId, DriverStatusUpdateDTO dto) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Motorista não encontrado."));

        if (dto.status() == RegistrationStatus.REJECTED && (dto.rejectionReason() == null || dto.rejectionReason().isBlank())) {
            throw new IllegalArgumentException("O motivo da rejeição é obrigatório.");
        }

        driver.setRegistrationStatus(dto.status());

        if (dto.status() == RegistrationStatus.REJECTED) {
            driver.setRejectionReason(dto.rejectionReason());
        } else {
            driver.setRejectionReason(null); 
        }
        return DriverAdminResponseDTO.from(driverRepository.save(driver));
    }

    public DriverAdminResponseDTO updateDriver(UUID driverId, DriverUpdateDTO dto) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Motorista não encontrado."));

        if (dto.name() != null && !dto.name().isBlank()) driver.setName(dto.name());
        if (dto.email() != null && !dto.email().isBlank()) driver.setEmail(dto.email());
        if (dto.phone() != null && !dto.phone().isBlank()) driver.setPhone(dto.phone());
        if (dto.cnh() != null && !dto.cnh().isBlank()) driver.setCnh(dto.cnh());
        if (dto.cpf() != null && !dto.cpf().isBlank()) driver.setCpf(dto.cpf());
        if (dto.registrationStatus() != null) driver.setRegistrationStatus(dto.registrationStatus());

        return DriverAdminResponseDTO.from(driverRepository.save(driver));
    }

    public void deleteDriver(UUID driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Motorista não encontrado."));
        driverRepository.delete(driver);
    }

    public Page<User> listClients(Pageable pageable) {
        return userRepository.findByRole(com.vanvan.enums.UserRole.PASSENGER, pageable);
    }

    public User createClient(User dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Já existe um usuário com este email.");
        }
       
        return userRepository.save(dto);
    }

    public User updateClient(UUID clientId, User dto) {
        User user = userRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));

        if (dto.getName() != null && !dto.getName().isBlank()) user.setName(dto.getName());
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null && !dto.getPhone().isBlank()) user.setPhone(dto.getPhone());
        
        return userRepository.save(user);
    }

    public void deleteClient(UUID clientId) {
        User user = userRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
        userRepository.delete(user);
    }

}

