package com.ecommerce.milicon.orderservice.application.mapper;

import org.springframework.stereotype.Component;

import com.ecommerce.milicon.orderservice.application.dto.shipping.ShippingAddressRequest;
import com.ecommerce.milicon.orderservice.application.dto.shipping.ShippingAddressResponse;
import com.ecommerce.milicon.orderservice.domain.model.ShippingAddress;

@Component
public class ShippingAddressMapper {

    public ShippingAddress toShippingAddress(ShippingAddressRequest request) {
        return ShippingAddress.builder()
                .recipientName(request.getRecipientName())
                .streetAddress(request.getStreetAddress())
                .addressLine2(request.getAddressLine2())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .country(request.getCountry())
                .phoneNumber(request.getPhoneNumber())
                .build();
    }

    public ShippingAddressResponse toShippingAddressResponse(ShippingAddress address) {
        return ShippingAddressResponse.builder()
                .id(address.getId())
                .recipientName(address.getRecipientName())
                .streetAddress(address.getStreetAddress())
                .addressLine2(address.getAddressLine2())
                .city(address.getCity())
                .state(address.getState())
                .postalCode(address.getPostalCode())
                .country(address.getCountry())
                .phoneNumber(address.getPhoneNumber())
                .build();
    }
}