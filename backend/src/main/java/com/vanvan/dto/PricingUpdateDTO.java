package com.vanvan.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PricingUpdateDTO(
    @NotNull @Positive 
    Double minimumFare,

    @NotNull @Positive
    Double perKmRate,

    @NotNull @Positive 
    Double cancellationFee,

    @NotNull @DecimalMin("0.0") @DecimalMax("100.0") 
    Double commissionRate
) {}