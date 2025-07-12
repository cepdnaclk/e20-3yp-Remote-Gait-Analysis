package com._yp.gaitMate.s3.exception;

import com._yp.gaitMate.exception.ApiException;

public class S3UrlParsingException extends ApiException {

    public S3UrlParsingException() {
        super();
    }

    public S3UrlParsingException(String message) {
        super(message);
    }
}