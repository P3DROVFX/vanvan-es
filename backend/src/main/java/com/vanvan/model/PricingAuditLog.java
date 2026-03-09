package com.vanvan.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pricing_audit_logs")
@Getter
@Setter
@NoArgsConstructor
public class PricingAuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String operation;

    @Column(columnDefinition = "TEXT")
    private String oldValue;

    @Column(columnDefinition = "TEXT")
    private String newValue;

    private String changedBy;
    private LocalDateTime timestamp;

    public PricingAuditLog(String operation, String oldValue, String newValue, String changedBy) {
        this.operation = operation;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.changedBy = changedBy;
        this.timestamp = LocalDateTime.now();
    }
}
