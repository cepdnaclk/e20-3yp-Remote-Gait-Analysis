package com._yp.gaitMate.s3.exception;

public class PresignedUrlRefreshException extends RuntimeException {
    public PresignedUrlRefreshException(String message) {
        super(message);
    }
}