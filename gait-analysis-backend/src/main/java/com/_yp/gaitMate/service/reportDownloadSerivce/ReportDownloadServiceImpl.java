package com._yp.gaitMate.service.reportDownloadSerivce;


import com._yp.gaitMate.exception.ResourceNotFoundException;
import com._yp.gaitMate.model.ProcessedTestResults;
import com._yp.gaitMate.repository.ProcessedTestResultsRepository;
import com._yp.gaitMate.s3.service.S3DownloadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportDownloadServiceImpl implements ReportDownloadService {
    private final S3DownloadService s3DownloadService;
    private final ProcessedTestResultsRepository processedTestResultsRepository;

    @Override
    public byte[] downloadReportForSession(Long sessionId) {
        ProcessedTestResults result = processedTestResultsRepository.findBySession_Id(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException( "ProcessedTestResults", "sessionId", sessionId));

        return s3DownloadService.downloadFileFromS3(result.getPressureResultsPath());
    }

    @Override
    public String getReportFileNameForSession(Long sessionId) {
        ProcessedTestResults result = processedTestResultsRepository.findBySession_Id(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "ProcessedTestResults", "sessionId", sessionId));

        return s3DownloadService.extractFilenameFromS3Url(result.getPressureResultsPath());
    }
}
