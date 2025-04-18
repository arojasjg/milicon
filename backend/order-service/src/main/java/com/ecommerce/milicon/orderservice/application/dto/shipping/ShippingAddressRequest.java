package com.ecommerce.milicon.orderservice.application.dto.shipping;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShippingAddressRequest {

    @NotBlank(message = "El nombre del destinatario es obligatorio")
    @Size(max = 100, message = "El nombre del destinatario no puede tener más de 100 caracteres")
    private String recipientName;

    @NotBlank(message = "La dirección es obligatoria")
    @Size(max = 200, message = "La dirección no puede tener más de 200 caracteres")
    private String streetAddress;

    @Size(max = 200, message = "La línea 2 de dirección no puede tener más de 200 caracteres")
    private String addressLine2;

    @NotBlank(message = "La ciudad es obligatoria")
    @Size(max = 100, message = "La ciudad no puede tener más de 100 caracteres")
    private String city;

    @NotBlank(message = "El estado/provincia es obligatorio")
    @Size(max = 100, message = "El estado/provincia no puede tener más de 100 caracteres")
    private String state;

    @NotBlank(message = "El código postal es obligatorio")
    @Size(max = 20, message = "El código postal no puede tener más de 20 caracteres")
    private String postalCode;

    @NotBlank(message = "El país es obligatorio")
    @Size(max = 100, message = "El país no puede tener más de 100 caracteres")
    private String country;

    @Size(max = 20, message = "El número de teléfono no puede tener más de 20 caracteres")
    private String phoneNumber;
}