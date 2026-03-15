package com.vanvan.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TripStatusTest {

    @Test
    void allValues_exist() {
        assertEquals(4, TripStatus.values().length);
    }

    @Test
    void valueOf_scheduled() {
        assertEquals(TripStatus.SCHEDULED, TripStatus.valueOf("SCHEDULED"));
    }

    @Test
    void valueOf_inProgress() {
        assertEquals(TripStatus.IN_PROGRESS, TripStatus.valueOf("IN_PROGRESS"));
    }

    @Test
    void valueOf_completed() {
        assertEquals(TripStatus.COMPLETED, TripStatus.valueOf("COMPLETED"));
    }

    @Test
    void valueOf_cancelled() {
        assertEquals(TripStatus.CANCELLED, TripStatus.valueOf("CANCELLED"));
    }

    @Test
    void name_returnsCorrectString() {
        assertEquals("SCHEDULED", TripStatus.SCHEDULED.name());
        assertEquals("IN_PROGRESS", TripStatus.IN_PROGRESS.name());
        assertEquals("COMPLETED", TripStatus.COMPLETED.name());
        assertEquals("CANCELLED", TripStatus.CANCELLED.name());
    }

    @Test
    void ordinal_isCorrect() {
        assertEquals(0, TripStatus.SCHEDULED.ordinal());
        assertEquals(1, TripStatus.IN_PROGRESS.ordinal());
        assertEquals(2, TripStatus.COMPLETED.ordinal());
        assertEquals(3, TripStatus.CANCELLED.ordinal());
    }
}