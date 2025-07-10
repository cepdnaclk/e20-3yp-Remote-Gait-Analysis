package com._yp.gaitMate.controller;

import com._yp.gaitMate.dto.reports.RefreshUrlResponseDto;
import com._yp.gaitMate.dto.reports.ReportDownloadErrorDto;
import com._yp.gaitMate.exception.ResourceNotFoundException;
import com._yp.gaitMate.service.reportDownloadSerivce.ReportDownloadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@Slf4j
public class ReportDownloadController {

    private final ReportDownloadService reportDownloadService;

    @GetMapping("/{sessionId}/download-report")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR')")
    public ResponseEntity<?> downloadReport(@PathVariable Long sessionId) {
        log.info("📥 Received report download request for sessionId={}", sessionId);

        try {
            byte[] fileBytes = reportDownloadService.downloadReportForSession(sessionId);
            String filename = reportDownloadService.getReportFileNameForSession(sessionId);

            log.info("✅ Successfully downloaded report file '{}' for sessionId={}", filename, sessionId);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "no-store, no-cache, must-revalidate")
                    .body(fileBytes);

        } catch (ResourceNotFoundException e) {
            log.warn("🔍 No report found for sessionId={}", sessionId);
            return ResponseEntity.status(404).body(
                    ReportDownloadErrorDto.builder()
                            .success(false)
                            .message("No report found for sessionId=" + sessionId)
                            .build()
            );

        } catch (Exception e) {
            log.error("❌ Report download failed for sessionId={}. Reason: {}", sessionId, e.getMessage(), e);
            return ResponseEntity.status(500).body(
                    ReportDownloadErrorDto.builder()
                            .success(false)
                            .message("Could not download report at this time. Please try again later.")
                            .build()
            );
        }
    }



//    @GetMapping("/{sessionId}/report-url")
//    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR')")
//    public ResponseEntity<?> refreshReportUrl(@PathVariable Long sessionId) {
//        log.info("🔄 Refreshing report URL for sessionId={}", sessionId);
//
//        boolean refreshed = reportDownloadService.refreshPresignedUrl(sessionId);
//
//        if (refreshed) {
//            log.info("✅ Refreshed presigned URL for sessionId={}", sessionId);
//            return ResponseEntity.ok(
//                    RefreshUrlResponseDto.builder()
//                            .success(true)
//                            .message("Presigned URL refreshed successfully for sessionId=" + sessionId)
//            );
//        } else {
//            log.warn("⚠️ No update needed or failed for sessionId={}", sessionId);
//            return ResponseEntity.status(500).body(
//                    RefreshUrlResponseDto.builder()
//                    .success(false)
//                    .message("No update needed or failed for sessionId=" + sessionId).build()
//            );
//        }
//    }

}
