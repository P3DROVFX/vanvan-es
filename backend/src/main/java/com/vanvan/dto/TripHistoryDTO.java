package com.vanvan.dto;

import com.vanvan.enums.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
public class TripHistoryDTO {

    private Long id; //identificador da viagem

    private LocalDate date; //data da viagem
    private LocalTime time; //hora

    private String driverName; //nome do motorista
    private String departureCity;
    private String departureStreet;
    private String departureReference;
    
    private String arrivalCity;
    private String arrivalStreet;
    private String arrivalReference;

    private String route; //rota no formato "cidadeSaida - cidadeChegada"

    private Integer passengerCount; //quantidade de passageiros
    private Integer availableSeats;
    private Integer totalSeats;
    
    private Double distanceKm;

    private Double totalAmount; //valor total arrecadado

    private TripStatus status; //status da viagem
}
