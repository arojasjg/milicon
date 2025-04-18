package com.ecommerce.milicons.productservice.application.mapper;

import com.ecommerce.milicons.productservice.application.dto.product.ProductRequest;
import com.ecommerce.milicons.productservice.application.dto.product.ProductUpdateRequest;
import com.ecommerce.milicons.productservice.application.dto.product.ProductResponse;
import com.ecommerce.milicons.productservice.domain.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductResponse toProductResponse(Product product);

    default ProductUpdateRequest toProductUpdateRequest(ProductRequest request) {
        if (request == null) {
            return null;
        }

        return ProductUpdateRequest.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .categoryId(request.getCategoryId())
                .imageUrl(request.getImageUrl())
                .build();
    }

    // Other mapping methods...
}