package com.vanvan.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pricing")
@Getter
@Setter
@NoArgsConstructor
public class Pricing {
    
    @Id
    private String id = "default"; //id fixo

    private double minimumFare; //tarifa mínima
    private double perKmRate; //tarifa por km 
    private double cancellationFee; //taxa de cancelamento
    private double commissionRate; //taxa de comissão da plataforma (em porcentagem)

    private LocalDateTime lastUpdated; //data da última atualização dos preços
    private String updatedBy; //quem fez a última atualização dos preços (email do admin)
}

