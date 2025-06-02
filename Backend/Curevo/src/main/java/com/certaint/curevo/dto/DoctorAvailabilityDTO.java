package com.certaint.curevo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class DoctorAvailabilityDTO {

    private String day;

    private LocalTime time;

    private Integer maxAppointments;
}
