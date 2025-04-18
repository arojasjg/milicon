package com.ecommerce.milicons.productservice.application.service;

import com.ecommerce.milicons.productservice.application.dto.category.CategoryRequest;
import com.ecommerce.milicons.productservice.application.dto.category.CategoryResponse;
import com.ecommerce.milicons.productservice.domain.model.Category;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse getCategoryById(UUID id);

    List<CategoryResponse> getAllCategories();

    CategoryResponse updateCategory(UUID id, CategoryRequest request);

    void deleteCategory(UUID id);

    Category findCategoryEntityById(UUID id);
}