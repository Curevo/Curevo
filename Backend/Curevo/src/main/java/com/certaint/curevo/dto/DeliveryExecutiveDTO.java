package com.certaint.curevo.dto;


import com.certaint.curevo.enums.DeliveryExecutiveStatus;
import com.certaint.curevo.enums.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DeliveryExecutiveDTO {
    private Long id; // For updates
    private String email;
    private String password; // Only for creation, or if password reset is allowed during update
    private String phone;
    private String vehicleType;
    private DeliveryExecutiveStatus status = DeliveryExecutiveStatus.NOT_VERIFIED; // Can be set during creation or update
    private String imageUrl;
    private String name;

    // ExecutiveDocument fields
    private String aadharNumber;
    private String panNumber;
    private String bankAccountNumber;
    private String bankIFSC;
    private String bankName;
    private String vehicleNumber;
}