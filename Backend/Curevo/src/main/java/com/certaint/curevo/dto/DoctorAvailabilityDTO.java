package com.certaint.curevo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorAvailabilityDTO {

    private String day;    // Day of the week, e.g., "Monday"

    private String time;   // Available time, e.g., "14:00"
}
