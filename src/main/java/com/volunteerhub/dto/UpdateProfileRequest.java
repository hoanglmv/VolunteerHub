package com.volunteerhub.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String phone;
    // Có thể thêm bio, address... tùy ý bạn
}