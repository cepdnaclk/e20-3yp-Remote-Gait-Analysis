package com._yp.gaitMate.controller;

import com._yp.gaitMate.service.reportDownloadSerivce.ReportDownloadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@Slf4j
public class ReportDownloadController {

    private final ReportDownloadService reportDownloadService;

    @GetMapping("/{sessionId}/download-report")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR')")
    public ResponseEntity<byte[]> downloadReport(@PathVariable Long sessionId) {
        log.info("📥 Received report download request for sessionId={}", sessionId);

        byte[] fileBytes;
        String filename;

        try {
            fileBytes = reportDownloadService.downloadReportForSession(sessionId);
            filename = reportDownloadService.getReportFileNameForSession(sessionId);
            log.info("✅ Successfully downloaded report file '{}' for sessionId={}", filename, sessionId);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(fileBytes);

        } catch (Exception e) {
            log.error("❌ Failed to download report for sessionId={}. Reason: {}", sessionId, e.getMessage(), e);
            throw e; // Let your global exception handler respond
        }
    }
}
