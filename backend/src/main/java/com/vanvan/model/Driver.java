package com.vanvan.model;

import java.time.LocalDate;

import com.vanvan.enums.RegistrationStatus;
import com.vanvan.enums.UserRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "drivers")
@Getter
@Setter
@NoArgsConstructor//construtor sem argumentos
public class Driver extends User {
    
    @Column(name = "pix_key")
    private String pixKey;

    @Column(unique = true)
    private String cnh;

    @Enumerated(EnumType.STRING)
    @Column(name = "registration_status")
    private RegistrationStatus registrationStatus = RegistrationStatus.PENDING;
    
    @Column(name = "rejection_reason")
    private String rejectionReason;

    public Driver(String name, String cpf, String phone, String email, String password, String cnh, String pixKey, LocalDate birthDate) {
        super(name, cpf, phone, email, password, UserRole.DRIVER, birthDate);
        this.cnh = cnh;
        this.pixKey = pixKey;
        this.registrationStatus = RegistrationStatus.PENDING;
    }

}