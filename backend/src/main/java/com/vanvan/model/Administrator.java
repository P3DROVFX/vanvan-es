package com.vanvan.model;

import com.vanvan.enums.UserRole;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;
import org.jspecify.annotations.NullMarked;

@Entity
@Table(name = "administrators")
@NoArgsConstructor//construtor vazio
public class Administrator extends User {
    public Administrator(String name, String cpf, String phone, String email, String password) {
        super(name, cpf, phone, email, password, UserRole.ADMIN);
    }

}