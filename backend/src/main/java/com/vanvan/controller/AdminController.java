package com.vanvan.controller;

import org.springframework.web.bind.annotation.*;
import com.vanvan.dto.DriverAdminResponseDTO;
import com.vanvan.dto.DriverStatusUpdateDTO;
import com.vanvan.dto.DriverUpdateDTO;
import com.vanvan.enums.RegistrationStatus;
import com.vanvan.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;

import java.util.UUID;



@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @SuppressWarnings("DefaultAnnotationParam")
    @GetMapping("/drivers")
    public ResponseEntity<Page<DriverAdminResponseDTO>> listDrivers(
            @RequestParam(required = false) RegistrationStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(adminService.listDrivers(status, pageable));
    }

    @PutMapping("/drivers/{id}/status")
    public ResponseEntity<DriverAdminResponseDTO> updateDriverStatus(
            @PathVariable UUID id,
            @Valid @RequestBody DriverStatusUpdateDTO dto) {
        return ResponseEntity.ok(adminService.updateDriverStatus(id, dto));
    }

    @PutMapping("/drivers/{id}")
    public ResponseEntity<DriverAdminResponseDTO> updateDriver(
            @PathVariable UUID id,
            @Valid @RequestBody DriverUpdateDTO dto) {
        return ResponseEntity.ok(adminService.updateDriver(id, dto));
    }

    @DeleteMapping("/drivers/{id}")
    public ResponseEntity<String> deleteDriver(@PathVariable UUID id) {
        adminService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }
}