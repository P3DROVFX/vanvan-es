package com.vanvan.service;

import com.vanvan.dto.PricingUpdateDTO;
import com.vanvan.model.Pricing;
import com.vanvan.model.PricingAuditLog;
import com.vanvan.repository.PricingRepository;
import com.vanvan.repository.PricingAuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service // Faltava essa anotação
@RequiredArgsConstructor // Injeta os repositórios automaticamente
public class PricingService {

    private final PricingRepository pricingRepository;
    private final PricingAuditLogRepository auditLogRepository;
    private static final String PRICING_ID = "default";

    public Pricing getPricing() {
        return pricingRepository.findById(PRICING_ID)
                .orElseGet(this::initializePricing);
    }

    @Transactional
    public Pricing updatePricing(PricingUpdateDTO dto, String adminEmail) {
        Pricing currentPricing = getPricing();

        String oldValue = String.format("Minimum: %.2f, PerKm: %.2f, Cancellation: %.2f, Commission: %.2f",
                currentPricing.getMinimumFare(),
                currentPricing.getPerKmRate(),
                currentPricing.getCancellationFee(),
                currentPricing.getCommissionRate());

        String newValue = String.format("Minimum: %.2f, PerKm: %.2f, Cancellation: %.2f, Commission: %.2f",
                dto.minimumFare(),
                dto.perKmRate(),
                dto.cancellationFee(),
                dto.commissionRate());

        currentPricing.setMinimumFare(dto.minimumFare());
        currentPricing.setPerKmRate(dto.perKmRate());
        currentPricing.setCancellationFee(dto.cancellationFee());
        currentPricing.setCommissionRate(dto.commissionRate());
        currentPricing.setLastUpdated(LocalDateTime.now());
        currentPricing.setUpdatedBy(adminEmail);

        auditLogRepository.save(new PricingAuditLog(
                "UPDATE",
                oldValue,
                newValue,
                adminEmail
        ));

        return pricingRepository.save(currentPricing);
    }

    private Pricing initializePricing() {
        Pricing pricing = new Pricing();
        pricing.setId(PRICING_ID);
        pricing.setMinimumFare(10.00);
        pricing.setPerKmRate(1.50);
        pricing.setCancellationFee(2.50);
        pricing.setCommissionRate(15.0);
        pricing.setLastUpdated(LocalDateTime.now());
        return pricingRepository.save(pricing);
    }
}