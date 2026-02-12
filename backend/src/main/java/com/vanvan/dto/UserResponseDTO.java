package com.vanvan.dto;

import com.vanvan.enums.UserRole;
import com.vanvan.model.User;

//por ora não se sabe o que vai ser preciso, então vai tudo menos a senha.
public record UserResponseDTO(
        String name,
        String cpf,
        String phone,
        String email,
        UserRole role
) {
    public static UserResponseDTO from(User user) {
        return new UserResponseDTO(
                user.getName(),
                user.getCpf(),
                user.getPhone(),
                user.getEmail(),
                user.getRole()
        );
    }
}
