package com.vanvan.exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Trata os erros de anotação do DTO (@NotBlank, @Email, etc)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // Pega o primeiro erro da lista para mostrar no Toast
        String mensagemErro = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        
        Map<String, String> response = new HashMap<>();
        response.put("message", mensagemErro); 
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(CpfAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleCpfAlreadyExists(CpfAlreadyExistsException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage()); // Vai retornar a mensagem que você definiu na exception
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(CnhAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleCnhAlreadyExists(CnhAlreadyExistsException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

   @ExceptionHandler(UnderageDriverException.class)
    public ResponseEntity<Map<String, String>> handleUnderageDriver(UnderageDriverException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(UnderageUserException.class)
    public ResponseEntity<Map<String, String>> handleUnderageUser(UnderageUserException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}