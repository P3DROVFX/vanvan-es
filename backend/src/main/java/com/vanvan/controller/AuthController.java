package com.vanvan.controller;

import com.vanvan.dto.*;
import org.springframework.web.bind.annotation.*;
import com.vanvan.config.security.JwtService;
import com.vanvan.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private AuthenticationManager authenticationManager;

    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody RegisterDTO data) {
        var user = userService.register(data);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserResponseDTO.from(user));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> login(@RequestBody LoginRequestDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());

        var auth = this.authenticationManager.authenticate(usernamePassword);

        var user = (UserDetails) auth.getPrincipal();

        //adicionado devido a warning
        assert user != null;

        String token = jwtService.generateToken(user.getUsername());

        return ResponseEntity.ok(new TokenResponseDTO(token));

    }

}