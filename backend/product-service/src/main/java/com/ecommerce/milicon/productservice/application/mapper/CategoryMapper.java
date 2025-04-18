package com.ecommerce.milicon.productservice.application.mapper;

import com.ecommerce.milicons.productservice.application.dto.category.CategoryResponse;
import com.ecommerce.milicons.productservice.domain.model.Category;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryResponse toCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}