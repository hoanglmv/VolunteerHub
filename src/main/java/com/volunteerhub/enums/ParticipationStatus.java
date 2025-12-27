package com.volunteerhub.enums;

public enum ParticipationStatus {
    PENDING,    // Chờ duyệt (Mới đăng ký)
    CONFIRMED,  // Đã được quản lý duyệt
    REJECTED,   // Bị từ chối
    CANCELED,   // Tự hủy
    COMPLETED   // Đã hoàn thành công việc
}