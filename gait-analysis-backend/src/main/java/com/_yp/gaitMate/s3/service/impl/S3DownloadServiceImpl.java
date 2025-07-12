package com._yp.gaitMate.s3.service.impl;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com._yp.gaitMate.s3.exception.S3DownloadException;
import com._yp.gaitMate.s3.exception.S3UrlParsingException;
import com._yp.gaitMate.s3.service.S3DownloadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Date;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class S3DownloadServiceImpl implements S3DownloadService {

    @Autowired
    private AmazonS3 amazonS3;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Override
    public byte[] downloadFileFromS3(String s3Url) throws S3DownloadException, S3UrlParsingException {
        String s3Key = extractS3KeyFromUrl(s3Url);

        try {
            S3Object s3Object = amazonS3.getObject(bucketName, s3Key);
            S3ObjectInputStream inputStream = s3Object.getObjectContent();

            // Read the stream into byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            byte[] buffer = new byte[8192];
            int bytesRead;

            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }

            inputStream.close();
            return outputStream.toByteArray();

        } catch (AmazonS3Exception e) {
            if (e.getStatusCode() == 404) {
                throw new S3DownloadException("File not found in S3: " + s3Key);
            }
            throw new S3DownloadException("S3 error: " + e.getMessage());
        } catch (IOException e) {
            throw new S3DownloadException("Error reading S3 file: " + e.getMessage());
        } catch (Exception e) {
            throw new S3DownloadException("Failed to download file from S3: " + e.getMessage());
        }
    }

    @Override
    public String extractFilenameFromS3Url(String s3Url) throws S3UrlParsingException {
        String s3Key = extractS3KeyFromUrl(s3Url);

        String[] parts = s3Key.split("/");
        if (parts.length > 0) {
            return parts[parts.length - 1];
        }

        return "gait_analysis_report.pdf"; // Default filename
    }

    @Override
    public boolean fileExists(String s3Url) throws S3UrlParsingException, S3DownloadException {
        String s3Key = extractS3KeyFromUrl(s3Url);

        try {
            return amazonS3.doesObjectExist(bucketName, s3Key);
        } catch (AmazonS3Exception e) {
            throw new S3DownloadException("Error checking file existence: " + e.getMessage());
        } catch (Exception e) {
            throw new S3DownloadException("Error checking file existence: " + e.getMessage());
        }
    }

    @Override
    public String generatePresignedUrl(String oldUrl) throws S3UrlParsingException {
        String s3Key = extractS3KeyFromUrl(oldUrl); // your existing private helper
        // Then use s3Key to build a new presigned URL
        // Example using AmazonS3:
        Date expiration = new Date(System.currentTimeMillis() + TimeUnit.HOURS.toMillis(24));
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucketName, s3Key)
                .withMethod(HttpMethod.GET)
                .withExpiration(expiration);
        return amazonS3.generatePresignedUrl(request).toString();
    }

    /**
     * Private helper method to extract S3 key from URL
     */

    private String extractS3KeyFromUrl(String url) throws S3UrlParsingException {
        if (url == null || url.trim().isEmpty()) {
            throw new S3UrlParsingException("S3 URL cannot be null or empty");
        }

        try {
            // Extract S3 key from presigned URL
            // Example: https://bucket.s3.amazonaws.com/reports/file.pdf?X-Amz-Algorithm=...
            Pattern pattern = Pattern.compile("https://[^/]+\\.s3[^/]*\\.amazonaws\\.com/(.+?)(?:\\?|$)");
            Matcher matcher = pattern.matcher(url);

            if (matcher.find()) {
                String s3Key = matcher.group(1);
                if (s3Key == null || s3Key.trim().isEmpty()) {
                    throw new S3UrlParsingException("Invalid S3 key extracted from URL");
                }
                return s3Key; // Returns "reports/gait_analysis_session_X.pdf"
            }

            throw new S3UrlParsingException("Invalid S3 URL format: " + url);

        } catch (Exception e) {
            if (e instanceof S3UrlParsingException) {
                throw e; // Re-throw our custom exception
            }
            throw new S3UrlParsingException("Error parsing S3 URL: " + e.getMessage());
        }
    }


}