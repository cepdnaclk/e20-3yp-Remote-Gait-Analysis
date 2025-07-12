package com._yp.gaitMate.s3.service;

import com._yp.gaitMate.s3.exception.S3DownloadException;
import com._yp.gaitMate.s3.exception.S3UrlParsingException;

public interface S3DownloadService {

    /**
     * Downloads a file from S3 using the provided S3 URL
     *
     * @param s3Url The complete S3 URL (including presigned parameters)
     * @return byte array containing the file content
     * @throws S3DownloadException if download fails
     * @throws S3UrlParsingException if S3 URL is invalid
     */
    byte[] downloadFileFromS3(String s3Url) throws S3DownloadException, S3UrlParsingException;

    /**
     * Extracts the filename from an S3 URL
     *
     * @param s3Url The complete S3 URL
     * @return The filename extracted from the URL
     * @throws S3UrlParsingException if S3 URL is invalid
     */
    String extractFilenameFromS3Url(String s3Url) throws S3UrlParsingException;

    /**
     * Checks if a file exists in S3
     *
     * @param s3Url The complete S3 URL
     * @return true if file exists, false otherwise
     * @throws S3UrlParsingException if S3 URL is invalid
     * @throws S3DownloadException if S3 operation fails
     */
    boolean fileExists(String s3Url) throws S3UrlParsingException, S3DownloadException;

    /**
     * Regenerates a fresh presigned URL from an existing (possibly expired) S3 URL
     *
     * @param oldUrl The original presigned S3 URL (expired or not)
     * @return A new valid presigned URL
     */
    String generatePresignedUrl(String oldUrl) throws S3UrlParsingException;




}