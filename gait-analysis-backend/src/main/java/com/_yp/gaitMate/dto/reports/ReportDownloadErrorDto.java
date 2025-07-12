package com._yp.gaitMate.dto.reports;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ReportDownloadErrorDto {
    private boolean success;
    private String message;
}