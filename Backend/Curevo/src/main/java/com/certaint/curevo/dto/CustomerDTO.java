package com.certaint.curevo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CustomerDTO {

    private UserDTO user;

    private String name;

    private String address;

    private String image;
}
