package com._yp.gaitMate.s3.exception;

import com._yp.gaitMate.exception.ApiException;

public class S3DownloadException extends ApiException {

    public S3DownloadException() {
        super();
    }

    public S3DownloadException(String message) {
        super(message);
    }
}