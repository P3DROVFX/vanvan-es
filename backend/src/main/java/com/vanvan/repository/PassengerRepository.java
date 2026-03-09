package com.vanvan.repository;

import com.vanvan.model.Passenger;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PassengerRepository extends JpaRepository<Passenger, UUID> {
    @Query("SELECT p FROM Passenger p WHERE" +
        "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
        "(:cpf IS NULL OR p.cpf = :cpf) AND " +
        "(:email IS NULL OR LOWER(p.email) = LOWER(:email))")
         Page<Passenger> findByFilters(
            @Param("name") String name,
            @Param("cpf") String cpf,
            @Param("email") String email,
            Pageable pageable);
}