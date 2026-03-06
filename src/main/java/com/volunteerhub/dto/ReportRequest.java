package com.volunteerhub.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReportRequest {
    @NotBlank(message = "Lý do báo cáo không được để trống")
    private String reason;
}
