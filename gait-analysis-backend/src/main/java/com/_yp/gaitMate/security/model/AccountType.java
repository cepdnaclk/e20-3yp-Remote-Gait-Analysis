package com._yp.gaitMate.security.model;

public enum AccountType {
    CLINIC("clinic"),
    PATIENT("patient"),
    DOCTOR("doctor");

    private final String value;

    AccountType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }
}
