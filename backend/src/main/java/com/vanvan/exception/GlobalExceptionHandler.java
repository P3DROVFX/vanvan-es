package com.vanvan.exception;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    private static final String KEYMAP = "message";

    // 1. Trata os erros de anotação do DTO (@NotBlank, @Email, etc)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // Pega o primeiro erro da lista para mostrar no Toast
        String mensagemErro = ex.getBindingResult().getAllErrors().getFirst().getDefaultMessage();
        
        Map<String, String> response = new HashMap<>();
        response.put(KEYMAP, mensagemErro); 
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(CpfAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleCpfAlreadyExists(CpfAlreadyExistsException ex) {
        Map<String, String> response = new HashMap<>();
        response.put(KEYMAP, ex.getMessage()); // Vai retornar a mensagem que você definiu na exception
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        Map<String, String> response = new HashMap<>();
        response.put(KEYMAP, ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(CnhAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleCnhAlreadyExists(CnhAlreadyExistsException ex) {
        Map<String, String> response = new HashMap<>();
        response.put(KEYMAP, ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

   @ExceptionHandler(UnderageDriverException.class)
    public ResponseEntity<Map<String, String>> handleUnderageDriver(UnderageDriverException ex) {
        Map<String, String> response = new HashMap<>();
        response.put(KEYMAP, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(UnderageUserException.class)
    public ResponseEntity<Map<String, String>> handleUnderageUser(UnderageUserException ex) {
        Map<String, String> response = new HashMap<>();
        response.put(KEYMAP, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException ex) {

        Map<String, String> response = new HashMap<>();
        response.put(KEYMAP, ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(JWTVerificationException.class)
    public ResponseEntity<Map<String, String>> handleJWTVerificationException(JWTVerificationException ex) {
        Map<String, String> response = new HashMap<>();
        response.put(KEYMAP, "Token inválido ou expirado");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    //abaixo cria as exceptions que herdam de AuthenticationException, com mensagens hardcorded
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<Map<String, String>> handleDisabledException(DisabledException ex) {
        Map<String, String> response = new HashMap<>();
        response.put(KEYMAP, "Conta desabilitada. Entre em contato com o administrador.");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<Map<String, String>> handleLockedException(LockedException ex) {
        Map<String, String> response = new HashMap<>();
        response.put(KEYMAP, "Conta bloqueada. Entre em contato com o administrador.");
        return ResponseEntity.status(HttpStatus.LOCKED).body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentialsException(BadCredentialsException ex) {
        Map<String, String> response = new HashMap<>();
        response.put(KEYMAP, "Usuário ou senha inválidos.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDeniedException(AccessDeniedException ex) {
        Map<String, String> response = new HashMap<>();
        response.put(KEYMAP, "Acesso negado. Você não tem permissão para acessar este recurso.");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

}