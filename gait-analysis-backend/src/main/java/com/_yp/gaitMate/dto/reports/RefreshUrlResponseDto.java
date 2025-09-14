package com._yp.gaitMate.dto.reports;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RefreshUrlResponseDto {
    private boolean success;
    private String message;
}