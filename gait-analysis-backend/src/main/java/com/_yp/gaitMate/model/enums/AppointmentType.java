package com._yp.gaitMate.model.enums;

public enum AppointmentType {
    GAIT_ANALYSIS(30),
    FOLLOW_UP(30),
    GENERAL_CONSULTATION(30);

    private final int defaultDuration;

    AppointmentType(int defaultDuration) {
        this.defaultDuration = defaultDuration;
    }

    public int getDefaultDuration() {
        return defaultDuration;
    }
}
