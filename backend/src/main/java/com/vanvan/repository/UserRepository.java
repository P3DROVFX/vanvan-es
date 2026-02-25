package com.vanvan.repository;

import com.vanvan.model.User;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {
    
    User findByEmail(String email);

    User findByCpf(String cpf);
    boolean existsByCpf(String cpf);
    boolean existsByEmail(String email);
    
    // Adicione esta linha junto com os outros 'findBy'
    org.springframework.data.domain.Page<User> findByRole(com.vanvan.enums.UserRole role, org.springframework.data.domain.Pageable pageable);
}