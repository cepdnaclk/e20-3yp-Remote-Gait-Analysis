package com._yp.gaitMate.s3.controller;

import com._yp.gaitMate.dto.ApiResponse;
import com._yp.gaitMate.s3.service.S3DownloadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/s3/test")
// ✅ Remove @CrossOrigin - let your existing CORS config handle it
public class S3TestController {

    @Autowired
    private S3DownloadService s3DownloadService;

    @GetMapping("/parse-url")
    public ResponseEntity<?> testUrlParsing(@RequestParam String url) {
        try {
            String filename = s3DownloadService.extractFilenameFromS3Url(url);

            Map<String, Object> response = new HashMap<>();
            response.put("originalUrl", url);
            response.put("extractedFilename", filename);
            response.put("status", "success");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            ApiResponse errorResponse = new ApiResponse(
                    "Failed to parse URL: " + e.getMessage(),
                    false
            );
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/file-exists")
    public ResponseEntity<?> testFileExists(@RequestParam String url) {
        try {
            boolean exists = s3DownloadService.fileExists(url);
            String filename = s3DownloadService.extractFilenameFromS3Url(url);

            Map<String, Object> response = new HashMap<>();
            response.put("url", url);
            response.put("filename", filename);
            response.put("exists", exists);
            response.put("status", "success");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            ApiResponse errorResponse = new ApiResponse(
                    "Failed to check file existence: " + e.getMessage(),
                    false
            );
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/download-info")
    public ResponseEntity<?> testDownloadInfo(@RequestParam String url) {
        try {
            String filename = s3DownloadService.extractFilenameFromS3Url(url);
            boolean exists = s3DownloadService.fileExists(url);

            Map<String, Object> response = new HashMap<>();
            response.put("url", url);
            response.put("filename", filename);
            response.put("fileExists", exists);
            response.put("bucketConfigured", true);
            response.put("status", "success");

            if (exists) {
                response.put("message", "File is ready for download");
            } else {
                response.put("message", "File not found in S3");
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            ApiResponse errorResponse = new ApiResponse(
                    "Error getting download info: " + e.getMessage(),
                    false
            );
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}