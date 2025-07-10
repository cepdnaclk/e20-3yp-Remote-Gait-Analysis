package com._yp.gaitMate.service.reportDownloadSerivce;


import com._yp.gaitMate.exception.ResourceNotFoundException;
import com._yp.gaitMate.model.ProcessedTestResults;
import com._yp.gaitMate.repository.ProcessedTestResultsRepository;
import com._yp.gaitMate.s3.exception.PresignedUrlRefreshException;
import com._yp.gaitMate.s3.service.S3DownloadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportDownloadServiceImpl implements ReportDownloadService {
    private final S3DownloadService s3DownloadService;
    private final ProcessedTestResultsRepository processedTestResultsRepository;

    @Override
    public byte[] downloadReportForSession(Long sessionId) {
        ProcessedTestResults result = processedTestResultsRepository.findBySession_Id(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("ProcessedTestResults", "sessionId", sessionId));

        String originalUrl = result.getPressureResultsPath();

        try {
            // Attempt download with existing URL
            log.debug("🔗 Attempting download with URL: {}", originalUrl);
            return s3DownloadService.downloadFileFromS3(originalUrl);
        } catch (Exception firstAttemptException) {
            log.warn("⚠️ Initial download failed for sessionId={}. Trying with refreshed URL...", sessionId);

            try {
                // Generate new presigned URL
                String newUrl = s3DownloadService.generatePresignedUrl(originalUrl);

                // Update entity and persist new URL
                result.setPressureResultsPath(newUrl);
                processedTestResultsRepository.save(result);

                // Retry download
                return s3DownloadService.downloadFileFromS3(newUrl);
            } catch (Exception secondAttemptException) {
                log.error("❌ Failed to download report even after refreshing URL for sessionId={}", sessionId, secondAttemptException);
                throw new RuntimeException("Failed to download report after retry. Please try again later.");
            }
        }
    }


    @Override
    public String getReportFileNameForSession(Long sessionId) {
        ProcessedTestResults result = processedTestResultsRepository.findBySession_Id(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "ProcessedTestResults", "sessionId", sessionId));

        return s3DownloadService.extractFilenameFromS3Url(result.getPressureResultsPath());
    }

//    @Override
//    public boolean refreshPresignedUrl(Long sessionId) {
//        try {
//            // Step 1: Find existing result
//            ProcessedTestResults result = processedTestResultsRepository.findBySession_Id(sessionId)
//                    .orElseThrow(() -> new ResourceNotFoundException(
//                            "ProcessedTestResults", "sessionId", sessionId));
//
//            // Step 2: Extract old url
//            String oldUrl = result.getPressureResultsPath();
//
//            // Step 3: Generate a fresh presigned URL
//            String newPresignedUrl = s3DownloadService.generatePresignedUrl(oldUrl);
//
//            // Step 4: Update result and save
//            result.setPressureResultsPath(newPresignedUrl);
//            processedTestResultsRepository.save(result);
//
//            return true;
//        } catch (Exception e) {
//            log.error("❌ Error refreshing presigned URL for sessionId={}: {}", sessionId, e.getMessage(), e);
//            throw new PresignedUrlRefreshException("Could not refresh presigned URL for sessionId=" + sessionId);
//        }
//    }

}
