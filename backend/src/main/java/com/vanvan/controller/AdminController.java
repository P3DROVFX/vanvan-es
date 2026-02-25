package com.vanvan.controller;

import com.vanvan.dto.DriverAdminResponseDTO;
import com.vanvan.dto.DriverStatusUpdateDTO;
import com.vanvan.dto.DriverUpdateDTO;
import com.vanvan.model.User;
import com.vanvan.enums.RegistrationStatus;
import com.vanvan.service.AdminService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/drivers")
    public ResponseEntity<Page<DriverAdminResponseDTO>> listDrivers(
            @RequestParam(required = false) RegistrationStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(adminService.listDrivers(status, pageable));
    }

    @PutMapping("/drivers/{id}/status")
    public ResponseEntity<?> updateDriverStatus(
            @PathVariable UUID id,
            @Valid @RequestBody DriverStatusUpdateDTO dto) {
        try {
            return ResponseEntity.ok(adminService.updateDriverStatus(id, dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/drivers/{id}")
    public ResponseEntity<?> updateDriver(
            @PathVariable UUID id,
            @Valid @RequestBody DriverUpdateDTO dto) {
        try {
            return ResponseEntity.ok(adminService.updateDriver(id, dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/drivers/{id}")
    public ResponseEntity<?> deleteDriver(@PathVariable UUID id) {
        try {
            adminService.deleteDriver(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

   @GetMapping("/clients")
    public ResponseEntity<Page<User>> listClients(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(adminService.listClients(pageable));
    }

    @PostMapping("/clients")
    public ResponseEntity<?> createClient(@RequestBody User dto) {
        try {
            return ResponseEntity.ok(adminService.createClient(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/clients/{id}")
    public ResponseEntity<?> updateClient(
            @PathVariable UUID id,
            @RequestBody User dto) {
        try {
            return ResponseEntity.ok(adminService.updateClient(id, dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/clients/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable UUID id) {
        try {
            adminService.deleteClient(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}