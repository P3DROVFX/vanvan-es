package com.vanvan.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vanvan.dto.RatingCreateDTO;
import com.vanvan.dto.RatingResponseDTO;
import com.vanvan.dto.RatingStatusUpdateDTO;
import com.vanvan.enums.RatingStatus;
import com.vanvan.model.Driver;
import com.vanvan.model.Passenger;
import com.vanvan.repository.UserRepository;
import com.vanvan.service.RatingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class RatingControllerTest {

    private MockMvc mockMvc;

    @Mock private RatingService ratingService;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private RatingController ratingController;

    private UserDetails userDetailsMock;
    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule())
            .disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @BeforeEach
    void setUp() {
        userDetailsMock = mock(UserDetails.class);

        HandlerMethodArgumentResolver authResolver = new HandlerMethodArgumentResolver() {
            @Override
            public boolean supportsParameter(MethodParameter parameter) {
                return parameter.hasParameterAnnotation(
                        org.springframework.security.core.annotation.AuthenticationPrincipal.class);
            }
            @Override
            public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                          NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
                return userDetailsMock;
            }
        };

        mockMvc = MockMvcBuilders.standaloneSetup(ratingController)
                .setCustomArgumentResolvers(authResolver)
                .setControllerAdvice(new com.vanvan.exception.GlobalExceptionHandler())
                .build();
    }

    @Test
    void createRating_passengerLogado_returns200() throws Exception {
        Passenger passenger = new Passenger("Allice", "52998224725", "81988888888",
                "allice@email.com", "senha", LocalDate.of(2000, 1, 1));
        passenger.setId(UUID.randomUUID());

        RatingResponseDTO response = new RatingResponseDTO(
                1L, 1L, UUID.randomUUID(), "Motorista",
                passenger.getId(), "Allice", 5, "Ótimo!", RatingStatus.VISIBLE, LocalDateTime.now());

        when(userDetailsMock.getUsername()).thenReturn("allice@email.com");
        when(userRepository.findByEmail("allice@email.com")).thenReturn(passenger);
        when(ratingService.createRating(any(), any())).thenReturn(response);

        String body = objectMapper.writeValueAsString(new RatingCreateDTO(1L, 5, "Ótimo!"));

        mockMvc.perform(post("/api/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());
    }

    @Test
    void createRating_naoPassageiro_returns403() throws Exception {
        Driver driver = new Driver();
        driver.setId(UUID.randomUUID());

        when(userDetailsMock.getUsername()).thenReturn("driver@email.com");
        when(userRepository.findByEmail("driver@email.com")).thenReturn(driver);

        String body = objectMapper.writeValueAsString(new RatingCreateDTO(1L, 5, "ok"));

        mockMvc.perform(post("/api/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden());
    }

    @Test
    void moderateRating_returns200() throws Exception {
        RatingResponseDTO response = new RatingResponseDTO(
                1L, 1L, UUID.randomUUID(), "Motorista",
                UUID.randomUUID(), "Allice", 5, "ok", RatingStatus.HIDDEN, LocalDateTime.now());

        when(ratingService.moderateRating(any(), any())).thenReturn(response);

        String body = objectMapper.writeValueAsString(new RatingStatusUpdateDTO(RatingStatus.HIDDEN));

        mockMvc.perform(patch("/api/ratings/admin/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());
    }

    @Test
    void getMyAverageRating_motorista_returns200() throws Exception {
        Driver driver = new Driver();
        driver.setId(UUID.randomUUID());
        driver.setName("Motorista");

        when(userDetailsMock.getUsername()).thenReturn("driver@email.com");
        when(userRepository.findByEmail("driver@email.com")).thenReturn(driver);
        when(ratingService.getDriverAverageRating(any()))
                .thenReturn(new com.vanvan.dto.DriverAverageRatingDTO(4.5, 10L));

        mockMvc.perform(get("/api/ratings/me/average"))
                .andExpect(status().isOk());
    }

    @Test
    void getMyAverageRating_naoMotorista_returns403() throws Exception {
        Passenger passenger = new Passenger("Allice", "52998224725", "81988888888",
                "allice@email.com", "senha", LocalDate.of(2000, 1, 1));

        when(userDetailsMock.getUsername()).thenReturn("allice@email.com");
        when(userRepository.findByEmail("allice@email.com")).thenReturn(passenger);

        mockMvc.perform(get("/api/ratings/me/average"))
                .andExpect(status().isForbidden());
    }
}