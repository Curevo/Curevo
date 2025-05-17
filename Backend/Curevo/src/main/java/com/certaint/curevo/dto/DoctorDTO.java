package com.certaint.curevo.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class DoctorDTO {

    private UserDTO user;

    private String name;

    private String specialization;

    private List<DoctorAvailabilityDTO> availabilities;

    private String image;
}
