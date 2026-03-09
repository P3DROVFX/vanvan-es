package com.vanvan.repository;

import com.vanvan.model.PricingAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface PricingAuditLogRepository extends JpaRepository<PricingAuditLog, UUID> {
}