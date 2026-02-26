package com.vanvan.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND) //http 404
public class DriverNotFoundException extends RuntimeException {
    public DriverNotFoundException() {
        super("O motorista não foi encontrado.");
    }
}