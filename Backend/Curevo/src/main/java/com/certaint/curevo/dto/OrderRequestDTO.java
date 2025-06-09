package com.certaint.curevo.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequestDTO {
    private String address;
    private String email;
    private String name;
    private String phone;
    private String instructions;// 📌 Updated
    private double lat;
    private double lng;

}
