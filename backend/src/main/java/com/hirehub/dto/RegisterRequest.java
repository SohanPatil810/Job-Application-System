package com.hirehub.dto;

import com.hirehub.models.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role; // ROLE_RECRUITER or ROLE_CANDIDATE
}
