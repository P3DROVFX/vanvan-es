package com.vanvan.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vanvan.dto.CreateTripDTO;
import com.vanvan.dto.TripDetailsDTO;
import com.vanvan.dto.TripHistoryDTO;
import com.vanvan.dto.TripMonitorDTO;
import com.vanvan.enums.TripStatus;
import com.vanvan.exception.DriverNotFoundException;
import com.vanvan.exception.InvalidStatusTransitionException;
import com.vanvan.exception.TripNotFoundException;
import com.vanvan.model.Location;
import com.vanvan.model.Passenger;
import com.vanvan.model.Pricing;
import com.vanvan.model.Trip;
import com.vanvan.repository.DriverRepository;
import com.vanvan.repository.PassengerRepository;
import com.vanvan.repository.TripRepository;
import com.vanvan.repository.TripSpecification;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final DriverRepository driverRepository;
    private final PassengerRepository passengerRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final GeocodingService geocodingService;
    private final RoutingService routingService;
    private final PricingService pricingService;

    // Mapa de transições permitidas: status atual → set de próximos status válidos
    private static final Map<TripStatus, Set<TripStatus>> ALLOWED_TRANSITIONS = Map.of(
            TripStatus.SCHEDULED, Set.of(TripStatus.IN_PROGRESS, TripStatus.CANCELLED),
            TripStatus.IN_PROGRESS, Set.of(TripStatus.COMPLETED),
            TripStatus.COMPLETED, Set.of(),
            TripStatus.CANCELLED, Set.of()
    );

    public TripDetailsDTO createTrip(CreateTripDTO dto) {

        var driver = driverRepository.findById(dto.getDriverId())
                .orElseThrow(DriverNotFoundException::new);

        var departureDTO = dto.getDeparture();
        var arrivalDTO = dto.getArrival();

        // 1. Geocodifica as cidades via Nominatim
        double[] originCoords = geocodingService.getCoordinates(departureDTO.getCity());
        double[] destinationCoords = geocodingService.getCoordinates(arrivalDTO.getCity());

        // 2. Calcula rota via OSRM
        RoutingService.RouteResult route = routingService.calculateRoute(originCoords, destinationCoords);

        // 3. Verifica tarifa do motorista (prioridade: DTO > Driver Default > System Pricing)
        Pricing pricing = pricingService.getPricing();
        double baseRate = pricing.getPerKmRate();
        
        // Pega a tarifa (priorizando DTO, depois Driver, depois Sistema)
        double perKmRate = (dto.getPerKmRate() != null && dto.getPerKmRate() > 0)
                ? dto.getPerKmRate()
                : (driver.getRatePerKm() != null && driver.getRatePerKm() > 0)
                ? driver.getRatePerKm()
                : baseRate;

        // Mantém a validação de faixa solicitada (0.8x a 1.3x da base)
        double minRate = baseRate * 0.8;
        double maxRate = baseRate * 1.3;

        if (perKmRate < minRate || perKmRate > maxRate) {
            throw new IllegalArgumentException(String.format("A tarifa deve estar entre %.2f e %.2f", minRate, maxRate));
        }

        // 4. Calcula totalAmount (estimativa inicial se vier sem passageiros)
        double totalAmount = getTotalAmount(dto, route, pricing, driver);

        // 4. Monta e salva a Trip
        Trip trip = new Trip();
        trip.setDriver(driver);
        trip.setDeparture(new Location(departureDTO.getCity(), departureDTO.getStreet(), departureDTO.getReference()));
        trip.setArrival(new Location(arrivalDTO.getCity(), arrivalDTO.getStreet(), arrivalDTO.getReference()));
        trip.setDate(dto.getDate());
        trip.setTime(dto.getTime());
        trip.setTotalSeats(dto.getTotalSeats());

        if (dto.getPassengerIds() != null && !dto.getPassengerIds().isEmpty()) {
            List<Passenger> passengers = passengerRepository.findAllById(dto.getPassengerIds());
            if (passengers.size() > dto.getTotalSeats()) {
                throw new IllegalArgumentException("A quantidade inicial de passageiros excede a capacidade da viagem");
            }
            trip.setPassengers(passengers);
            trip.setAvailableSeats(dto.getTotalSeats() - passengers.size());
        } else {
            trip.setPassengers(new ArrayList<>());
            trip.setAvailableSeats(dto.getTotalSeats());
        }

        trip.setStatus(TripStatus.SCHEDULED);
        trip.setDistanceKm(route.distanceKm());
        trip.setTaxByKM(perKmRate);
        trip.setDurationMinutes(route.durationMinutes());
        trip.setTotalAmount(totalAmount);

        tripRepository.save(trip);
        return TripDetailsDTO.fromEntity(trip);
    }

    /**
     * Calcula o total arrecadado na viagem.
     * Fórmula:
     * pricePerPassenger = max(minimumFare, perKmRate × distanceKm)
     * totalAmount = pricePerPassenger × numberOfPassengers
     * O motorista pode definir seu próprio perKmRate.
     * Se não definir, usa o perKmRate padrão do Pricing.
     * O minimumFare do Pricing sempre é respeitado como piso mínimo por passageiro.
     */
    private double getTotalAmount(CreateTripDTO dto, RoutingService.RouteResult route, Pricing pricing, com.vanvan.model.Driver driver) {
        double perKmRate = (dto.getPerKmRate() != null && dto.getPerKmRate() > 0)
                ? dto.getPerKmRate()
                : (driver.getRatePerKm() != null && driver.getRatePerKm() > 0)
                ? driver.getRatePerKm()
                : pricing.getPerKmRate();

        // Calculate unit price per seat
        double pricePerSeat = Math.max(
                pricing.getMinimumFare(),
                perKmRate * route.distanceKm()
        );

        // Total amount is the sum of all passenger fares (current count)
        int passengerCount = (dto.getPassengerIds() != null) ? dto.getPassengerIds().size() : 0;
        return pricePerSeat * passengerCount;
    }

    public void recalculateTripTotalAmount(Trip trip) {
        Pricing pricing = pricingService.getPricing();
        double pricePerPassenger = Math.max(
                pricing.getMinimumFare(),
                trip.getTaxByKM() * trip.getDistanceKm()
        );
        trip.setTotalAmount(pricePerPassenger * trip.getPassengers().size());
    }

    @Transactional
    public TripDetailsDTO bookTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new TripNotFoundException(tripId.toString()));

        if (trip.getStatus() != TripStatus.SCHEDULED) {
            throw new IllegalArgumentException("Apenas viagens agendadas podem ser reservadas.");
        }

        if (trip.getAvailableSeats() <= 0) {
            throw new IllegalArgumentException("Não há assentos disponíveis para esta viagem.");
        }

        UUID passengerId = ((com.vanvan.model.User) Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getPrincipal()).getId();

        Passenger passenger = passengerRepository.findById(passengerId)
                .orElseThrow(() -> new IllegalArgumentException("Passageiro não encontrado"));

        if (trip.getPassengers().stream().anyMatch(p -> p.getId().equals(passengerId))) {
            throw new IllegalArgumentException("Você já está registrado nesta viagem.");
        }

        trip.addPassenger(passenger);
        trip.setAvailableSeats(trip.getAvailableSeats() - 1);
        recalculateTripTotalAmount(trip);
        
        tripRepository.save(trip);
        return TripDetailsDTO.fromEntity(trip);
    }

    @Transactional
    public TripDetailsDTO cancelBooking(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new TripNotFoundException(tripId.toString()));

        UUID passengerId = ((com.vanvan.model.User) Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getPrincipal()).getId();

        Passenger passenger = passengerRepository.findById(passengerId)
                .orElseThrow(() -> new IllegalArgumentException("Passageiro não encontrado"));

        if (trip.getPassengers().stream().noneMatch(p -> p.getId().equals(passengerId))) {
            throw new IllegalArgumentException("Você não possui reserva nesta viagem.");
        }
        
        if (trip.getStatus() != TripStatus.SCHEDULED) {
            throw new IllegalArgumentException("Apenas reservas em viagens agendadas podem ser canceladas.");
        }

        trip.removePassenger(passenger);
        trip.setAvailableSeats(trip.getAvailableSeats() + 1);
        recalculateTripTotalAmount(trip);

        tripRepository.save(trip);
        return TripDetailsDTO.fromEntity(trip);
    }

    @Transactional
    public TripDetailsDTO updateStatus(Long tripId, TripStatus newStatus) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new TripNotFoundException(tripId.toString()));

        // extrai o driverId do token JWT via SecurityContext
        UUID driverId = ((com.vanvan.model.User) Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getPrincipal()).getId();

        if (!trip.getDriver().getId().equals(driverId)) {
            throw new AccessDeniedException("Você não tem permissão para atualizar esta viagem");
        }

        TripStatus currentStatus = trip.getStatus();
        Set<TripStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(currentStatus, Set.of());
        if (!allowed.contains(newStatus)) {
            throw new InvalidStatusTransitionException(currentStatus, newStatus);
        }

        trip.setStatus(newStatus);
        tripRepository.save(trip);
        broadcastSnapshot();

        return TripDetailsDTO.fromEntity(trip);
    }

    // busca histórico de viagens com filtros dinâmicos
    public Page<TripHistoryDTO> getTripHistory(
            LocalDate startDate, LocalDate endDate,
            UUID driverId,
            String departureCity,
            String arrivalCity,
            TripStatus status,
            Pageable pageable
    ) {
        return tripRepository.findAll(
                TripSpecification.filter(startDate, endDate, driverId, departureCity, arrivalCity, status),
                pageable
        ).map(this::toHistoryDTO);
    }

    public Page<TripHistoryDTO> getPassengerTripHistory(
            LocalDate startDate, LocalDate endDate,
            String departureCity,
            String arrivalCity,
            TripStatus status,
            UUID passengerId,
            Pageable pageable
    ) {
        return tripRepository.findAll(
                TripSpecification.passengerHistory(startDate, endDate, departureCity, arrivalCity, passengerId, status),
                pageable
        ).map(this::toHistoryDTO);
    }

    // busca detalhes de uma viagem pelo id
    public TripDetailsDTO getTripDetails(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new TripNotFoundException(id.toString()));
        return TripDetailsDTO.fromEntity(trip);
    }

    // retorna snapshot de todas as viagens para o painel de monitoramento do admin
    public Page<TripMonitorDTO> getMonitoringData(TripStatus status, Pageable pageable) {
        return tripRepository.findAll(
                TripSpecification.filter(null, null, null, null, null, status),
                pageable
        ).map(TripMonitorDTO::fromEntity);
    }

    // busca de viagens para passageiros
    public Page<TripHistoryDTO> searchTrips(
            LocalDate date,
            String departureCity,
            String arrivalCity,
            Integer passengerCount,
            Pageable pageable
    ) {
        return tripRepository.findAll(
                TripSpecification.search(date, departureCity, arrivalCity, passengerCount, TripStatus.SCHEDULED),
                pageable
        ).map(this::toHistoryDTO);
    }

    // a cada 15 segundos empurra as viagens IN_PROGRESS para os admins conectados
    @Scheduled(fixedDelay = 15000)
    public void broadcastActiveTrips() {
        broadcastSnapshot();
    }

    // ── helpers ──────────────────────────────────────────────────

    private void broadcastSnapshot() {
        List<TripMonitorDTO> activeTrips = tripRepository.findAll(
                TripSpecification.filter(null, null, null, null, null, TripStatus.IN_PROGRESS),
                Pageable.unpaged()
        ).map(TripMonitorDTO::fromEntity).getContent();

        messagingTemplate.convertAndSend("/topic/monitoring", activeTrips);
    }

    private TripHistoryDTO toHistoryDTO(Trip trip) {
        String route = trip.getDeparture().getCity() + " -> " + trip.getArrival().getCity();
        return new TripHistoryDTO(
                trip.getId(),
                trip.getDate(),
                trip.getTime(),
                trip.getDriver().getName(),
                trip.getDeparture().getCity(),
                trip.getDeparture().getStreet(),
                trip.getDeparture().getReferencePoint(),
                trip.getArrival().getCity(),
                trip.getArrival().getStreet(),
                trip.getArrival().getReferencePoint(),
                route,
                trip.getPassengers().size(),
                trip.getAvailableSeats(),
                trip.getTotalSeats(),
                trip.getDistanceKm(),
                trip.getTotalAmount(),
                trip.getStatus()
        );
    }
}